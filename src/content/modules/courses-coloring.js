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

async function readGrades(currentCourseNumber, userId) {
    let grade = -1;
    try {
        const url = "http://localhost:8080/users_courses?course_number=" + currentCourseNumber +
            "&user_id=" + userId;
        const result = await fetch(url);
        //console.log(result);

        /*
        const jsonRequest = {}
        jsonRequest.course_number = currentCourseNumber;

        console.log(JSON.stringify(jsonRequest));

        /*
        const result = fetch("http://localhost:8080/users_courses", {
            method: "GET",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ "course_number": "111111" })
        })
            

        console.log("here are results");
        console.log(result);

        */

        const grades = await result.json();
        if (grades[0]) {
            grade = grades[0].course_grade;
        }

        //console.log(grades);

        //grades.forEach(g => { console.log(g.course_grade) })
    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return grade;
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

    let currentCourseNumber = currentTrCells[0].innerText;
    let userId = '1';

    let grade = await readGrades(currentCourseNumber, userId);
    /*
    let differentGrade = readGrades(currentCourseNumber, userId).then(function(result) {
        return result;
    });
    
    let differentGrade = async() => {
        let result = await readGrades(currentCourseNumber, userId);
        return result;
    }
    */

    //console.log(differentGrade);

    //let grade = Math.floor(Math.random() * 100) + 1;
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

    if (grade !== -1) //course grade  was found in the db
    {
        if (currentTrCells[1] && !currentTrCells[1].querySelector("div")) {
            currentTrCells[1].appendChild(mainGradeIconContainer);
        }
    }
}