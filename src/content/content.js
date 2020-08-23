import './css/circle.css';
import './css/buttons.css'
import * as coursesColoringModule from "./modules/courses-coloring";
import * as viewingStatesModule from "./modules/viewing-states";
import * as userCoursesModule from "./modules/user-courses";
import Vue from 'vue';
import ExtensionDropdown from "../components/ExtensionTab/ExtensionDropdown";
import PortalVue from 'portal-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {faMedal, faAngleDown, faCheckSquare, faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueEllipseProgress from 'vue-ellipse-progress';

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';
const userApiUrl = 'http://localhost:8080/user';

let isUserNameUpdated = false;

let loggedInEmail = "";
chrome.storage.sync.get('loggedEmail', function(data) {
    loggedInEmail = data.loggedEmail;
    init(loggedInEmail); // All your code is contained here, or executes later that this
});

async function init(loggedInEmail) {
    if (loggedInEmail != "") {
        //Extension tab entry point
        if (!isUserNameUpdated) {
            await saveUserName(loggedInEmail);
            isUserNameUpdated = true;
        }
        let navMenu = document.querySelector(".navbar-nav");
        let appEntry = document.createElement("div");
        appEntry.setAttribute("id", "app");
        navMenu.appendChild(appEntry);

        global.browser = require('webextension-polyfill');
        Vue.prototype.$browser = global.browser;

        //External components
        Vue.use(PortalVue);
        Vue.use(VueEllipseProgress);
        library.add(faMedal);
        library.add(faAngleDown);
        library.add(faCheckSquare);
        library.add(faTimes);
        Vue.component('font-awesome-icon', FontAwesomeIcon);
        //Extension tab Vue instance
        new Vue({
            el: '#app',
            render: h => h(ExtensionDropdown)
        });

        //Content script logic
        if (viewingStatesModule.isViewingCoursesTable()) {
            coursesColoringModule.handleCoursesTableColoring();
        } else if (viewingStatesModule.isViewingGradesAllYears()) {
            let sendDataToApiButton = createSendDataToApiButton();
            sendDataToApiButton.addEventListener('click', handleSendDataToApiClick);
            document.querySelector(".textAboveTable").appendChild(sendDataToApiButton);
        }

        if (viewingStatesModule.isInsideMeidaNet()) {
            const topToolbar = document.getElementsByClassName("loginbar pull-right");
            let logeedInEmailInToolbar = document.createElement("li");
            logeedInEmailInToolbar.setAttribute("class", "topbar-devider");
            logeedInEmailInToolbar.innerHTML = "מחובר לתוסף בתור: " + loggedInEmail;
            topToolbar[0].appendChild(logeedInEmailInToolbar);
        }
    } else {
        if (viewingStatesModule.isInsideHomePage()) {
            const pleaseLoginMessageLocator = document.getElementsByClassName("col-md-12");
            let pleaseLoginMessageDiv = document.createElement("div");
            let pleaseLoginMessageHeader = document.createElement("h2");
            pleaseLoginMessageHeader.setAttribute("style", "color:red");
            pleaseLoginMessageHeader.innerHTML = "שים לב! על מנת להשתמש בתוסף, עליך להתחבר";
            pleaseLoginMessageDiv.appendChild(pleaseLoginMessageHeader);

            console.log(pleaseLoginMessageLocator[0]);

            pleaseLoginMessageLocator[1].appendChild(pleaseLoginMessageDiv);
        }
    }
}

function createSendDataToApiButton() {
    let sendDataToApiButton = document.createElement("button");
    sendDataToApiButton.classList.add("send-to-api-btn");
    sendDataToApiButton.innerText = 'שמור מידע על ציונים';
    return sendDataToApiButton;
}

function handleSendDataToApiClick(event) {
    event.preventDefault();
    let errorOrSuccessMessage = document.querySelector("#errorOrSuccessMessage");
    let isErrorMessageOnDom = true;

    if (errorOrSuccessMessage === null) {
        isErrorMessageOnDom = false;
        errorOrSuccessMessage = document.createElement("p");
        errorOrSuccessMessage.setAttribute("id", "errorOrSuccessMessage");
    }

    if (viewingStatesModule.isViewingAllTableEntries()) {
        userCoursesModule.sendUserCoursesDataToApi();
        errorOrSuccessMessage.innerText = 'הנתונים נשמרו בהצלחה!';
        errorOrSuccessMessage.style.color = '#72c02c';
    } else {
        errorOrSuccessMessage.innerText = 'יש לבחור ״הכל״ במספר שורות מוצגות';
        errorOrSuccessMessage.style.color = 'red';
    }

    if (!isErrorMessageOnDom) {
        document.querySelector(".textAboveTable").appendChild(errorOrSuccessMessage);
    }
}

async function saveUserName(userEmail) {
    const userName = document.querySelector(".loginbar.pull-right").children[2].innerText.trim();
    await axios.put(`${userApiUrl}/updateUserNameByEmail`, {
        user_email: userEmail,
        name: userName
    });
}