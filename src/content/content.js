import './css/circle.css'
import * as coursesColoringModule from "./modules/courses-coloring"
import * as viewingStatesModule from "./modules/viewing-states"
import * as fetchUserCoursesModule from "./modules/fetch-user-courses"
import $ from 'jquery';


if (viewingStatesModule.isViewingCoursesTable()) {
    coursesColoringModule.handleCoursesTableColoring();
} else if (viewingStatesModule.isViewingGrades()) {
    fetchUserCoursesModule.fetchUserCoursesInfo();
}

let navigatorMenu = document.querySelector(".navbar-nav");
let navigatorMenuItem = navigatorMenu.querySelector(".dropdown");
let newNavigatorMenuItem = navigatorMenuItem.cloneNode(true);
newNavigatorMenuItem.firstChild.textContent = "לשונית תוסף";

newNavigatorMenuItem.querySelectorAll("li").forEach(function(a) {
    a.remove();
})

let newNavigatorMenuItemDropDown = newNavigatorMenuItem.querySelector(".dropdown-menu");

function addItemToNewTabDropDown(dropDownList, itemText, itemLink) {
    let listItem = document.createElement("li");
    let listItemLink = document.createElement("a");
    listItemLink.setAttribute('target', '_blank');
    listItemLink.setAttribute('href', itemLink);
    listItemLink.textContent = itemText;
    listItem.appendChild(listItemLink);
    dropDownList.appendChild(listItem);
}

addItemToNewTabDropDown(newNavigatorMenuItemDropDown, "כניסה לפייסבוק", "http://www.facebook.com");
addItemToNewTabDropDown(newNavigatorMenuItemDropDown, "כניסה לגוגל", "http://www.google.com");
navigatorMenu.appendChild(newNavigatorMenuItem);