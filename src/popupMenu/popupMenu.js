import '../content/css/popupMenu.css';
import { baseUserEndpoint, baseUserFriendEndpoint } from "../utils/api";
import { getLoggedInUserIdFromChromeStorage } from '../utils/userAuth';

const axios = require('axios');
const logoutMenuItem = document.getElementById('logout-li');

function resize() {
    document.getElementById('body').style.width = document.getElementById('main-dropdown').style.width;
    document.getElementById('body').style.height = document.getElementById('main-dropdown').style.height;
}

async function setMenu(loggedInEmail) {
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
            if (tab.url.match(/mtamn\.mta\.ac\.il/) || tab.url.match(/wwwi\.colman\.ac\.il/)) {
                chrome.tabs.reload(tab.id);
            }
        });
    });
}

async function readNumberOfFriendRequests(userId) {
    let friendRequestsCount = -1;
    try {
        const response = await axios.get(
            `${baseUserFriendEndpoint}/friendRequestsByUserCount`, {
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

async function readUserCollege(userId) {
    let res = "";
    try {
        const response = await axios.get(
            `${baseUserEndpoint}/collegeByUserId`, {
                params: {
                    user_id: userId
                }
            });
        res = response.data;
    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return res;
}

async function updateFriendRequestsMenuItem() {
    const user_id = await getLoggedInUserIdFromChromeStorage();
    const userCollege = await readUserCollege(user_id);
    const friendRequestsMenuItem = document.querySelector("#friend-requests-li");
    const profilePicMenuItem = document.querySelector("#profile-pic-li");
    if (userCollege[0].college === "mta") {
        const numberOfFriendRequests = await readNumberOfFriendRequests(user_id);
        if (friendRequestsMenuItem) {
            const friendRequestsLink = document.querySelector("#friend-requests-a");
            friendRequestsLink.innerHTML = friendRequestsLink.innerHTML + " <b>(" + numberOfFriendRequests + ")</b>";
        }
    } else { //user is from minhal college, make features unavailable
        if (friendRequestsMenuItem) {
            const friendRequestDiv = document.createElement("div");
            const profilePicDiv = document.createElement("div");
            friendRequestDiv.classList.add("popup-tooltip");
            profilePicDiv.classList.add("popup-tooltip");
            friendRequestsMenuItem.classList.add("unavilable-feature-li");
            profilePicMenuItem.classList.add("unavilable-feature-li");
            friendRequestDiv.appendChild(friendRequestsMenuItem);
            profilePicDiv.appendChild(profilePicMenuItem);
            const parent = document.querySelector("#main-select");
            parent.insertBefore(profilePicDiv, parent.children[1]);
            parent.insertBefore(friendRequestDiv, parent.children[1]);
        }
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