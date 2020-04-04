export function isViewingGrades() {
    return false;
}

export function isViewingCoursesTable() {
    const h1PullRightElements = document.querySelectorAll("h1.pull-right");
    const h2PanelTitleElements = document.querySelectorAll("h2.panel-title");

    const h1AdvancedSearchElementsText = "חיפוש מתקדם";
    const h2AdvancedSearchElementsText = "רשימת אתרי קורסים"

    const h1StudyProgramElementsText = "חיפוש קורסים";
    const h2StudyProgramElementsText = "רשימת קורסים לפי התחום המבוקש";

    let hasFirstHeading = false;
    let hasSecondHeading = false;

    for (let i = 0; i < h1PullRightElements.length; i++) {
        let element = h1PullRightElements[i];
        if (element.innerHTML.indexOf(h1AdvancedSearchElementsText) !== -1 || element.innerHTML.indexOf(h1StudyProgramElementsText) !== -1) {
            hasFirstHeading = true;
            break;
        }
    }

    if (hasFirstHeading) {
        for (let i = 0; i < h2PanelTitleElements.length; i++) {
            let element = h2PanelTitleElements[i];
            if (element.innerHTML.indexOf(h2AdvancedSearchElementsText) !== -1 || element.innerHTML.indexOf(h2StudyProgramElementsText) !== -1) {
                hasSecondHeading = true;
                break;
            }
        }
    }

    return hasFirstHeading && hasSecondHeading;
}