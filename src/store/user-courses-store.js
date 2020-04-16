import {action, observable, when} from "mobx"
import {inject, postConstruct, Store} from "mmlpx"
import UserCoursesLoader from "../loaders/user-courses-loader";

@Store
export default class UserCoursesStore {
    @observable userCourses = [];
    @observable electiveCoursesCodes = [];
    @observable mandatoryCoursesCodes = [];
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

    @postConstruct
    init() {
        this.loadUserCourses();
        this.loadMandatoryCoursesCodes();
        this.loadElectiveCoursesCodes();
    }
}