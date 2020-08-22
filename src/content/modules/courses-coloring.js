import $ from 'jquery';
const axios = require('axios');
const userCourseApiUrl = 'http://localhost:8080/user_course';

function getColor(colorCode) {
    const backgroundColors = {
        green: "#4fff81",
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

async function readGrades(currentCourseNumber, userId) {
    let grade = -1;
    try {
        const response = await axios.get(
            `${userCourseApiUrl}/grade`, {
                params: {
                    user_id: userId,
                    course_number: currentCourseNumber
                }
            });

        const grades = response.data;
        if (grades[0]) {
            grade = grades[0].course_grade;
        }

    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return grade;
}

async function readStatus(currentCourseNumber, userId) {
    let grade = -1;
    try {
        const response = await axios.get(
            `${userCourseApiUrl}/status`, {
                params: {
                    user_id: userId,
                    course_number: currentCourseNumber
                }
            });

        const statuses = response.data;
        if (statuses[0]) {
            status = statuses[0].status;
        }

    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return status;
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

export function handleCoursesTableColoring() {

    const defaultCoursesTableRows = document.getElementsByTagName("tr");
    for (let i = 1; i < defaultCoursesTableRows.length; i++) {
        handleTrColoring(defaultCoursesTableRows[i]);
    }

    $('body').on('DOMNodeInserted', 'tr', function(e) {
        handleTrColoring(e.target);
    });
}


async function handleTrColoring(currentCoursesTr) {
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
    const userId = await getLoggedInUserIdFromChromeStorage();

    const courseColorCode = await readStatus(currentCourseNumber, userId);

    const grade = await readGrades(currentCourseNumber, userId);

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