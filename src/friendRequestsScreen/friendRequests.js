import '../content/css/friendRequests.css';
const axios = require('axios');
const usersFriendsApiUrl = 'http://localhost:8080/user_friend';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const backBtn = document.getElementById('go-back');

/*

backBtn.addEventListener('click', function() {
    window.location = "../popupMenu/popupMenu.html";
})
*/


async function readFriendRequests(userId) {
    let res = {};
    try {
        const response = await axios.get(
            `${usersFriendsApiUrl}/friendRequestsByUser`, {
                params: {
                    user_id: userId
                }
            });
        res = response.data;
    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    console.dir(res);
    return res;
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

async function generateFriendRequestsPage() {
    const container = document.querySelector(".container");
    const user_id = await getLoggedInUserIdFromChromeStorage();
    const friend_requests = await readFriendRequests(user_id);
    if (friend_requests.length === 0) { //no friends requests
        const noRequestsDiv = document.createElement("div");
        noRequestsDiv.classList.add("no-requests");
        noRequestsDiv.innerText = "אין בקשות חברות";
        container.appendChild(noRequestsDiv);
    } else {
        friend_requests.forEach(request => {
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("friend-request-card");
            const profilePictureDiv = document.createElement("div");
            profilePictureDiv.classList.add("profile-picture");
            const profilePictureImg = document.createElement("img");
            profilePictureImg.setAttribute("src", request.res_img);
            profilePictureDiv.appendChild(profilePictureImg);
            const userDetailsDiv = document.createElement("div");
            userDetailsDiv.classList.add("user-details");
            const userDetailsH1 = document.createElement("h1");
            userDetailsH1.innerText = request.res_name;
            const userDetailsH2 = document.createElement("h2");
            userDetailsH2.innerText = request.res_count_mutual + " חברים משותפים";
            userDetailsDiv.appendChild(userDetailsH1);
            userDetailsDiv.appendChild(userDetailsH2);
            const actionsDiv = document.createElement("div");
            actionsDiv.classList.add("friend-request-actions");
            const acceptButton = document.createElement("button");
            acceptButton.sender = request.res_sender;
            acceptButton.receiver = user_id;
            acceptButton.status = "accepted";
            acceptButton.addEventListener("click", handleRequestActionClick);
            acceptButton.classList.add("button", "button-primary");
            acceptButton.innerText = "קבל";
            const rejectButton = document.createElement("button");
            rejectButton.sender = request.res_sender;
            rejectButton.receiver = user_id;
            rejectButton.status = "rejected";
            rejectButton.addEventListener("click", handleRequestActionClick);
            rejectButton.classList.add("button", "button-secondary");
            rejectButton.innerText = "דחה";
            actionsDiv.appendChild(acceptButton);
            actionsDiv.appendChild(rejectButton);
            cardDiv.appendChild(profilePictureDiv);
            cardDiv.appendChild(userDetailsDiv);
            cardDiv.appendChild(actionsDiv);
            container.appendChild(cardDiv);
        });
    }
}

async function handleRequestActionClick(evt) {
    const apiDetails = { "sender": evt.target.sender, "receiver": evt.target.receiver, "status": evt.target.status };
    try {
        const response = await axios.put(
            `${usersFriendsApiUrl}/setReceivedFriendRequest`,
            apiDetails
        );
        console.log(response);
    } catch (error) {
        console.log(error);
    }
    location.reload();
}


function setClickEventsForTabs() {
    const friendRequestTab = document.querySelector("#requests-tabs");
    const searchTab = document.querySelector("#search-tabs");
    friendRequestTab.addEventListener("click", handleFriendRequestTabClick);
    searchTab.addEventListener("click", handlesearchTabClick);
}

async function handleFriendRequestTabClick(evt) {
    const searchTab = document.querySelector("#search-tabs");
    searchTab.classList.remove("active-tab");
    searchTab.classList.add("tab");
    evt.target.classList.remove("tab");
    evt.target.classList.add("active-tab");
    const container = document.querySelector("#main-container");
    container.innerHTML = "";
    await generateFriendRequestsPage();
}

async function handlesearchTabClick(evt) {
    const requestsTab = document.querySelector("#requests-tabs");
    requestsTab.classList.remove("active-tab");
    requestsTab.classList.add("tab");
    evt.target.classList.remove("tab");
    evt.target.classList.add("active-tab");
    const container = document.querySelector("#main-container");
    container.innerHTML = "";
    await generateSearchPage();
}

async function generateSearchPage() {
    const container = document.querySelector("#main-container");
    const searchContainerDiv = document.createElement("div");
    searchContainerDiv.classList.add("search-container");
    const inputNode = document.createElement("input");
    inputNode.type = "text";
    inputNode.classList.add("search-bar");
    inputNode.placeholder = "הכנס כתובת מייל למציאת חבר";
    const searchButtonDiv = document.createElement("div");
    searchButtonDiv.classList.add("search-btn");
    const searchButton = document.createElement("button");
    searchButton.classList.add("search-button");
    searchButton.addEventListener("click", handleFriendSearch)
    const searchIcon = document.createElement("i");
    searchIcon.classList.add("fa", "fa-search");
    searchButton.appendChild(searchIcon);
    searchButtonDiv.appendChild(searchButton);
    searchContainerDiv.appendChild(inputNode);
    searchContainerDiv.appendChild(searchButtonDiv);
    container.appendChild(searchContainerDiv);
}

function handleFriendSearch(evt) {
    const friendToSearch = document.querySelector("input").value;
    const userCard = document.getElementsByClassName("friend-request-card")[0];
    if (userCard) {
        userCard.parentNode.removeChild(userCard);
    }
}

async function setPageElements() {
    setClickEventsForTabs();
    generateFriendRequestsPage();
}

addEventListener('DOMContentLoaded', setPageElements);