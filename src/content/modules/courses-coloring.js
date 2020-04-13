import $ from 'jquery';

function getRandomBgColor() {
    const backgroundColors = {
        green: "#4fff81",
        red: "#ff7575",
        yellow: "#fff475"
    };
    let keys = Object.keys(backgroundColors);
    return backgroundColors[keys[(keys.length * Math.random()) << 0]];
};

export function handleCoursesTableColoring() {

    const defaultCoursesTableRows = document.getElementsByTagName("tr");
    for (let i = 1; i < defaultCoursesTableRows.length; i++) {
        handleTrColoring(defaultCoursesTableRows[i]);
    }

    $('body').on('DOMNodeInserted', 'tr', function(e) {
        handleTrColoring(e.target);
    });
}


function handleTrColoring(currentCoursesTr) {

    currentCoursesTr.style.backgroundColor = getRandomBgColor();

    let currentTrCells = currentCoursesTr.querySelectorAll("td");

    for (let j = 0; j < currentTrCells.length; j++) {
        currentTrCells[j].style.verticalAlign = "middle";
        currentTrCells[j].style.textAlign = "center";
    }

    let mainGradeIconContainer = document.createElement("div");
    let gradeIconContainerSpan = document.createElement("span");
    let gradeIconContainerSlice = document.createElement("div");
    let gradeIconContainerBar = document.createElement("div");
    let gradeIconContainerFill = document.createElement("div");

    let grade = Math.floor(Math.random() * 100) + 1;
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

    if (currentTrCells[1] && !currentTrCells[1].querySelector("div")) {
        currentTrCells[1].appendChild(mainGradeIconContainer);
    }
}