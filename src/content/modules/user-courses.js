import { baseUserCourseEndpoint, baseManagementCollegeEndpoint } from '../../utils/api';
import { getLoggedInUserIdFromChromeStorage } from '../../utils/userAuth';

const HtmlTableToJson = require('html-table-to-json');
const userCourseApiUrlManagementCollege = `${baseManagementCollegeEndpoint}/user_course`;
const isManagementCollege = window.location.href.includes('colman');
const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

export async function sendUserCoursesDataToApi() {
    const coursesInfoHtmlTable = document.getElementById("myTable0");
    const userCourses = HtmlTableToJson.parse(coursesInfoHtmlTable.outerHTML).results[0];
    try {
        await handleUserCourses(userCourses);
    } catch (error) {
        console.log(error);
    }
}

async function handleUserCourses(userCourses) {
    // 1. filter out any non final and irrelevant entries
    let filteredUserCourses;
    if (isManagementCollege) {
        filteredUserCourses = filterCoursesManagementCollege(userCourses);
    } else {
        filteredUserCourses = filterCourses(userCourses);
    }

    // 2. send data to API
    try {
        await storeUserCourses(filteredUserCourses);
    } catch (error) {
        console.log(error);
    }
}

function filterCoursesManagementCollege(userCourses) {
    // 1. Keep only final grades
    let filteredUserCourses = userCourses
        .filter(userCourse => userCourse['סוג מקצוע'].includes('שעור') || userCourse['סוג מקצוע'].includes('פרויקטים'));

    // 2. Handle duplicates
    for (let i = 0; i < filteredUserCourses.length; i++) {
        // 2.1. Build duplicates array
        let duplicates = [];

        for (let j = 0; j < filteredUserCourses.length; j++) {
            if (filteredUserCourses[i]['שם קורס'] === filteredUserCourses[j]['שם קורס'] && j !== i) {
                duplicates.push(filteredUserCourses[j]);
            }
        }

        if (duplicates.length > 0 &&
            isNaN(filteredUserCourses[i]['ציון']) &&
            filteredUserCourses[i]['ציון'] !== 'טרם') {
            // 2.2. Course without grade, student is not enrolled to it again and there are duplicates - remove
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

        if (duplicates.length > 0 &&
            isNaN(filteredUserCourses[i]['ציון']) &&
            filteredUserCourses[i]['ציון'] !== 'טרם') {
            // 2.2. Course without grade, student is not enrolled to it again and there are duplicates - remove
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
    const userId = await getLoggedInUserIdFromChromeStorage();

    userCourses.forEach(userCourse => {
        let apiUserCourse = {};
        const courseGrade = isNaN(userCourse['ציון']) ? -1 : userCourse['ציון'];

        apiUserCourse.userId = userId;
        apiUserCourse.courseGrade = courseGrade;
        apiUserCourse.courseStatus = determineCourseStatus(userCourse, courseGrade);
        apiUserCourse.courseNumber = userCourse['שם קורס'].match(/(\d+)/)[0];

        apiUserCourses.push(apiUserCourse);
    });

    // 2. Send user courses array to API

    // 2.1. Determine which API to use - MTA or Management College
    const actualUserCourseApiUrl = getActualUserCourseApiUrl();

    // 2.2. Send data
    try {
        await axios.post(
            `${actualUserCourseApiUrl}/bulk`,
            apiUserCourses
        );
    } catch (error) {
        console.log(error);
    }
}

function getActualUserCourseApiUrl() {
    if (isManagementCollege) {
        return userCourseApiUrlManagementCollege;
    } else {
        return baseUserCourseEndpoint;
    }
}

function determineCourseStatus(userCourse, courseGrade) {
    if (courseGrade >= 60 ||
        userCourse['ציון'] === 'עבר' ||
        userCourse['ציון'] === 'עובר' ||
        userCourse['ציון'].includes('פטור') ||
        userCourse['ציון'].includes('זכוי')) {
        return 'passed';
    } else if (courseGrade !== -1 ||
        userCourse['ציון'] === 'לא נבחן') {
        return 'failed';
    } else {
        return 'signed';
    }
}