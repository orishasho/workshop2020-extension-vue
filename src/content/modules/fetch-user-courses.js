const HtmlTableToJson = require('html-table-to-json');

export function fetchUserCoursesInfo() {
    const coursesInfoTable = document.getElementById("myTable0");
    const jsonTable = HtmlTableToJson.parse(coursesInfoTable.outerHTML).results[0];
    console.log(`all data: ${jsonTable}`);
    handleJsonTable(jsonTable);
}

function handleJsonTable(jsonTable) {
    // 1. filter out any non final and irrelevant entries
    const filtered = jsonTable.filter(
        entry => entry['סוג ציון'] === 'שיעור/ציון קורס' && entry['שנה'] !== 'ללא שנה'
    );
    console.log(`filtered data: ${filtered}`);

    // 2. send data to API
}