
export default class Course {
    name = "";
    prerequisites = [];
    creditPoints;

    constructor(name, prerequisites, creditPoints) {
        this.name = name;
        this.prerequisites = prerequisites;
        this.creditPoints = creditPoints;
    }
}