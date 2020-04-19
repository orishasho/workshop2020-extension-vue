import {action, observable} from "mobx"
import {inject, postConstruct, Store} from "mmlpx"
import UserCoursesLoader from "../loaders/user-courses-loader";

@Store
export default class UserCoursesStore {
    @observable userCourses = [];
    @observable electiveCoursesCodes = [];
    @observable mandatoryCoursesCodes = [];
    @observable mathCoursesCodes = [];
    @observable totalRequiredCredits = 124;
    @observable electiveRequiredCredits = 30;
    @observable mandatoryRequiredCredits = 84;
    @observable mathRequiredCredits = 4;
    @inject(UserCoursesLoader) loader;

    @action.bound
    async loadUserCourses() {
        this.userCourses = await this.loader.getUserCourses();
    }

    @action.bound
    loadElectiveCoursesCodes() {
        this.electiveCoursesCodes = this.loader.getElectiveCoursesCodes();
    }

    @action.bound
    loadMandatoryCoursesCodes() {
        this.mandatoryCoursesCodes = this.loader.getMandatoryCoursesCodes();
    }

    @action.bound
    loadMathCoursesCode() {
        this.mathCoursesCodes = this.loader.getMathCoursesCodes();
    }

    @postConstruct
    init() {
        this.loadUserCourses();
        this.loadMandatoryCoursesCodes();
        this.loadElectiveCoursesCodes();
    }
}