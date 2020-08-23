import { computed } from 'mobx';
import { ViewModel, inject } from 'mmlpx';
import UserCoursesStore from "../store/user-courses-store";

@ViewModel
export default class DegreeStatusVm {
    @inject(UserCoursesStore) userCoursesStore;

    isManagementCollege = window.location.href.includes('colman');

    // computed properties:

    @computed
    get isLoading() {
        return this.userCoursesStore.isLoading;
    }

    @computed
    get hasUserCoursesData() {
        return !this.userCoursesStore.isLoading && this.userCoursesStore.userCourses.length > 0;
    }

    @computed
    get showNoCoursesFound() {
        return !this.userCoursesStore.isLoading && this.userCoursesStore.userCourses.length === 0;
    }

    @computed
    get userCourses() {
        return this.userCoursesStore.userCourses;
    }

    @computed
    get creditsCompleted() {
        let credits = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (userCourse['course_status'] === 'passed' && userCourse['course_points'] !== "") {
                credits += parseFloat(userCourse['course_points']);
            }
        });

        return credits;
    }

    @computed
    get creditsToBeCompletedByYearEnd() {
        const creditsCompleted = this.creditsCompleted;
        let creditsToBeCompleted = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (userCourse['course_status'] === 'signed' && userCourse['course_points'] !== "") {
                creditsToBeCompleted += parseFloat(userCourse['course_points']);
            }
        });

        return creditsCompleted + creditsToBeCompleted;
    }

    @computed
    get mandatoryCreditsCompleted() {
        let mandatoryCredits = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (this.userCoursesStore.mandatoryCoursesNumbers.some(courseNumber => {
                return userCourse['course_number'] === courseNumber;
            }) && userCourse['course_status'] === 'passed' && userCourse['course_points'] !== "") {
                mandatoryCredits += parseFloat(userCourse['course_points']);
            }
        });

        return mandatoryCredits;
    }

    @computed
    get mandatoryCreditsToBeCompletedByYearEnd() {
        const mandatoryCreditsCompleted = this.mandatoryCreditsCompleted;
        let mandatoryCreditsToBeCompleted = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (this.userCoursesStore.mandatoryCoursesNumbers.some(courseNumber => {
                return userCourse['course_number'] === courseNumber;
            }) && userCourse['course_status'] === 'signed' && userCourse['course_points'] !== "") {
                mandatoryCreditsToBeCompleted += parseFloat(userCourse['course_points']);
            }
        });

        return mandatoryCreditsCompleted + mandatoryCreditsToBeCompleted;
    }

    @computed
    get electiveCreditsCompleted() {
        let electiveCredits = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (this.userCoursesStore.electiveCoursesNumbers.some(courseNumber => {
                return userCourse['course_number'] === courseNumber;
            }) && userCourse['course_status'] === 'passed' && userCourse['course_points'] !== "") {
                electiveCredits += parseFloat(userCourse['course_points']);
            }
        });

        return electiveCredits;
    }

    @computed
    get electiveCreditsToBeCompletedByYearEnd() {
        const electiveCreditsCompleted = this.electiveCreditsCompleted;
        let electiveCreditsToBeCompleted = 0;
        this.userCoursesStore.userCourses.forEach(userCourse => {
            if (this.userCoursesStore.electiveCoursesNumbers.some(courseNumber => {
                return userCourse['course_number'] === courseNumber;
            }) && userCourse['course_status'] === 'signed' && userCourse['course_points'] !== "") {
                electiveCreditsToBeCompleted += parseFloat(userCourse['course_points']);
            }
        });

        return electiveCreditsCompleted + electiveCreditsToBeCompleted;
    }

    @computed
    get isWorkshopCompleted() {
        return this.userCoursesStore.userCourses.some(userCourse =>
            userCourse['course_type'] === 'workshop' &&
            userCourse['course_status'] === 'passed');
    }

    @computed
    get isWorkshopCompletedByYearEnd() {
        return this.isWorkshopCompleted
            || this.userCoursesStore.userCourses.some(userCourse =>
                userCourse['course_type'] === 'workshop' &&
                userCourse['course_status'] === 'signed');
    }

    @computed
    get isMathClassCompleted() {
        return this.userCoursesStore.userCourses.some(userCourse =>
            userCourse['course_status'] === 'passed' &&
            userCourse['course_type'] === 'math');
    }

    @computed
    get isMathClassCompletedByYearEnd() {
        return this.isMathClassCompleted
            || this.userCoursesStore.userCourses.some(userCourse =>
                userCourse['course_status'] === 'signed' &&
                userCourse['course_type'] === 'math');
    }

    @computed
    get totalRequiredCredits() {
        if (this.isManagementCollege) {
            return this.userCoursesStore.totalRequiredCreditsManagementCollege;
        } else {
            return this.userCoursesStore.totalRequiredCredits;
        }
    }

    @computed
    get electiveRequiredCredits() {
        if (this.isManagementCollege) {
            return this.userCoursesStore.electiveRequiredCreditsManagementCollege;
        } else {
            return this.userCoursesStore.electiveRequiredCredits;
        }
    }

    @computed
    get mandatoryRequiredCredits() {
        if (this.isManagementCollege) {
            return this.userCoursesStore.mandatoryRequiredCreditsManagementCollege;
        } else {
            return this.userCoursesStore.mandatoryRequiredCredits;
        }
    }
}