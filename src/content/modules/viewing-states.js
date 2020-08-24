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

export function isInsideMeidaNet() {
    // return true if user is viewing any page inside the Meida-Net
    return $(".loginbar.pull-right").length > 0;
}

export function isInsideHomePage() {
    // return true if user is viewing the home page
    const firstHeadingElements = $("h2.panel-title:contains('מערכת שעות')");
    if (firstHeadingElements.length > 0) {
        return $("h2.panel-title:contains('הודעות')").length > 0;
    } else {
        return false;
    }
}

export function isManagementCollege() {
    return window.location.href.includes('colman');
}