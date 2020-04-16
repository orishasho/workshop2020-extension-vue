import { computed } from 'mobx';
import { ViewModel, inject } from 'mmlpx';
import UserCoursesStore from "../store/user-courses-store";

@ViewModel
export default class AppVm {
    @inject(UserCoursesStore) userCoursesStore;

    // computed properties:

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

    @computed
    get mandatoryCreditsCompleted() {
        let mandatoryCredits = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (this.userCoursesStore.mandatoryCoursesCodes.some(courseCode => {
                return userCourse['שם קורס'].includes(courseCode);
            }) && this.isCourseCompleted(userCourse)) {
                mandatoryCredits += parseFloat(userCourse['נ"ז']);
            }
        });

        return mandatoryCredits;
    }

    @computed
    get electiveCreditsCompleted() {
        let electiveCredits = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (this.userCoursesStore.electiveCoursesCodes.some(courseCode => {
                return userCourse['שם קורס'].includes(courseCode);
            }) && this.isCourseCompleted(userCourse)) {
                electiveCredits += parseFloat(userCourse['נ"ז']);
            }
        });

        return electiveCredits;
    }

    @computed
    get totalRequiredCredits() {
        return this.userCoursesStore.totalRequiredCredits;
    }

    @computed
    get electiveRequiredCredits() {
        return this.userCoursesStore.electiveRequiredCredits;
    }

    @computed
    get mandatoryRequiredCredits() {
        return this.userCoursesStore.mandatoryRequiredCredits;
    }

    @computed
    get mathRequiredCredits() {
        return this.userCoursesStore.mathRequiredCredits;
    }

    // helper functions:

    isCourseCompleted(userCourse) {
        const courseGrade = parseInt(userCourse['ציון']);
        return !isNaN(courseGrade) && courseGrade >= 60 || userCourse['ציון'] === 'פטור';
    }
}