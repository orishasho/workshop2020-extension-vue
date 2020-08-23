const axios = require('axios');

const userCourseApiUrl = 'http://localhost:8080/user_course';
const courseApiUrl = 'http://localhost:8080/course';

const userCourseApiUrlManagement = 'http://localhost:8080/management_college/user_course';
const courseApiUrlManagement = 'http://localhost:8080/management_college/course';

const isManagementCollege = window.location.href.includes('colman');

const actualCourseApiUrl = isManagementCollege ? courseApiUrlManagement : courseApiUrl;
const actualUserCourseApiUrl = isManagementCollege ? userCourseApiUrlManagement : userCourseApiUrl;

export default class UserCoursesLoader {

    async getLoggedInUserIdFromChromeStorage() {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get('loggedUserId', function(value) {
                    resolve(value.loggedUserId);
                })
            } catch (ex) {
                reject(ex);
            }
        });
    }

    async getUserCourses() {
        try {
            const loggedUserId = await this.getLoggedInUserIdFromChromeStorage();
            const response = await axios.get(`${actualUserCourseApiUrl}/detailed?user_id=${loggedUserId}`);
            const userCoursesArray = response.data;
            console.dir(userCoursesArray);
            return userCoursesArray;
        } catch (e) {
            console.log(e);
        }
    }

    //courseType = 'mandatory' / 'elective' / 'math' / 'workshop'
    async getSpecificCourseTypeNumbers(courseType) {
        // Management College doesn't have math courses
        if (isManagementCollege && courseType === 'math') {
            return;
        }

        try {
            const response = await axios.get(`${actualCourseApiUrl}/${courseType}`);
            const specificTypeCoursesArray = response.data;
            const specificTypeCoursesNumbers = specificTypeCoursesArray.map(electiveCourse => electiveCourse['course_number']);
            return specificTypeCoursesNumbers;
        } catch (e) {
            console.log(e);
        }
    }

}