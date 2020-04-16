import { computed } from 'mobx';
import { ViewModel, inject } from 'mmlpx';
import UserCoursesStore from "../store/user-courses-store";

@ViewModel
export default class AppVm {
    @inject(UserCoursesStore) userCoursesStore;

    @computed
    get hasUserCoursesData() {
        return this.userCoursesStore.userCourses.length > 0;
    }

    @computed
    get userCourses() {
        return this.userCoursesStore.userCourses;
    }

    @computed
    get creditsCompleted() {
        let credits = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (this.isCourseCompleted(userCourse)) {
                credits += parseFloat(userCourse['נ"ז']);
            }
        });

        return credits;
    }

    @computed
    get creditsToBeCompletedByYearEnd() {
        const creditsCompleted = this.creditsCompleted;
        let creditsToBeCompleted = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (userCourse['ציון'] === 'טרם') {
                creditsToBeCompleted += parseFloat(userCourse['נ"ז']);
            }
        })

        return creditsCompleted + creditsToBeCompleted;
    }

    isCourseCompleted(userCourse) {
        const courseGrade = parseInt(userCourse['ציון']);
        return !isNaN(courseGrade) && courseGrade >= 60 || userCourse['ציון'] === 'פטור';
    }
}