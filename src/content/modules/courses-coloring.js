import $ from 'jquery';
import { baseUserCourseEndpoint } from '../../utils/api';
import { getLoggedInUserIdFromChromeStorage } from '../../utils/userAuth';
const axios = require('axios');

function getColor(colorCode) {
    const backgroundColors = {
        green: "#72c02c",
        red: "#ff7575",
        yellow: "#fff475"
    };
    if (colorCode == 'green') {
        return backgroundColors.green
    } else if (colorCode == 'yellow') {
        return backgroundColors.yellow
    } else {
        return backgroundColors.red;
    }
};

async function readAllStatusesAndGrades(userId) {
    let res = [];
    try {
        const response = await axios.get(
            `${baseUserCourseEndpoint}/statusAndGrade`, {
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

export async function handleCoursesTableColoring() {
    const userId = await getLoggedInUserIdFromChromeStorage();
    const statusesAndGrades = await readAllStatusesAndGrades(userId);
    const statusesAndGradesFormatted = statusesAndGrades.reduce(function(res, elem) {
        res[elem.course_number_res] = { status: elem.status_res, grade: elem.grade_res };
        return res;
    }, {});
    const defaultCoursesTableRows = document.getElementsByTagName("tr");
    for (let i = 1; i < defaultCoursesTableRows.length; i++) {
        handleTrColoring(defaultCoursesTableRows[i], statusesAndGradesFormatted);
    }

    $('body').on('DOMNodeInserted', 'tr', function(e) {
        handleTrColoring(e.target, statusesAndGradesFormatted);
    });
}


async function handleTrColoring(currentCoursesTr, statusesAndGrades) {
    let currentTrCells = currentCoursesTr.querySelectorAll("td");

    for (let j = 0; j < currentTrCells.length; j++) {
        currentTrCells[j].style.verticalAlign = "middle";
        currentTrCells[j].style.textAlign = "center";
    }

    let mainGradeIconContainer = document.createElement("div");
    mainGradeIconContainer.id = "grade-container-div";
    mainGradeIconContainer.style.float = "left";
    let gradeIconContainerSpan = document.createElement("span");
    let gradeIconContainerSlice = document.createElement("div");
    let gradeIconContainerBar = document.createElement("div");
    let gradeIconContainerFill = document.createElement("div");

    let currentCourseNumber;
    if (currentTrCells[0]) {
        currentCourseNumber = currentTrCells[0].innerText;
    } else {
        currentCourseNumber = '';
    }

    const courseColorCode = statusesAndGrades[currentCourseNumber].status;
    const grade = statusesAndGrades[currentCourseNumber].grade;

    const gradeClass = "p" + grade.toString();
    let gardeColorClass;
    if (grade < 60) {
        gardeColorClass = "red";
    } else if (grade >= 60 && grade < 80) {
        gardeColorClass = "orange";
    } else {
        gardeColorClass = "green";
    }

    mainGradeIconContainer.classList.add("c100", gradeClass, gardeColorClass, "small");
    gradeIconContainerSpan.innerText = grade;
    gradeIconContainerSlice.classList.add("slice");
    gradeIconContainerBar.classList.add("bar");
    gradeIconContainerFill.classList.add("fill");

    mainGradeIconContainer.appendChild(gradeIconContainerSpan);
    gradeIconContainerSlice.appendChild(gradeIconContainerBar);
    gradeIconContainerSlice.appendChild(gradeIconContainerFill);
    mainGradeIconContainer.appendChild(gradeIconContainerSlice);

    const courseTitleDiv = document.createElement("div");
    if (currentTrCells[1]) {
        currentTrCells[1].style.backgroundColor = getColor(courseColorCode);
        courseTitleDiv.innerText = currentTrCells[1].innerText;
        courseTitleDiv.innerHTML = courseTitleDiv.innerHTML.replace(/<br>.*$/i, "");
        currentTrCells[1].innerText = '';
        currentTrCells[1].appendChild(courseTitleDiv);
    }

    if (grade !== -1) //course grade  was found in the db
    {
        if (currentTrCells[1] && !currentTrCells[1].querySelector("#grade-container-div")) {
            courseTitleDiv.style.verticalAlign = "middle";
            courseTitleDiv.style.float = "right";
            courseTitleDiv.style.marginTop = "5%";
            currentTrCells[1].appendChild(mainGradeIconContainer);
        }
    }
}