import {action, observable} from "mobx"
import {inject, postConstruct, Store} from "mmlpx"
import UserCoursesLoader from "../loaders/userCoursesLoader";

@Store
export default class UserCoursesStore {
    @observable userCourses = [];
    @observable electiveCoursesNumbers = [];
    @observable mandatoryCoursesNumbers = [];
    @observable mathCoursesNumbers = [];
    @observable workshopCoursesNumbers = [];
    @observable seminarionCoursesNumbers = [];
    @observable totalRequiredCredits = 124;
    @observable electiveRequiredCredits = 30;
    @observable mandatoryRequiredCredits = 84;
    @observable mathRequiredCredits = 4;
    @observable totalRequiredCreditsManagementCollege = 120;
    @observable electiveRequiredCreditsManagementCollege = 14;
    @observable mandatoryRequiredCreditsManagementCollege = 100;
    @observable isLoading = true;
    @inject(UserCoursesLoader) loader;

    @action.bound
    async loadUserCourses() {
        this.userCourses = await this.loader.getUserCourses();
        this.isLoading = false;
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
        // MTA Only!
        this.mathCoursesNumbers = await this.loader.getSpecificCourseTypeNumbers('math');
    }

    @action.bound
    async loadWorkshopCoursesNumbers() {
        this.workshopCoursesNumbers = await this.loader.getSpecificCourseTypeNumbers('workshop');
    }

    @action.bound
    async loadSeminarionCoursesNumbers() {
        // Management college only!
        this.seminarionCoursesNumbers = await this.loader.getSpecificCourseTypeNumbers('seminarion');
    }

    @postConstruct
    init() {
        this.loadUserCourses();
        this.loadMandatoryCoursesNumbers();
        this.loadElectiveCoursesNumbers();
        this.loadMathCoursesNumbers();
        this.loadWorkshopCoursesNumbers();
        this.loadSeminarionCoursesNumbers();
    }
}