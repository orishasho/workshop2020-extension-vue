import './css/circle.css'
import * as coursesColoringModule from "./modules/courses-coloring"
import * as viewingStatesModule from "./modules/viewing-states"

if (viewingStatesModule.isViewingCoursesTable()) {
    coursesColoringModule.handleCoursesTableColoring();
} else if (viewingStatesModule.isViewingGrades()) {
    // fetchCoursesData();
}
