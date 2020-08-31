import { baseCourseScheduleEndpoint } from '../utils/api';
import { getLoggedInUserIdFromChromeStorage } from '../utils/userAuth';

const axios = require('axios');
const possibleCoursesApiUrl = `${baseCourseScheduleEndpoint}/possible_courses`;
const allCoursesSchedulesApiUrl = `${baseCourseScheduleEndpoint}/all`;

axios.defaults.headers.post['Content-Type'] = 'application/json';

export default class CoursesSchedulesLoader {

    async getPossibleCourses(semester) {
        try {
            const loggedUserId = await getLoggedInUserIdFromChromeStorage();
            const response = await axios.get(`${possibleCoursesApiUrl}?user_id=${loggedUserId}&semester=${semester}`);
            const possibleCoursesArray = response.data;
            return possibleCoursesArray;
        } catch (e) {
            console.log(e);
        }
    }

    async getCoursesSchedules(courses_numbers, semester) {
        try {
            const response = await axios.post(
                allCoursesSchedulesApiUrl, {
                    arr: courses_numbers,
                    semester: semester
                }
            );
            const coursesSchedules = response.data;
            return coursesSchedules;
        } catch (e) {
            console.log(e);
        }
    }

}