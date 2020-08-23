<template>
  <MountingPortal mountTo="#main-content-container-id" name="source" append>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <div v-if="isInManagementCollege()" class="not-available">
      <h1>אפשרות זו אינה זמינה עדיין באתר המכללה למנהל</h1>
    </div>

    <div v-else>
      <div class="tabs-drafts-container">

        <div class="drafts-dropdown-container">
          <button class="dropbtn-drafts" id="coursesDropdownBtn-drafts" v-on:click="openDraftsDropdown()">
            בחר טיוטת מערכת...
            &emsp;
            <i class="fa fa-caret-down"></i>
          </button>
          <div class="dropdown-content" id="myDropdown-drafts"></div>
        </div>

        <div class="save-btn-1">
          <div class="save-draft-btn disabled" id="overwrite-draft-btn" @click="updateDraft()">שמור</div>
        </div>

        <div class="save-btn-1">
          <div class="save-draft-btn disabled" id="finalize-draft-btn" @click="finalizeDraft()">סמן כטיוטה ראשית</div>
        </div>

        <div class="save-btn-2">
          <div class="save-draft-btn" id="saveas-draft-btn" @click="saveDraftAs()">שמור טיוטה בשם...</div>
        </div>

        <div class="tab">
          <ul class="tabs">
            <li id="semester1"  class="current"><a href="#">סמסטר א'</a></li>
            <li id="semester2"><a href="#">סמסטר ב'</a></li>
            <li id="semester3"><a href="#">סמסטר קיץ</a></li>
          </ul>
        </div>

        <div class="reset-layout-btn">
          <div class="reset-layout-btn-cls" id="reset-layout-btn-id" @click="clearSchedule()">נקה לוח</div>
        </div>

      </div>

      <div class = "scheduleContainer">
        <div class="leftcolumn">
          <table id="coursesTimetable">
            <thead>
            <tr>
              <th></th>
              <th>
                <span class="long">ראשון</span>
              </th>
              <th>
                <span class="long">שני</span>
              </th>
              <th>
                <span class="long">שלישי</span>
              </th>
              <th>
                <span class="long">רביעי</span>
              </th>
              <th>
                <span class="long">חמישי</span>
              </th>
              <th>
                <span class="long">שישי</span>
              </th>
            </tr>
            </thead>
            <tbody ref="mytbody"></tbody>
          </table>
        </div>

        <div class="rightcolumn">
          <button class="dropbtn" id="coursesDropdownBtn"  v-on:click="myFunction()" >
            אנא בחר קורס...
            &emsp;
            <i class="fa fa-caret-down"></i>
          </button>
          <div class="dropdown-content" id="myDropdown"></div>

          <div class="card" id="courses-details" style="visibility: hidden;"></div>
        </div>
      </div>
    </div>
  </MountingPortal>
</template>

