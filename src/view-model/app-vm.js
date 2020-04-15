import { computed } from 'mobx';
import { ViewModel, inject } from 'mmlpx';
import UserCoursesStore from "../store/user-courses-store";

@ViewModel
export default class AppVm {
    @inject(UserCoursesStore) userCoursesStore;

    @computed
    get userCourses() {
        return this.userCoursesStore.userCourses;
    }

    @computed
    get creditPointsCompleted() {
        let credits = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            const courseGrade = parseInt(userCourse['ציון']);
            if (!isNaN(courseGrade) && courseGrade >= 60) {
                credits += parseFloat(userCourse['נ"ז']);
            }
        });

        return credits;
    }
}