const HtmlTableToJson = require('html-table-to-json');

export function fetchUserCoursesInfo() {
    const coursesInfoHtmlTable = document.getElementById("myTable0");
    const userCourses = HtmlTableToJson.parse(coursesInfoHtmlTable.outerHTML).results[0];
    console.log('all data: ');
    console.dir(userCourses);
    handleUserCourses(userCourses);
}

function handleUserCourses(userCourses) {
    // 1. filter out any non final and irrelevant entries
    const filteredUserCourses = filterCourses(userCourses);

    // 2. send data to API
    storeUserCourses(filteredUserCourses);
}

function filterCourses(userCourses) {
    // 1. filter only final grades
        return userCourses
            .filter(userCourse => userCourse['סוג ציון'] === 'שיעור/ציון קורס' && userCourse['שנה'] !== 'ללא שנה')
            .filter((userCourse, index, arr) => {
                // 2. check for multiple entries of the same course
                let nextIndexOfSameCourse = index;
                for (let i = index; i < arr.length; i++) {
                    if (arr[i]['שם קורס'] === userCourse['שם קורס'] && index !== i) {
                        nextIndexOfSameCourse = i;
                        break;
                    }
                }
                if (nextIndexOfSameCourse === index) {
                    // 2.1. no multiple entries - course stays
                    return true;
                } else {
                    // 2.2. multiple entries - course with higher grade stays
                    return userCourse['ציון'] > arr[nextIndexOfSameCourse]['ציון'];
                }
            });
}

function storeUserCourses(userCourses) {
    // WIP: for now using chrome storage API
    chrome.storage.local.set({userCourses: userCourses}, function() {
        console.log('userCourses is set to ');
        console.dir(userCourses);
    });
}