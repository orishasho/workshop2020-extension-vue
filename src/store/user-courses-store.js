import {action, observable} from "mobx"
import {inject, postConstruct, Store} from "mmlpx"
import UserCoursesLoader from "../loaders/user-courses-loader";

@Store
export default class UserCoursesStore {
    @observable userCourses = [];
    @inject(UserCoursesLoader) loader;

    @action.bound
    async loadUserCourses() {
        this.userCourses = await this.loader.getUserCourses();
    }

    @postConstruct
    init() {
        this.loadUserCourses();
    }
}