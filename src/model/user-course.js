import Course from "./course";

export default class UserCourse extends Course {
    grade;

    constructor(name, prerequisites, creditPoints, grade) {
        super(name, prerequisites, creditPoints);
        this.grade = grade;
    }

    get passed() {
        return this.grade > 60;
    }
}