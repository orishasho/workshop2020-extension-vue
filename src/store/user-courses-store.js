import {action, observable} from "mobx"
import {inject, postConstruct, Store} from "mmlpx"
import UserCoursesLoader from "../loaders/user-courses-loader";

@Store
export default class UserCoursesStore {
    @observable userCourses = [];
    @observable electiveCoursesNumbers = [];
    @observable mandatoryCoursesNumbers = [];
    @observable mathCoursesNumbers = [];
    @observable workshopCoursesNumbers = [];
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
    async loadElectiveCoursesNumbers() {
        this.electiveCoursesNumbers = await this.loader.getSpecificCourseTypeNumbers('elective');
    }

    @action.bound
    async loadMandatoryCoursesNumbers() {
        this.mandatoryCoursesNumbers = await this.loader.getSpecificCourseTypeNumbers('mandatory');
    }

    @action.bound
    async loadMathCoursesNumbers() {
        this.mathCoursesNumbers = await this.loader.getSpecificCourseTypeNumbers('math');
    }

    @action.bound
    async loadWorkshopCoursesNumbers() {
        this.mathCoursesNumbers = await this.loader.getSpecificCourseTypeNumbers('workshop');
    }

    @postConstruct
    init() {
        this.loadUserCourses();
        this.loadMandatoryCoursesNumbers();
        this.loadElectiveCoursesNumbers();
        this.loadMathCoursesNumbers();
        this.loadWorkshopCoursesNumbers();
    }
}