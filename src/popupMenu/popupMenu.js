import '../content/css/popupMenu.css';
const axios = require('axios');
const userFriendApiUrl = 'http://localhost:8080/user_friend';

const logoutMenuItem = document.getElementById('logout-li');

function resize() {
    document.getElementById('body').style.width = document.getElementById('main-dropdown').style.width;
    document.getElementById('body').style.height = document.getElementById('main-dropdown').style.height;
}

function setMenu(loggedInEmail) {
    const loggedInUserLabel = document.getElementById("connected-as-label")
    if (loggedInEmail != "") { //user is connected
        //remove option of login
        const loginMenuItem = document.getElementById("login-li");
        if (loginMenuItem) {
            loginMenuItem.parentNode.removeChild(loginMenuItem);
            loggedInUserLabel.innerText = loggedInUserLabel.innerText + " " + loggedInEmail + " ";
            loggedInUserLabel.innerHTML = "<i class=\"fa fa-circle\"></i> " + loggedInUserLabel.innerHTML;
        }
    } else {
        //remove options of logout and profile edit
        const logoutMenuItem = document.getElementById("logout-li");
        if (logoutMenuItem) {
            logoutMenuItem.parentNode.removeChild(logoutMenuItem);
            loggedInUserLabel.parentNode.removeChild(loggedInUserLabel);
        }
        const profilePicMenuItem = document.getElementById("profile-pic-li");
        if (profilePicMenuItem) {
            profilePicMenuItem.parentNode.removeChild(profilePicMenuItem);
        }
        const friendRequestsMenuItem = document.getElementById("friend-requests-li");
        if (logoutMenuItem) {
            friendRequestsMenuItem.parentNode.removeChild(friendRequestsMenuItem);

        }
    }
}

function refreshMeidaNet() {
    chrome.tabs.query({ status: 'complete' }, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.url.match(/mtamn\.mta\.ac\.il/)) {
                console.log(tab.url);
                chrome.tabs.reload(tab.id);
            }
        });
    });
}

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

async function readNumberOfFriendRequests(userId) {
    let friendRequestsCount = -1;
    try {
        const response = await axios.get(
            `${userFriendApiUrl}/friendRequestsByUserCount`, {
                params: {
                    user_id: userId
                }
            });

        const count = response.data;
        if (count[0]) {
            friendRequestsCount = count[0].count;
        }

    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return friendRequestsCount;
}

async function updateFriendRequestsMenuItem() {
    const user_id = await getLoggedInUserIdFromChromeStorage();
    const numberOfFriendRequests = await readNumberOfFriendRequests(user_id);
    const friendRequestsMenuItem = document.querySelector("#friend-requests-li");
    if (friendRequestsMenuItem) {
        friendRequestsMenuItem.innerHTML = friendRequestsMenuItem.innerHTML + " <b>(" + numberOfFriendRequests + ")</b>";
    }
}


addEventListener('DOMContentLoaded', resize);
updateFriendRequestsMenuItem();

logoutMenuItem.addEventListener('click', (e) => {
    chrome.storage.sync.set({ 'loggedEmail': "", 'loggedUserId': "" }, function() {
        alert("התנתקת מהתוסף");
        refreshMeidaNet();
        window.close();
    })
});


let loggedInEmail = "";
chrome.storage.sync.get('loggedEmail', function(data) {
    loggedInEmail = data.loggedEmail;
    setMenu(loggedInEmail);
});