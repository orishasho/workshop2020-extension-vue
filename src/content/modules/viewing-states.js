import $ from 'jquery'

export function isViewingGrades() {
    return false;
}

export function isViewingCoursesTable() {
    // return true if DOM contains one of the first headings and one of the second headings
    const firstHeadingElements = $("h1.pull-right:contains('חיפוש מתקדם'), h1.pull-right:contains('חיפוש קורסים')");
    if (firstHeadingElements.length > 0) {
        return $("h2.panel-title:contains('רשימת אתרי קורסים'), h2.panel-title:contains('רשימת קורסים לפי התחום המבוקש')").length > 0;
    }
}