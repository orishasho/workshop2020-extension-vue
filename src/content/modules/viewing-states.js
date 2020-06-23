import $ from 'jquery'

export function isViewingGradesAllYears() {
    return $("h2.panel-title:contains('רשימת ציונים כל השנים')").length > 0;
}

export function isViewingAllTableEntries() {
    return $("span.select2-selection__rendered[title='הכל']").length > 0;
}

export function isViewingCoursesTable() {
    // return true if user is viewing any page the contains a courses table
    const firstHeadingElements = $("h1.pull-right:contains('חיפוש מתקדם'), h1.pull-right:contains('חיפוש קורסים')");
    if (firstHeadingElements.length > 0) {
        return $("h2.panel-title:contains('רשימת אתרי קורסים'), h2.panel-title:contains('רשימת קורסים לפי התחום המבוקש')").length > 0;
    } else {
        return false;
    }
}