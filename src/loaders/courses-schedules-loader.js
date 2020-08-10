const axios = require('axios');
const possibleCoursesApiUrl = 'http://localhost:8080/course_schedule/possible_courses';
const allCoursesSchedulesApiUrl = 'http://localhost:8080/course_schedule/all';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export default class CoursesSchedulesLoader {

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

    async getPossibleCourses(semester) {
        try {
            const loggedUserId = await this.getLoggedInUserIdFromChromeStorage();
            const response = await axios.get(`${possibleCoursesApiUrl}?user_id=${loggedUserId}&semester=${semester}`);
            const possibleCoursesArray = response.data;
            console.log("showing response")
            console.dir(response);
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
            // const response = await axios({
            //     method: 'get',
            //     url: allCoursesSchedulesApiUrl,
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     params: { arr: courses_numbers, semester: semester }
            // });
            const coursesSchedules = response.data;
            return coursesSchedules;
        } catch (e) {
            console.log(e);
        }
    }

}