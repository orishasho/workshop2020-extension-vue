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
    const coursesTableRows = document.getElementsByTagName("tr");

    for (let i = 1; i < coursesTableRows.length; i++) {
        coursesTableRows[i].style.backgroundColor = getRandomBgColor();
        /**********/
        let trCells = coursesTableRows[i].getElementsByTagName("td");
        console.log(trCells);

        for (let j = 0; j < trCells.length; j++) {
            trCells[j].style.verticalAlign = "middle";
            trCells[j].style.textAlign = "center";
        }

        let circleContainer1 = document.createElement("div");
        let circleContainerSpan1 = document.createElement("span");
        let circleContainer4 = document.createElement("div");
        let circleContainer2 = document.createElement("div");
        let circleContainer3 = document.createElement("div");

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

        circleContainer1.classList.add("c100", gradeClass, gardeColorClass, "small");
        circleContainerSpan1.innerText = grade;
        circleContainer4.classList.add("slice");
        circleContainer2.classList.add("bar");
        circleContainer3.classList.add("fill");

        circleContainer1.appendChild(circleContainerSpan1);
        circleContainer4.appendChild(circleContainer2);
        circleContainer4.appendChild(circleContainer3);
        circleContainer1.appendChild(circleContainer4);

        trCells[1].appendChild(circleContainer1);
    }
}