<script>
  import { MountingPortal} from "portal-vue";
  import CoursesSchedulesLoader from "../loaders/courses-schedules-loader";
  import UserScheduleDraftsLoader from "../loaders/user-schedule-drafts-loader";
  import _ from "lodash";
  export default {
    name: "Schedule",
    components: {
      MountingPortal
    },

    data: function () {
      return {
        coursesSchedules: [],
        currentSemester: 1,
        currentDraftName: "",
        coursesSchedulesLoader: {},
        draftsLoader: {},
        draftBySemesterMap: {1:[], 2:[], 3:[]},
        allUserDraftNames: [],
        needToRemoveOverlaps: 0,

        dayName: {
          1: "יום א'",
          2: "יום ב'",
          3: "יום ג'",
          4: "יום ד'",
          5: "יום ה'",
          6: "יום ו'"
        },
        classTypeName: {
          "lecture": "הרצאה",
          "tirgul": "תרגול"
        }

      }
    },
/*
    mounted:  function () {
        this.$nextTick(() => {
          console.log(this.$refs.mytbody);
        });
    },*/

    mounted:  function () {
      this.$nextTick(() => {
            this.coursesSchedulesLoader = new CoursesSchedulesLoader();
            this.draftsLoader = new UserScheduleDraftsLoader();
            this.changePageTitle();
            this.createClickEventsForSemesterButtons();
            this.generateTableCells();
            this.fillCoursesDropdown();
            this.fillDraftsDropdown();
          });
    },

    created:  async function () {
            // Close the dropdown if the user clicks outside of it
            window.onclick = function (e) {
              if (!e.target.matches('.dropbtn')) {
                let myDropdown = document.getElementById("myDropdown");
                if (myDropdown.classList.contains('show')) {
                  myDropdown.classList.remove('show');
                }
              }
              if (!e.target.matches('.dropbtn-drafts')) {
                let myDropdown = document.getElementById("myDropdown-drafts");
                if (myDropdown.classList.contains('show')) {
                  myDropdown.classList.remove('show');
                }
              }
            }
      },


    methods: {
      isInManagementCollege() {
        return window.location.href.includes('colman');
      },

      fillCoursesDropdown() {
        this.coursesSchedulesLoader
        .getPossibleCourses(this.currentSemester)
        .then(possibleCourses => {
          possibleCourses.forEach(course => this.addCourseToDropdown(course));
          return possibleCourses;
        })
        .then(async possibleCourses => {
          // const possibleCoursesNumbers = [];
          const possibleCoursesNumbers = possibleCourses.map(possibleCourse => possibleCourse.course_number_res);
          console.log("showing possible");
          console.dir(possibleCoursesNumbers);
          this.coursesSchedules = await this.coursesSchedulesLoader.getCoursesSchedules(possibleCoursesNumbers, this.currentSemester);
        })
      },

      fillDraftsDropdown() {
        this.draftsLoader.getUserScheduleDraftNames()
        .then(draftNamesArray => {
          console.dir(draftNamesArray);
          draftNamesArray.forEach(draftName => {
            this.addDraftToDropdown(draftName);
            this.allUserDraftNames.push(draftName.draft_name);
            });
        });
      },

      createCourseTableItem(evt) {
        let course = evt.target.courseParam;
        let courseTitle = course.course_name;
        let courseDay = course.day;
        let courseStartHour = course.start_time.replace(":",".");
        let courseEndHour = course.end_time.replace(":",".");
        let courseTeacher = course.teacher;
        let courseType = course.type;

        if (this.isCourseOverlap(course)) {
          console.log("going to remove: ");
          console.dir(course);
          //this.removeLecturesFromSchedule(course.course_number, course.course_group, course.type);
        } else {
          const startHourParts = (courseStartHour + "").split(".");
          let startHourD = new Date(2018, 4, courseDay, startHourParts[0], startHourParts[1]);
          const endHourParts = (courseEndHour + "").split(".");
          let endHourD = new Date(2018, 4, courseDay, endHourParts[0], endHourParts[1]);
          const millisecondsDur = Math.abs(endHourD - startHourD);
          const hoursDur = millisecondsDur / 36e5;

          let divItem = document.createElement("div");
          let tdHeight = (document.getElementsByTagName("td")[0]).clientHeight;
          divItem.style.height = (tdHeight * hoursDur * 2) + "px";

          let divTopRatio = startHourParts[1];
          if (startHourParts[1] >= 30) {
            divTopRatio -= 30;
          }
          divItem.style.top = ((divTopRatio / 30) * 100) + "%";
          divItem.setAttribute("class", "courseTableDiv");
          divItem.setAttribute("ref", "courseTableDiv");
          divItem.innerHTML = evt.target.innerHTML;
          divItem.courseDetails = course;
          divItem.buttonRef = evt.target;
          divItem.addEventListener('click', this.removeCourseFromTimeTable);

          this.placeCourseInTable(divItem, course);
          //this.remove
          
           if (evt.target.parentNode) {
                const evtTargetContainer = evt.target.parentNode;

                evt.target.parentNode.removeChild(evt.target);

                const evtTargetContainerChildren = evtTargetContainer.children;

                
                if (course.type === "lecture") {
                    for (let i = 0; i < evtTargetContainerChildren.length; i++) {
                        if (evtTargetContainerChildren[i].className === "courseDetails" && 
                            evtTargetContainerChildren[i].courseParam.type === "lecture") {
                            console.dir(evtTargetContainerChildren[i]);
                            evtTargetContainerChildren[i].click();
                        }
                    }
                  if (this.needToRemoveOverlaps === 1) {
                    this.removeLecturesFromSchedule(course.course_number, course.course_group, course.type);
                  }
                }
          } 
        }
      },

      removeCourseFromTimeTable(evt) {
        ////////////
        const course = evt.target.courseDetails;
        const course_number = course.course_number;
        const course_group = course.course_group;
        const type = course.type;

        //evt.target.buttonRef.style.visibility = "visible";
        //NEED TO CHANGE TO COURSE GROUP ID OR SOMETHING LIKE THAT
        let coursePlacementContainer = document.getElementById("coursePlacementContainer_" + evt.target.courseDetails.course_name + " " + evt.target.courseDetails.course_group);
        if (coursePlacementContainer) {
          coursePlacementContainer.appendChild(this.generateCoursePlacementButton(evt.target.courseDetails));
        }

        evt.target.parentNode.removeChild(evt.target);

        this.removeLecturesFromSchedule(course_number, course_group, type);
      },

      removeLecturesFromSchedule(course_number, course_group, type) {
        let currentDivsInTable = document.getElementsByClassName("courseTableDiv");
        if (type === "lecture") {
          for (let i = 0; i < currentDivsInTable.length; i++) {
            let divItem = currentDivsInTable[i];
            if (divItem.courseDetails.course_number === course_number && divItem.courseDetails.course_group === course_group &&
                divItem.courseDetails.type === "lecture") {
                    divItem.click();
                }
          }
        }
      },

      placeCourseInTable(divItem, course) {
        let courseDay = course.day;
        let courseTimesSplit = (course.start_time.replace(":",".")).split(".");
        let courseStartH = courseTimesSplit[0];
        let courseStartM = courseTimesSplit[1];



        if (parseInt(courseStartM) >= 30) {
          courseStartM = "30";
        } else {
          courseStartM = "00";
        }
        const cells = document.getElementsByTagName("td")
        for (let i = 0; i < cells.length; i++) {
          let currCellId = cells[i].id;
          currCellId = currCellId.split("_");
          if ((currCellId[0] == courseDay) && (currCellId[1] == courseStartH) && (currCellId[2] == courseStartM)) {
            cells[i].appendChild(divItem);
            break;
          }
        }
      },

      createClickEventsForSemesterButtons() {
        const allSemestersButtons = document.querySelectorAll('[id^="semester"]');
        for (let i = 0; i < allSemestersButtons.length; i++) {
          allSemestersButtons[i].addEventListener("click", this.semesterButtonOnClick);
        }
      },

      semesterButtonOnClick(evt) {
        if (evt.target.parentNode.id.slice(-1) === this.currentSemester) { return; }
        const allSemestersButtons = document.querySelectorAll('[id^="semester"]');
        for (let i = 0; i < allSemestersButtons.length; i++) {
          allSemestersButtons[i].classList.remove("current");
        }
        evt.target.parentNode.classList.add("current");
        this.handleSemesterSwitch();
        this.currentSemester = evt.target.parentNode.id.slice(-1);
        this.fillCoursesDropdown();
        this.loadCurrentSemesterDraft();
      },

      handleSemesterSwitch() {
          document.getElementById("myDropdown").innerHTML = "";
          document.getElementById("courses-details").innerHTML = "";    //empty course containers
          document.getElementById("coursesDropdownBtn").innerHTML = "אנא בחר קורס...&emsp;<i class=\"fa fa-caret-down\"></i>";
          this.saveCurrentSemesterCoursesToMap(true);
      },

      loadCurrentSemesterDraft() {
        this.draftBySemesterMap[this.currentSemester].forEach (courseToPlaceInTable => {
            const fakeCoursePlacementButton = this.generateCoursePlacementButton(courseToPlaceInTable);
            fakeCoursePlacementButton.click();
        });
      },

      isCourseOverlap(courseToCheck) {
        const courseDay = courseToCheck.day;
        const courseStartHour = courseToCheck.start_time.replace(":",".");
        const courseEndHour = courseToCheck.end_time.replace(":",".");

        const startHourParts = (courseStartHour + "").split(".");
        let startHourDtInput = new Date(2018, 4, courseDay, startHourParts[0], startHourParts[1]);
        const endHourParts = (courseEndHour + "").split(".");
        let endHourDtInput = new Date(2018, 4, courseDay, endHourParts[0], endHourParts[1]);

        let currentCoursesInTable = document.getElementsByClassName("courseTableDiv");
        for (let i = 0; i < currentCoursesInTable.length; i++) {
          let courseInTable = currentCoursesInTable[i];
          if (courseInTable.courseDetails.day == courseDay) {

            let startHourPartsCurrentCourseInTable = (courseInTable.courseDetails.start_time.replace(":",".") + "").split(".");
            let startHourDtCourseInTable = new Date(2018, 4, courseDay, startHourPartsCurrentCourseInTable[0], startHourPartsCurrentCourseInTable[1]);
            let endHourPartsCurrentCourseInTable = (courseInTable.courseDetails.end_time.replace(":",".") + "").split(".");
            let endHourDtCourseInTable = new Date(2018, 4, courseDay, endHourPartsCurrentCourseInTable[0], endHourPartsCurrentCourseInTable[1]);

            //1 in table, 2 input

            if ((startHourDtCourseInTable <= endHourDtInput) && (startHourDtInput <= endHourDtCourseInTable)) {
              alert("לא ניתן לשבץ במערכת השעות \n הקורס מתנגש עם הקורס המשובץ: " + courseInTable.courseDetails.course_name);
              this.needToRemoveOverlaps = 1;
              return true;
            }

          }
        }
        this.needToRemoveOverlaps = 0;
        return false;
      },

      generateTableCells() {
        /////////const body = document.getElementsByTagName("tbody")[0];
        const body = this.$refs.mytbody;
        for (let i = 8; i <= 20; i++) {
          for (let k = 0; k < 2; k++) {
            let start = i;
            let trObj = document.createElement("tr");
            let tdTimeObj = document.createElement("td");
            tdTimeObj.setAttribute("class", "hour");
            tdTimeObj.setAttribute("rowspan", "1");
            let textSpan = document.createElement("span");
            if (k === 0) {
              textSpan.innerText = i + ":00 - " + i + ":30";
            } else {
              textSpan.innerText = i + ":30 - " + (i + 1) + ":00";
            }
            tdTimeObj.appendChild(textSpan);
            trObj.appendChild(tdTimeObj);

            for (let j = 1; j <= 6; j++) {
              let tdInner = document.createElement("td");
              if (k === 0) {
                tdInner.setAttribute("id", j + "_" + i + "_00");
              } else {
                tdInner.setAttribute("id", j + "_" + i + "_30");
              }
              trObj.appendChild(tdInner);
              body.appendChild(trObj);
            }
          }
        }
      },

      changePageTitle() {
        const title = document.querySelector("h1.pull-right");
        title.innerText = "תכנון מערכת שעות";
      },

      generateCoursePlacementButton(course) {
        let divItem = document.createElement("button");
        /*divItem.style.backgroundColor = 'yellow';
        divItem.style.display = 'inline-block';*/
        divItem.setAttribute("class", "courseDetails")
        divItem.innerHTML = course.course_name + "<br>" + course.teacher + "<br>" + this.classTypeName[course.type] + "<br>" + this.dayName[course.day] + "<br>" + course.start_time + " - " + course.end_time;
        //divItem.onclick = createCourseTableItem(course.course_name, course.course_day, course.start_time, course.end_time);
        divItem.addEventListener('click', this.createCourseTableItem);
        divItem.courseParam = course;

        return divItem;
      },

      generateCourseDiv(course_number, course_name) {
        const filteredCoursesSchedules = this.coursesSchedules.filter(courseSchedule => courseSchedule.course_number === course_number);
        const filteredCoursesSchedulesGrouped = _.groupBy(filteredCoursesSchedules, courseSchedule => courseSchedule.course_group);
        let place = document.getElementById("courses-details");


        Object.entries(filteredCoursesSchedulesGrouped).forEach(([courseGroupName,courseGroupClasses]) => {
          let courseGroupContainer = this.generateCourseGroupContainer(course_name + " " + courseGroupName);
          place.appendChild(courseGroupContainer);
          courseGroupClasses.forEach(courseGroupClass => {
              let divItem = this.generateCoursePlacementButton(courseGroupClass);

              if (this.isCourseAlreadyInTable(divItem.courseParam)) {
                  divItem.style.visibility = "hidden";
              }


              if (!this.isCourseAlreadyInTable(divItem.courseParam)) {
                  courseGroupContainer.appendChild(divItem);
              }
          });
        });
      },

      generateCourseGroupContainer(courseGroupName) {
        let coursesGroupsDiv = document.createElement("div");
        coursesGroupsDiv.setAttribute("class", "courseDetailsContainer");
        coursesGroupsDiv.id = "coursePlacementContainer_" + courseGroupName; //to be changed to group id or something like that
        coursesGroupsDiv.innerHTML = "<h1><span>" + courseGroupName + "</span></h1>";
        return coursesGroupsDiv;
      },

      isCourseAlreadyInTable(course) {
        let currentCoursesInTable = document.getElementsByClassName("courseTableDiv");
        for (let i = 0; i < currentCoursesInTable.length; i++) {
          let courseInTable = currentCoursesInTable[i];
          if (_.isEqual(course, courseInTable.courseDetails)) { 
            return true;
          }
        }
        return false;
      },

      addCourseToDropdown(course) {
        const dropdown = document.getElementById('myDropdown');
        let newCourseInDropdown = document.createElement("a");
        newCourseInDropdown.setAttribute("href", "#");
        newCourseInDropdown.innerText = course.course_name_res;
        newCourseInDropdown.course_name= course.course_name_res;  
        newCourseInDropdown.course_number = course.course_number_res;  
        newCourseInDropdown.addEventListener("click", this.courseDropDownOnClick);
        dropdown.appendChild(newCourseInDropdown);
      },

      addDraftToDropdown(scheduleDraft) {
        const dropdown = document.getElementById('myDropdown-drafts');
        let newDraftInDropdown = document.createElement("a");
        newDraftInDropdown.setAttribute("href", "#");
        newDraftInDropdown.innerText = scheduleDraft.draft_name;
        newDraftInDropdown.draft_name = scheduleDraft.draft_name;
        if (scheduleDraft.is_final === 1) {
          newDraftInDropdown.style.fontWeight = "bold";
          newDraftInDropdown.innerText += " (טיוטה ראשית)";
        }
        newDraftInDropdown.addEventListener("click", this.draftDropDownOnClick);
        dropdown.appendChild(newDraftInDropdown);
      },

      courseDropDownOnClick(evt) {
        const dropdownBtn = document.getElementById("coursesDropdownBtn");
        dropdownBtn.innerHTML = evt.target.innerText + "&emsp;" + "<i class=\"fa fa-caret-down\"></i>";
        document.getElementById("courses-details").style.visibility = "visible";
        document.getElementById("courses-details").innerHTML = "";
        this.generateCourseDiv(evt.target.course_number, evt.target.course_name);     
      },

      async draftDropDownOnClick(evt) {
        const dropdownBtn = document.getElementById("coursesDropdownBtn-drafts");
        let draftName = evt.target.innerText;
        dropdownBtn.innerHTML = draftName + "&emsp;" + "<i class=\"fa fa-caret-down\"></i>";
        if (this.currentDraftName === "") {
            const overwriteDraftBtn = document.getElementById("overwrite-draft-btn");
            overwriteDraftBtn.classList.remove("disabled");
            const finalizeDraftBtn = document.getElementById("finalize-draft-btn");
            finalizeDraftBtn.classList.remove("disabled");
        }
        if (draftName.includes(" (טיוטה ראשית)")) {
          draftName = draftName.slice(0, draftName.length - " (טיוטה ראשית)".length + 1);
          console.log(`draftName: ${draftName}`);
        }
        this.currentDraftName = draftName;
        this.clearSchedule();
        //call api to bring draft
        this.draftBySemesterMap = await this.draftsLoader.getUserScheduleDraftByName(draftName);
        this.loadCurrentSemesterDraft();
      },

      myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
      },

      openDraftsDropdown() {
        document.getElementById("myDropdown-drafts").classList.toggle("show");
      },

      async saveDraftAs() {
        const draftName = window.prompt("אנא בחר שם לטיוטת המערכת");
        if (!draftName || draftName.length === 0) {
          alert("לא הוזן שם לטיוטה");
        } else if (this.allUserDraftNames.includes(draftName)) {
          alert("שם הטיוטה קיים במערכת, אנא בחר שם אחר");
        } else {
          this.saveCurrentSemesterCoursesToMap(false);
          await this.draftsLoader.storeDraft(draftName, this.draftBySemesterMap);
          alert("הטיוטה נשמרה בהצלחה");
          document.getElementById("myDropdown-drafts").innerHTML = "";
          document.getElementById("coursesDropdownBtn-drafts").innerHTML = "בחר  טיוטת מערכת...&emsp;<i class=\"fa fa-caret-down\"></i>";
          this.fillDraftsDropdown();
        }
      },

      async updateDraft() {
          this.saveCurrentSemesterCoursesToMap(false);
          await this.draftsLoader.updateDraft(this.currentDraftName, this.draftBySemesterMap);
          alert("הטיוטה נשמרה בהצלחה"); 
      },

      async finalizeDraft() {
          await this.draftsLoader.finalizeDraft(this.currentDraftName);
          alert("הטיוטה סומנה כראשית"); 
          document.getElementById("myDropdown-drafts").innerHTML = "";
          document.getElementById("coursesDropdownBtn-drafts").innerHTML = "בחר  טיוטת מערכת...&emsp;<i class=\"fa fa-caret-down\"></i>";
          this.fillDraftsDropdown();
      },

      saveCurrentSemesterCoursesToMap(removeFromTable) {
        const currentCoursesInTable = document.querySelectorAll(".courseTableDiv");
          this.draftBySemesterMap[this.currentSemester] = [];
          for (let i = 0; i < currentCoursesInTable.length; i++) {
            this.draftBySemesterMap[this.currentSemester].push(currentCoursesInTable[i].courseDetails);
            if(removeFromTable) {
                currentCoursesInTable[i].parentNode.removeChild(currentCoursesInTable[i]);
            }
          }
      },

      clearSchedule() {
        this.draftBySemesterMap = {1:[], 2:[], 3:[]};
        document.getElementById("myDropdown").innerHTML = "";
        document.getElementById("courses-details").innerHTML = "";    //empty course containers
        document.getElementById("coursesDropdownBtn").innerHTML = "אנא בחר קורס...&emsp;<i class=\"fa fa-caret-down\"></i>";
        this.fillCoursesDropdown();
        const currentCoursesInTable = document.querySelectorAll(".courseTableDiv");
        for (let i = 0; i < currentCoursesInTable.length; i++) {
          currentCoursesInTable[i].parentNode.removeChild(currentCoursesInTable[i]);
      }
     }
    }
  }

