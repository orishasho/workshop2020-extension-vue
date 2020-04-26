import './css/circle.css';
import * as coursesColoringModule from "./modules/courses-coloring";
import * as viewingStatesModule from "./modules/viewing-states";
import * as fetchUserCoursesModule from "./modules/fetch-user-courses";
import Vue from 'vue';
import ExtensionDropdown from "../components/ExtensionTab/ExtensionDropdown";
import PortalVue from 'portal-vue';
import { BootstrapVue } from 'bootstrap-vue';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';

if (viewingStatesModule.isViewingCoursesTable()) {
    coursesColoringModule.handleCoursesTableColoring();
} else if (viewingStatesModule.isViewingGrades()) {
    fetchUserCoursesModule.fetchUserCoursesInfo();
}

// let navigatorMenu = document.querySelector(".navbar-nav");
// let navigatorMenuItem = navigatorMenu.querySelector(".dropdown");
// let newNavigatorMenuItem = navigatorMenuItem.cloneNode(true);
// newNavigatorMenuItem.firstChild.textContent = "לשונית תוסף";
//
// newNavigatorMenuItem.querySelectorAll("li").forEach(a => a.remove());
// console.dir(newNavigatorMenuItem)
//
// let newNavigatorMenuItemDropDown = newNavigatorMenuItem.querySelector(".dropdown-menu");
//
// function addItemToNewTabDropDown(dropDownList, itemText, itemLink) {
//     let listItem = document.createElement("li");
//     let listItemLink = document.createElement("a");
//     listItemLink.setAttribute('target', '_blank');
//     listItemLink.setAttribute('href', itemLink);
//     listItemLink.textContent = itemText;
//     listItem.appendChild(listItemLink);
//     dropDownList.appendChild(listItem);
// }
//
// addItemToNewTabDropDown(newNavigatorMenuItemDropDown, "כניסה לפייסבוק", "http://www.facebook.com");
// addItemToNewTabDropDown(newNavigatorMenuItemDropDown, "כניסה לגוגל", "http://www.google.com");
// navigatorMenu.appendChild(newNavigatorMenuItem);

//Extension tab entry point
let navMenu = document.querySelector(".navbar-nav");
let appEntry = document.createElement("div");
appEntry.setAttribute("id", "app");
navMenu.appendChild(appEntry);

//Content entry point
let contentEntryPointReference = document.querySelector(".breadcrumbs.no-print");
let contentEntry = document.createElement("div");
contentEntry.setAttribute("id", "content-app");
contentEntry.classList.add('container', 'content');
contentEntryPointReference.parentNode.insertBefore(contentEntry, contentEntryPointReference.nextSibling);

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;
Vue.use(PortalVue);
Vue.use(BootstrapVue);

//Extension tab
new Vue({
    el: '#app',


    render: h => h(ExtensionDropdown)
});
