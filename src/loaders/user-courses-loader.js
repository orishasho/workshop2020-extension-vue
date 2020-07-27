const axios = require('axios');
const userCourseApiUrl = 'http://localhost:8080/user_course';
const courseApiUrl = 'http://localhost:8080/course';

export default class UserCoursesLoader {

    async getUserCourses() {
        //TODO: dynamic user_id
        try {
            const response = await axios.get(`${userCourseApiUrl}/detailed?user_id=2`);
            const userCoursesArray = response.data;
            console.dir(userCoursesArray);
            return userCoursesArray;
        } catch(e) {
            console.log(e);
        }
    }

    //courseType = 'mandatory' / 'elective' / 'math' / 'workshop'
    async getSpecificCourseTypeNumbers(courseType) {
        try {
            const response = await axios.get(`${courseApiUrl}/${courseType}`);
            const electiveCoursesArray = response.data;
            const electiveCoursesNumbers = electiveCoursesArray.map(electiveCourse => electiveCourse['course_number']);
            return electiveCoursesNumbers;
        } catch(e) {
            console.log(e);
        }
    }

}