export default class UserCoursesLoader {
    getUserCourses() {
        return new Promise(resolve => {
            chrome.storage.local.get(['userCourses'], function(result) {
                resolve(result.userCourses);
            })
        })
    }
}