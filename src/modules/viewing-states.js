import $ from 'jquery'

export function isViewingGrades() {
    return false;
}

export function isViewingCoursesTable() {
    const firstHeadingElements = $("h1.pull-right:contains('חיפוש מתקדם'), h1.pull-right:contains('חיפוש קורסים')");
    if (firstHeadingElements.length > 0) {
        return $("h2.panel-title:contains('רשימת אתרי קורסים'), h2.panel-title:contains('רשימת קורסים לפי התחום המבוקש')").length > 0;
    }
}