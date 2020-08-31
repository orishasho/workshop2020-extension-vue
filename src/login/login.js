import '../content/css/login.css';
import { baseUserEndpoint } from '../utils/api';

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');
const backBtn = document.getElementById('go-back');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const signupSubmitBtn = document.getElementById('signup-submit-btn');

backBtn.addEventListener('click', function() {
    window.location = "../popupMenu/popupMenu.html";
});

signupSubmitBtn.addEventListener('click', async(e) => {
    const emailAddVal = document.getElementById('signup-email-field').value;
    const pwVal = document.getElementById('signup-pw-field').value;
    const college = document.querySelector('input[name="college"]:checked').value;

    if (validateEmail(emailAddVal) && validatePassword(pwVal)) {
        let response = await readUserDetails(emailAddVal);
        if (response.password !== "") { //user exists already
            alert("המשתמש כבר קיים במערכת");
        } else {
            await storeUserDetails(emailAddVal, pwVal, college);
            let response = await readUserDetails(emailAddVal);
            chrome.storage.sync.set({ 'loggedEmail': emailAddVal, 'loggedUserId': response.user_id }, function() {
                alert("הרשמה בוצעה הצלחה");
                refreshMeidaNet();
                window.close();
            })
        }
    }
});

loginSubmitBtn.addEventListener('click', async(e) => {
    let emailAddVal = document.getElementById('login-email-field').value;
    let pwVal = document.getElementById('login-pw-field').value;
    let response = await readUserDetails(emailAddVal);

    if (response.password === "") {
        alert("כתובת המייל שהוכנסה אינה קיימת במערכת");
    } else if (response.password !== pwVal) {
        alert("הסיסמה שהוכנסה אינה נכונה");
    } else {
        chrome.storage.sync.set({ 'loggedEmail': emailAddVal, 'loggedUserId': response.user_id }, function() {
            alert(emailAddVal + " ברוכ/ה הבא/ה!");
            refreshMeidaNet();
            window.close();
        })
    }
});

loginBtn.addEventListener('click', (e) => {
    let parent = e.target.parentNode.parentNode;
    Array.from(e.target.parentNode.parentNode.classList).find((element) => {
        if (element !== "slide-up") {
            parent.classList.add('slide-up')
        } else {
            signupBtn.parentNode.classList.add('slide-up')
            parent.classList.remove('slide-up')
        }
    });
});

signupBtn.addEventListener('click', (e) => {
    let parent = e.target.parentNode;
    Array.from(e.target.parentNode.classList).find((element) => {
        if (element !== "slide-up") {
            parent.classList.add('slide-up')
        } else {
            loginBtn.parentNode.parentNode.classList.add('slide-up')
            parent.classList.remove('slide-up')
        }
    });
});

function validateEmail(inputText) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
        return true;
    } else {
        alert("כתובת הדואר האלקטרוני שהוכנסה אינה תקינה")
        return false;
    }
}

function validatePassword(inputText) {
    const pwformat = /\w{7,15}$/;
    if (inputText.match(pwformat)) {
        return true;
    } else {
        alert("הסיסמה חייבת להכיל 7-15 תווים")
        return false;
    }
}

async function readUserDetails(emailAddress) {
    let pw = "";
    let userId = "";
    try {
        const response = await axios.get(
            baseUserEndpoint, { params: { user_email: emailAddress } }
        )
        if (response.data[0]) {
            pw = response.data[0].password;
            userId = response.data[0].user_id;
        }
    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return { user_id: userId, password: pw };
}


async function storeUserDetails(userEmail, userPassword, college) {
    const apiUserDetails = { "user_email": userEmail, "user_password": userPassword, "college": college };
    try {
        await axios.post(
            baseUserEndpoint,
            apiUserDetails
        );
    } catch (error) {
        console.log(error);
    }
}

function refreshMeidaNet() {
    chrome.tabs.query({ status: 'complete' }, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.url.match(/mtamn\.mta\.ac\.il/) || tab.url.match(/wwwi\.colman\.ac\.il/)) {
                chrome.tabs.reload(tab.id);
            }
        });
    });
}