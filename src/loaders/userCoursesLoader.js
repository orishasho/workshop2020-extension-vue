import { baseUserCourseEndpoint, baseCourseEndpoint, baseManagementCollegeEndpoint } from '../utils/api';
import { getLoggedInUserIdFromChromeStorage } from '../utils/userAuth';

const axios = require('axios');
const userCourseApiUrlManagement = `${baseManagementCollegeEndpoint}/user_course`;
const courseApiUrlManagement = `${baseManagementCollegeEndpoint}/course`;
const isManagementCollege = window.location.href.includes('colman');
const actualCourseApiUrl = isManagementCollege ? courseApiUrlManagement : baseCourseEndpoint;
const actualUserCourseApiUrl = isManagementCollege ? userCourseApiUrlManagement : baseUserCourseEndpoint;

export default class UserCoursesLoader {

    async getUserCourses() {
        try {
            const loggedUserId = await getLoggedInUserIdFromChromeStorage();
            const response = await axios.get(`${actualUserCourseApiUrl}/detailed?user_id=${loggedUserId}`);
            const userCoursesArray = response.data;
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

        // MTA doesn't have seminarion
        if (!isManagementCollege && courseType === 'seminarion') {
            return;
        }

        try {
            const response = await axios.get(`${actualCourseApiUrl}/${courseType}`);
            const specificTypeCoursesArray = response.data;
            const specificTypeCoursesNumbers = specificTypeCoursesArray.map(course => course['course_number']);
            return specificTypeCoursesNumbers;
        } catch (e) {
            console.log(e);
        }
    }

}