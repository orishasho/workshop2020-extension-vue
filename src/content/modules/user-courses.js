const HtmlTableToJson = require('html-table-to-json');
const axios = require('axios');
const userCoursesApiUrl = 'http://localhost:8080/users_courses';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export async function sendUserCoursesDataToApi() {
    const coursesInfoHtmlTable = document.getElementById("myTable0");
    const userCourses = HtmlTableToJson.parse(coursesInfoHtmlTable.outerHTML).results[0];
    console.log('raw courses data: ');
    console.dir(userCourses);
    try {
        await handleUserCourses(userCourses);
    } catch (error) {
        console.log(error);
    }
}

async function handleUserCourses(userCourses) {
    // 1. filter out any non final and irrelevant entries
    const filteredUserCourses = filterCourses(userCourses);
    console.log('filtered courses data:');
    console.dir(filteredUserCourses);

    // 2. send data to API
    try {
        await storeUserCourses(filteredUserCourses);
    } catch (error) {
        console.log(error);
    }
}

function filterCourses(userCourses) {
    // 1. Keep only final grades
    let filteredUserCourses = userCourses
        .filter(userCourse => userCourse['סוג ציון'] === 'שיעור/ציון קורס' && userCourse['שנה'] !== 'ללא שנה');

    // 2. Handle duplicates
    for (let i = 0; i < filteredUserCourses.length; i++) {
        // 2.1. Build duplicates array
        let duplicates = [];

        for (let j = 0; j < filteredUserCourses.length; j++) {
            if (filteredUserCourses[i]['שם קורס'] === filteredUserCourses[j]['שם קורס'] && j !== i) {
                duplicates.push(filteredUserCourses[j]);
            }
        }

        if (duplicates.length > 0 && isNaN(filteredUserCourses[i]['ציון'])) {
            // 2.2. Course without grade and there are duplicates - remove
            filteredUserCourses.splice(i, 1);
        } else if (duplicates.length > 0) {
            // 2.3. Course with grade and there are duplicates - remove if it's not highest
            const keepCourse = duplicates
                .every(duplicate => isNaN(duplicate['ציון']) || duplicate['ציון'] < filteredUserCourses[i]['ציון']);
            if (!keepCourse) {
                filteredUserCourses.splice(i, 1);
            }
        }
    }

    return filteredUserCourses;
}

async function storeUserCourses(userCourses) {
    // 1. Build user courses array to send to API
    const apiUserCourses = [];

    userCourses.forEach(userCourse => {
        let apiUserCourse = {};
        const courseGrade = isNaN(userCourse['ציון']) ? -1 : userCourse['ציון'];

        apiUserCourse.userId = 2;
        apiUserCourse.courseGrade = courseGrade;
        apiUserCourse.courseStatus = courseGrade >= 60 || courseGrade == -1 ? 'passed' : 'failed';
        apiUserCourse.courseNumber = userCourse['שם קורס'].match(/(\d+)/)[0];

        apiUserCourses.push(apiUserCourse);
    });

    // 2. Send user courses array to API
    try {
        const response = await axios.post(
            userCoursesApiUrl,
            apiUserCourses
        );
        //TODO: handle response properly
        console.log(response);
    } catch (error) {
        //TODO: handle errors properly
        console.log(error);
    }
}