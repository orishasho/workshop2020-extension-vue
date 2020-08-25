import '../content/css/newProfilePic.css';
const axios = require('axios');
const usersApiUrl = 'http://localhost:8080/user';
const imgurApiUrl = 'https://api.imgur.com/3/image';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const backBtn = document.getElementById('go-back');


backBtn.addEventListener('click', function() {
    window.location = "../popupMenu/popupMenu.html";
});

async function getLoggedInUserIdFromChromeStorage() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('loggedUserId', function(value) {
                resolve(value.loggedUserId);
            })
        } catch (ex) {
            reject(ex);
        }
    });
}

async function getLoggedInEmailFromChromeStorage() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('loggedEmail', function(value) {
                resolve(value.loggedEmail);
            })
        } catch (ex) {
            reject(ex);
        }
    });
}



async function readUserDetails(email) {
    let res = {};
    try {
        const response = await axios.get(
            usersApiUrl, {
                params: {
                    user_email: email
                }
            });
        res = response.data;
    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    console.dir(res);
    return res;
}

async function generatePage() {
    const user_email = await getLoggedInEmailFromChromeStorage();
    const imgRed = await readUserDetails(user_email);
    const img = imgRed[0].img;
    setImg(img);
    const imgUploadButton = document.querySelector("#imgur-upload");
    imgUploadButton.addEventListener("change", uploadImgToImgur);
}

async function uploadImgToImgur(event) {
    const authHeader = {
        'Authorization': 'Client-ID b0fd2fb1b5098c9'
    };
    const imgFile = event.target.files[0];
    const requestFormData = new FormData();
    requestFormData.append('image', imgFile);
    try {
        const imgurResponse = await axios.post(
            imgurApiUrl,
            requestFormData, { headers: authHeader });
        // THIS IS THE IMAGE URL:
        //console.log(imgurResponse.data.data.link);
        const newImgUrl = imgurResponse.data.data.link;
        //Change current img src
        setImg(newImgUrl);
        await uploadImgToDb(newImgUrl);
    } catch (e) {
        console.log(e);
    }
}

async function uploadImgToDb(imgUrl) {
    try {
        const userId = await getLoggedInUserIdFromChromeStorage();
        await axios.put(
            `${usersApiUrl}/updateImgByUserId`, { user_id: userId, img: imgUrl }
        );
    } catch (e) {
        console.log(e);
    }
}

function setImg(imgUrl) {
    const imgPlace = document.querySelector("#current-picture");
    imgPlace.setAttribute("src", imgUrl);
}

async function setPageElements() {
    //setClickEventsForTabs();
    generatePage()
}

addEventListener('DOMContentLoaded', setPageElements);