</script>



<style lang="scss">
  .scheduleContainer  {
    direction: rtl;
  }

  .scheduleContainer  table {
    font-family: arial;
    width: 100%;
    border-spacing: 0;
    border-collapse: separate;
    table-layout: fixed;
    margin-bottom: 50px;
  }

  .scheduleContainer  table td {
    position: relative;
  }

    .scheduleContainer  th {
    text-align: center;
  }

  /*
  table td#child {

  }*/

  .scheduleContainer  table thead tr th {
    background: #626e7e;
    color: #d1d5db;
    padding: 0.5em;
    overflow: hidden;
  }

  .scheduleContainer  table thead tr th:first-child {
    border-radius: 3px 0 0 0;
  }

  .scheduleContainer  table thead tr th:last-child {
    border-radius: 0 3px 0 0;
  }

  .scheduleContainer  table thead tr th .day {
    display: block;
    font-size: 1.2em;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin: 0 auto 5px;
    padding: 5px;
    line-height: 1.8;
    text-align: center;
  }

  .scheduleContainer  table thead tr th .day.active {
    background: #d1d5db;
    color: #626e7e;
  }

  .scheduleContainer  table thead tr th .short {
    display: none;
  }

  .scheduleContainer  table thead tr th i {
    vertical-align: middle;
    font-size: 2em;
  }

  .scheduleContainer  table tbody tr {
    background: #d1d5db;
  }

  .scheduleContainer  table tbody tr:nth-child(odd) {
    background: #c8cdd4;
  }

  .scheduleContainer  .leftcolumn {
    float: left;
    width: 75%;
  }

  /* Right column */

  .scheduleContainer  .rightcolumn {
    float: right;
    width: 22%;
    background-color: #f1f1f1;
    padding-left: 20px;
    min-height: 100px;
    overflow: hidden;
  }

  .scheduleContainer  .card {
    background-color: white;
    padding: 20px;
    margin-top: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .scheduleContainer  .card div {
    padding-bottom: 20px;
  }

  .scheduleContainer  .tabbed {
    position: absolute;
    left: 150px;
  }

  .scheduleContainer  .dropdown {
    /*float: left;*/
    /*overflow: hidden;*/
    height: 10px;
  }

  .dropbtn-drafts {
    cursor: pointer;
    font-size: 16px;
    border: none;
    outline: none;
    padding: 0.4em 1em;
    font-family: Arial, Helvetica, sans-serif;
    background: #67b897;
    color: #fff !important;
    font-weight: bold;
  }

    .scheduleContainer  .dropbtn{
    cursor: pointer;
    font-size: 16px;
    border: none;
    outline: none;
    color: black;
    padding: 14px 16px;
    font-family: Arial, Helvetica, sans-serif;
    margin-right: 20px;
    margin-top: 20px;
    background: #9bdecb;
    color: #fff;
    font-weight: bold;
  }

  .scheduleContainer  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    margin-right: 20px;
    font-family: Arial;
    font-size: smaller;
    overflow: auto;
    max-height: 50%;
  }

  .scheduleContainer  .dropdown-content a {
    /*float: none;*/
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: right;
  }

  .scheduleContainer  .dropdown-content a:hover {
    background: #f0fffb;
  }


  .drafts-dropdown-container  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    font-family: Arial;
    font-size: smaller;
    overflow: auto;
    max-height: 50%;
  }

  .drafts-dropdown-container .dropdown-content a {
    /*float: none;*/
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: right;
  }

  .drafts-dropdown-container  .dropdown-content a:hover {
    background: #f0fffb;
  }




  .scheduleContainer  .show {
    display: block;
  }

  .drafts-dropdown-container  .show {
    display: block;
  }

  .scheduleContainer  .courseTableDiv {
    line-height: 150%;
    position: absolute;
    z-index: 1;
    background: linear-gradient(135deg, #8eeecc, #8ebbee);
    /*height: 94.05px;*/
    /*height: 120px;
      33 * NUMBER*/
    text-align: center;
    border: 1px outset black;
    /*box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);*/
    /*width: 180px;*/
    width: 99%;
    font-size: small;
    font-weight: bold;
    /*margin-left: auto;
      margin-right: auto;*/
    justify-content: center;
    /*margin-right: 15px;
      margin-top: -18px;*/
    /*line-height: 200px;*/
    /*white-space: pre;*/
    display: -webkit-box;
    display: flex;
    transition: 0.2s ease box-shadow, 0.2s ease transform;
  }

  .scheduleContainer  .courseTableDiv:hover {
    box-shadow: 0 20px 30px 0 rgba(142, 188, 238, 0.3);
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
    cursor: pointer;
  }

  .scheduleContainer  .courseTableDiv p {
    margin: auto;
    position: relative;
    /*top: 30%;*/
    font-size: small;
    font-weight: bold;
    vertical-align: middle;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  /*
  table tbody tr:nth-child(4n+0) td {
      border-bottom: 1px solid #626E7E;
  }
  */

  .scheduleContainer  table tbody tr td {
    text-align: center;
    vertical-align: top;
    border-left: 1px solid #626e7e;
    position: relative;
    height: 32px;
  }

  /*
  table tbody tr td:last-child {
      border-right: 1px solid #626E7E;
  }
  */

  .scheduleContainer  table tbody tr td.hour {
    /*font-size: 2em;*/
    padding: 0;
    color: #626e7e;
    background: #fff;
    border-bottom: 1px solid #626e7e;
    border-right: 1px solid #626e7e;
    border-collapse: separate;
    min-width: 100px;
    cursor: default;
  }

  .scheduleContainer  table tbody tr td.hour span {
    display: block;
  }

  .scheduleContainer  .courseDetails {
	  box-shadow:inset 0px 1px 0px 0px #91b8b3;
	  background:linear-gradient(to bottom, #85b8aa 5%, #6c7c7c 100%);
	  background-color:#85b8aa;
	  border-radius:6px;
	  border:1px solid #566963;
	  display:inline-block;
	  cursor:pointer;
	  color:#ffffff;
	  font-family:Arial;
	  font-size:15px;
	  font-weight:bold;
	  padding:6px 24px;
	  text-decoration:none;
	  text-shadow:0px 1px 0px #2b665e;
    margin-bottom: 10px;
    line-height: 100%;
  }

  .scheduleContainer  .courseDetails:hover {
	  background:linear-gradient(to bottom, #6c7c7c 5%, #85b8aa 100%);
	  background-color:#6c7c7c;
  }

  .scheduleContainer  .courseDetails:active {
    position: relative;
    top: 1px;
  }

  .scheduleContainer  .courseDetailsContainer {
    border-radius: 10px 10px 10px 10px;
    -moz-border-radius: 10px 10px 10px 10px;
    -webkit-border-radius: 10px 10px 10px 10px;
    border: 1px solid #000000;
    font-family: Arial, Helvetica, sans-serif;
    /*padding-bottom: 20px;*/
    padding-right: 5px;
    margin-bottom: 10px;
  }

  .scheduleContainer  .courseDetailsContainer h1 {
    text-align: right;
    margin-top: -10px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }

  .scheduleContainer  .courseDetailsContainer h1 span {
    background-color: white;
  }

  

  @media (max-width: 60em) {
    table thead tr th .long {
      display: none;
    }
    table thead tr th .short {
      display: block;
    }
    table tbody tr td.hour span {
      transform: rotate(270deg);
      -webkit-transform: rotate(270deg);
      -moz-transform: rotate(270deg);
    }
  }
  
  

    @media (max-width: 27em) {
    table thead tr th {
      font-size: 65%;
    }
    table thead tr th .day {
      display: block;
      font-size: 1.2em;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      margin: 0 auto 5px;
      padding: 5px;
    }
    table thead tr th .day.active {
      background: #d1d5db;
      color: #626e7e;
    }
    table tbody tr td.hour {
      font-size: 1.7em;
    }
    table tbody tr td.hour span {
      transform: translateY(16px) rotate(270deg);
      -webkit-transform: translateY(16px) rotate(270deg);
      -moz-transform: translateY(16px) rotate(270deg);
    }
  }

  .tab {
	margin-bottom: 20px;
	position: relative;
	overflow: hidden;
	background: #fff;
	font-family: "Arial";
	line-height: 1.5;
	font-weight: 300;
	color: #888;
	-webkit-font-smoothing: antialiased;
  direction: rtl;
    text-align:center;/* Add This*/
    
}

.tabs {
	/*display: table;
	position: relative;*/
	overflow: hidden;
	margin: 0;
	width: 100%;
  direction: rtl;
    display: flex;
  justify-content: center;
  align-items: center;


	li {
		float: left;
		line-height: 38px;
		overflow: hidden;
		padding: 0;
		position: relative;


	}

	a {
		background-color: #eff0f2;
		border-bottom: 1px solid #fff;
		color: #888;
		font-weight: 500;
		display: block;
		letter-spacing: 0;
		outline: none;
		padding: 0 20px;
		text-decoration: none;
		-webkit-transition: all 0.2s ease-in-out;
		-moz-transition: all 0.2s ease-in-out;
		transition: all 0.2s ease-in-out;
		border-bottom: 2px solid #67b897;
	}
}

.current a{
	color: #fff;
	background: #67b897;
}

.tabs-drafts-container {
  display: flex;
  flex-direction: row;
}

.reset-layout-btn-cls {
  background-color:gray;
	border-radius:28px !important;
	display:inline-block;
	cursor:pointer;
	color:#ffffff !important;
	font-family:Arial;
	font-size:17px;
	padding:0.4em 1em;
	text-decoration:rtl;
}

.reset-layout-btn-cls:hover {
  background-color:#696969;
	border-radius:28px !important;
	display:inline-block;
	cursor:pointer;
	color:#ffffff !important;
	font-family:Arial;
	font-size:17px;
	padding:0.4em 1em;
	text-decoration:rtl;
}

.save-draft-btn {
	background-color:#67b897;
	border-radius:28px !important;
	display:inline-block;
	cursor:pointer;
	color:#ffffff !important;
	font-family:Arial;
	font-size:17px;
	padding:0.4em 1em;
	text-decoration:rtl;
	text-shadow:0px 1px 0px #2f6627;


}
.save-draft-btn:hover {
	background-color:#49856c;
}

.save-draft-btn.disabled {
  visibility: hidden;
}

  .not-available {
    display: flex !important;
    justify-content: center !important;
  }

</style> 