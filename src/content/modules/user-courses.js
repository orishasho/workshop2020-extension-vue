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
    let filteredUserCoursesWithPossibleDuplicates = userCourses
        .filter(userCourse => userCourse['סוג מקצוע'].includes('שעור') || userCourse['סוג מקצוע'].includes('פרויקטים'));

    // 2. Handle duplicates
    const filteredUserCourses = filterDuplicateCourses(filteredUserCoursesWithPossibleDuplicates);

    return filteredUserCourses;
}

function filterCourses(userCourses) {
    // 1. Keep only final grades
    let filteredUserCoursesWithPossibleDuplicates = userCourses
        .filter(userCourse => userCourse['סוג ציון'] === 'שיעור/ציון קורס' && userCourse['שנה'] !== 'ללא שנה');

    // 2. Handle duplicates
    const filteredUserCourses = filterDuplicateCourses(filteredUserCoursesWithPossibleDuplicates);

    return filteredUserCourses;
}

function filterDuplicateCourses(filteredUserCoursesWithPossibleDuplicates) {
    for (let i = 0; i < filteredUserCoursesWithPossibleDuplicates.length; i++) {
        // 1. Build duplicates array
        let duplicates = [];

        for (let j = 0; j < filteredUserCoursesWithPossibleDuplicates.length; j++) {
            if (filteredUserCoursesWithPossibleDuplicates[i]['שם קורס'] === filteredUserCoursesWithPossibleDuplicates[j]['שם קורס'] && j !== i) {
                duplicates.push(filteredUserCoursesWithPossibleDuplicates[j]);
            }
        }

        if (duplicates.length > 0 &&
            isNaN(filteredUserCoursesWithPossibleDuplicates[i]['ציון']) &&
            filteredUserCoursesWithPossibleDuplicates[i]['ציון'] !== 'טרם') {
            // 2. Course without grade, student is not enrolled to it again and there are duplicates - remove
            filteredUserCoursesWithPossibleDuplicates.splice(i, 1);
        } else if (duplicates.length > 0) {
            // 3. Course with grade and there are duplicates - remove if it's not highest
            const keepCourse = duplicates
                .every(duplicate => isNaN(duplicate['ציון']) || duplicate['ציון'] < filteredUserCoursesWithPossibleDuplicates[i]['ציון']);
            if (!keepCourse) {
                filteredUserCoursesWithPossibleDuplicates.splice(i, 1);
            }
        }
    }

    return filteredUserCoursesWithPossibleDuplicates;
}



async function storeUserCourses(userCourses) {
    // 1. Build user courses array to send to API
    const userId = await getLoggedInUserIdFromChromeStorage();
    let apiUserCourses = buildUserCoursesForApi(userCourses, userId);

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

function buildUserCoursesForApi(userCourses, userId) {
    // 1. Build user courses array for API
    let apiUserCourses = buildApiUserCoursesArrayWithPossibleDuplicates(userCourses, userId);
    // 2. Cleanup - if there are 2 identical courses, one failed one signed, keep signed only
    return cleanupFailedAndSignedCourses(apiUserCourses);
}

function buildApiUserCoursesArrayWithPossibleDuplicates(userCourses, userId) {
    let apiUserCourses = [];
    userCourses.forEach(userCourse => {
        let apiUserCourse = {};
        const courseGrade = isNaN(userCourse['ציון']) ? -1 : userCourse['ציון'];

        apiUserCourse.userId = userId;
        apiUserCourse.courseGrade = courseGrade;
        apiUserCourse.courseStatus = determineCourseStatus(userCourse, courseGrade);
        apiUserCourse.courseNumber = userCourse['שם קורס'].match(/(\d+)/)[0];

        apiUserCourses.push(apiUserCourse);
    });

    return apiUserCourses;
}

function cleanupFailedAndSignedCourses(userCoursesArray) {
    // 1. Sort userCoursesArray by courseNumber asc
    userCoursesArray.sort(sortUserCoursesByCourseNumberAsc);
    // 2. Construct array of duplicates' courseNumbers
    let courseNumbersWithDuplicates = buildCourseNumbersWithDuplicatesArray(userCoursesArray);
    // 3. For each duplicate keep only 'signed'
    const filteredArray = userCoursesArray.filter(userCourse =>
        !courseNumbersWithDuplicates.find(courseNumber => courseNumber === userCourse.courseNumber) || userCourse.courseStatus === 'signed');

    return filteredArray;
}

function buildCourseNumbersWithDuplicatesArray(userCoursesArray) {
    let courseNumbersWithDuplicates = [];
    let prevCourseNumber = null;
    let currentCourseNumber;
    userCoursesArray.forEach((currentUserCourse, index, array) => {
        if (index > 0) {
            currentCourseNumber = currentUserCourse.courseNumber;
            if (currentCourseNumber === prevCourseNumber &&
                !courseNumbersWithDuplicates.find(courseNumber => courseNumber === currentCourseNumber)) {
                courseNumbersWithDuplicates.push(currentCourseNumber);
            }
        }
        prevCourseNumber = array[index].courseNumber;
    });
    return courseNumbersWithDuplicates;
}

function sortUserCoursesByCourseNumberAsc(userCourse1, userCourse2) {
    if (userCourse1.courseNumber < userCourse2.courseNumber) {
        return - 1;
    } else if (userCourse1.courseNumber > userCourse2.courseNumber) {
        return 1;
    } else {
        return 0;
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