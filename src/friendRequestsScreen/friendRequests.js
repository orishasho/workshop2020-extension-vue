import '../content/css/friendRequests.css';
import { baseUserFriendEndpoint, baseUserEndpoint } from '../utils/api';
import { getLoggedInUserIdFromChromeStorage } from '../utils/userAuth';
import { createToast } from '../utils/notifications';

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

const backBtn = document.getElementById('go-back');

backBtn.addEventListener('click', function() {
    window.location = "../popupMenu/popupMenu.html";
});



async function readFriendRequests(userId) {
    let res = {};
    try {
        const response = await axios.get(
            `${baseUserFriendEndpoint}/friendRequestsByUser`, {
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
        await axios.put(
            `${baseUserFriendEndpoint}/setReceivedFriendRequest`,
            apiDetails
        );
    } catch (error) {
        console.log(error);
    }
    location.reload();
}


function setClickEventsForTabs() {
    const friendRequestTab = document.querySelector("#requests-tabs");
    const searchTab = document.querySelector("#search-tabs");
    friendRequestTab.addEventListener("click", handleFriendRequestTabClick);
    searchTab.addEventListener("click", handleSearchTabClick);
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

async function handleSearchTabClick(evt) {
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

async function handleFriendSearch() {
    const friendToSearch = document.querySelector("input").value;
    const container = document.querySelector("#main-container");
    let userCard = document.getElementsByClassName("friend-request-card")[0];
    if (!userCard) {
        userCard = document.createElement("div");
        userCard.classList.add("friend-request-card");
        container.appendChild(userCard);
    }
    userCard.innerHTML = "";
    const user_id = await getLoggedInUserIdFromChromeStorage();
    const friendToAddStatus = await readFriendToSearchStatus(user_id, friendToSearch);
    switch (friendToAddStatus[0].res) {
        case "no_user":
            const label_no_user = document.createElement("div");
            label_no_user.style.fontSize = "15px";
            label_no_user.innerText = "לא נמצא משתמש בכתובת זו";
            userCard.appendChild(label_no_user);
            break;
        case "already_friends":
            const label_already_friends = document.createElement("div");
            label_already_friends.style.fontSize = "15px";
            label_already_friends.innerText = "המשתמש כבר נמצא ברשימת החברים שלך";
            userCard.appendChild(label_already_friends);
            break;
        case "pending":
            const label_pending = document.createElement("div");
            label_pending.style.fontSize = "15px";
            label_pending.innerText = "בינך ובין המשתמש כבר יש בקשת חברות ממתינה";
            userCard.appendChild(label_pending);
            break;
        case "able":
            const user_details_res = await readFriendToSearchDetails(friendToSearch);
            const user_details = user_details_res[0];
            const profilePictureDiv = document.createElement("div");
            profilePictureDiv.classList.add("profile-picture");
            const profilePictureImg = document.createElement("img");
            profilePictureImg.setAttribute("src", user_details.img);
            profilePictureDiv.appendChild(profilePictureImg);
            const userDetailsDiv = document.createElement("div");
            userDetailsDiv.classList.add("user-details");
            const userDetailsH1 = document.createElement("h1");
            userDetailsH1.classList.add("send-h1");
            userDetailsH1.innerText = user_details.name;
            userDetailsDiv.appendChild(userDetailsH1);

            const sendButton = document.createElement("button");
            sendButton.sender = user_id;
            sendButton.receiver = user_details.user_id;
            sendButton.addEventListener("click", handleSendFriendRequestClick);
            sendButton.classList.add("button", "button-primary-send");
            sendButton.innerText = "שלח בקשת חברות";


            userCard.appendChild(profilePictureDiv);
            userCard.appendChild(userDetailsDiv);
            userCard.appendChild(sendButton);
    }
}

async function readFriendToSearchStatus(userId, friendToAdd) {
    let res = {};
    try {
        const response = await axios.get(
            `${baseUserFriendEndpoint}/friendStatusByUser`, {
                params: {
                    user_id: userId,
                    friend_to_add: friendToAdd
                }
            });
        res = response.data;
    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return res;
}

async function readFriendToSearchDetails(email) {
    let res = {};
    try {
        const response = await axios.get(
            baseUserEndpoint, {
                params: {
                    user_email: email
                }
            });
        res = response.data;
    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return res;
}

async function handleSendFriendRequestClick(evt) {
    const apiDetails = { "sender": evt.target.sender, "receiver": evt.target.receiver };
    try {
        await axios.post(
            `${baseUserFriendEndpoint}/sendFriendRequest`,
            apiDetails
        );
        showNotification("הבקשה נשלחה", "notification");
        setTimeout(clickSearchTabs, 3000);
    } catch (error) {
        console.log(error);
    }
}

async function setPageElements() {
    setClickEventsForTabs();
    generateFriendRequestsPage();
}

function clickSearchTabs() {
    document.querySelector("#search-tabs").click();
}

function showNotification(text, typeOfNotification) {
    const toast = createToast(text, typeOfNotification);
    const appendLocation = document.getElementById("body-id");
    appendLocation.prepend(toast);
}

addEventListener('DOMContentLoaded', setPageElements);