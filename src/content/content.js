import './css/circle.css'
import * as coursesColoringModule from "./modules/courses-coloring"
import * as viewingStatesModule from "./modules/viewing-states"
import * as fetchUserCoursesModule from "./modules/fetch-user-courses"

if (viewingStatesModule.isViewingCoursesTable()) {
    coursesColoringModule.handleCoursesTableColoring();
} else if (viewingStatesModule.isViewingGrades()) {
    fetchUserCoursesModule.fetchUserCoursesInfo();
}
