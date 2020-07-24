<template>
  <MountingPortal mountTo="#main-content-container-id" name="source" append>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
  </MountingPortal>
</template>

<script>
  import { MountingPortal} from "portal-vue";
  export default {
    name: "Schedule",
    components: {
      MountingPortal
    },

    data: function () {
      return {
        dayName: {
          1: "יום א'",
          2: "יום ב'",
          3: "יום ג'",
          4: "יום ד'",
          5: "יום ה'",
          6: "יום ו'"
        },
        course: {
          "course_name": "מבוא למדעי המחשב",
          "course_day": "1",
          "start_time": "10.00",
          "end_time": "11.30"
        },
        //generateCourseDiv(course);

        course2: {
          "course_name": "מערכות הפעלה",
          "course_day": "3",
          "start_time": "14.30",
          "end_time": "17.45"
        },

        course3: {
          "course_name": "מבני נתונים",
          "course_day": "4",
          "start_time": "11.05",
          "end_time": "13.00"
        },

        course4: {
          "course_name": "למידה מבוססת חידות",
          "course_day": "3",
          "start_time": "12.15",
          "end_time": "14.29"
        },
        course5: {
          "course_name": "הנדסת תוכנה מכוונת עצמים",
          "course_day": "5",
          "start_time": "8.30",
          "end_time": "11.00"
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
            this.generateTableCells();

            let coursesList = [this.course, this.course2, this.course3, this.course4, this.course5];
            coursesList.forEach((course) => {
              this.addCourseToDropdown(course); 
            });
          });
    },

    created:  function () {

          
            

            // Close the dropdown if the user clicks outside of it
            window.onclick = function (e) {
              if (!e.target.matches('.dropbtn')) {
                let myDropdown = document.getElementById("myDropdown");
                if (myDropdown.classList.contains('show')) {
                  myDropdown.classList.remove('show');
                }
              }
            }
    

      },


    methods: {
      createCourseTableItem(evt) {
        let course = evt.target.courseParam;
        let courseTitle = course.course_name;
        let courseDay = course.course_day;
        let courseStartHour = course.start_time;
        let courseEndHour = course.end_time;

        if (this.isCourseOverlap(course)) {
          //alert("courses overlap");
          return;
        } else {
          const startHourParts = (courseStartHour + "").split(".");
          let startHourD = new Date(2018, 4, courseDay, startHourParts[0], startHourParts[1]);
          const endHourParts = (courseEndHour + "").split(".");
          let endHourD = new Date(2018, 4, courseDay, endHourParts[0], endHourParts[1]);
          const millisecondsDur = Math.abs(endHourD - startHourD);
          const hoursDur = millisecondsDur / 36e5;

          let divItem = document.createElement("div");
          let tdHeight = (document.getElementsByTagName("td")[0]).clientHeight;
          //console.log(document.getElementsByTagName("td")[0]);
          //divItem.setAttribute("height", 33 * hoursDur);
          divItem.style.height = (tdHeight * hoursDur * 2) + "px";

          let divTopRatio = startHourParts[1];
          if (startHourParts[1] >= 30) {
            divTopRatio -= 30;
          }
          divItem.style.top = ((divTopRatio / 30) * 100) + "%";
          console.log(divItem.style.top);
          divItem.setAttribute("class", "courseTableDiv");
          divItem.setAttribute("ref", "courseTableDiv");
          //let pItem = document.createElement("p");
          divItem.innerHTML = courseTitle + "<br>" + this.dayName[courseDay] + "<br>" + courseStartHour + " - " + courseEndHour;
          //divItem.appendChild(pItem);
          //console.log(divItem);
          divItem.courseDetails = course;
          divItem.buttonRef = evt.target;
          divItem.addEventListener('click', this.removeCourseFromTimeTable);
          this.placeCourseInTable(divItem, course);
          //evt.target.style.visibility = "hidden";
          evt.target.parentNode.removeChild(evt.target);
        }
      },

      removeCourseFromTimeTable(evt) {
        ////////////
        console.log("we are hereeee");
        console.log(evt.target.courseDetails); ///

        //evt.target.buttonRef.style.visibility = "visible";
        //NEED TO CHANGE TO COURSE GROUP ID OR SOMETHING LIKE THAT
        let coursePlacementContainer = document.getElementById("coursePlacementContainer_" + evt.target.courseDetails.course_name);
        if (coursePlacementContainer) {
          coursePlacementContainer.appendChild(this.generateCoursePlacementButton(evt.target.courseDetails));
        }
        evt.target.parentNode.removeChild(evt.target);
      },

      placeCourseInTable(divItem, course) {
        let courseDay = course.course_day;
        let courseTimesSplit = (course.start_time).split(".");
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
          //console.log(currCellId);
          if ((currCellId[0] === courseDay) && (currCellId[1] === courseStartH) && (currCellId[2] === courseStartM)) {
            cells[i].appendChild(divItem);
            break;
          }
        }
      },

      bluabluafunc() {
        console.log("jjj");
      },


      isCourseOverlap(courseToCheck) {
        const courseDay = courseToCheck.course_day;
        const courseStartHour = courseToCheck.start_time;
        const courseEndHour = courseToCheck.end_time;

        const startHourParts = (courseStartHour + "").split(".");
        let startHourDtInput = new Date(2018, 4, courseDay, startHourParts[0], startHourParts[1]);
        const endHourParts = (courseEndHour + "").split(".");
        let endHourDtInput = new Date(2018, 4, courseDay, endHourParts[0], endHourParts[1]);

        let currentCoursesInTable = document.getElementsByClassName("courseTableDiv");
        for (let i = 0; i < currentCoursesInTable.length; i++) {
          let courseInTable = currentCoursesInTable[i];
          if (courseInTable.courseDetails.course_day === courseDay) {

            let startHourPartsCurrentCourseInTable = (courseInTable.courseDetails.start_time + "").split(".");
            let startHourDtCourseInTable = new Date(2018, 4, courseDay, startHourPartsCurrentCourseInTable[0], startHourPartsCurrentCourseInTable[1]);
            let endHourPartsCurrentCourseInTable = (courseInTable.courseDetails.end_time + "").split(".");
            let endHourDtCourseInTable = new Date(2018, 4, courseDay, endHourPartsCurrentCourseInTable[0], endHourPartsCurrentCourseInTable[1]);

            //1 in table, 2 input

            if ((startHourDtCourseInTable <= endHourDtInput) && (startHourDtInput <= endHourDtCourseInTable)) {
              alert("לא ניתן לשבץ במערכת השעות \n הקורס מתנגש עם הקורס המשובץ: " + courseInTable.courseDetails.course_name);
              return true;
            }

          }
        }
        return false;
      },

      generateTableCells() {
        console.log("in func");
        /////////const body = document.getElementsByTagName("tbody")[0];
        const body = this.$refs.mytbody;
        console.log(this.$refs);
        console.log(body);
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

      generateCoursePlacementButton(course) {
        let divItem = document.createElement("button");
        /*divItem.style.backgroundColor = 'yellow';
        divItem.style.display = 'inline-block';*/
        divItem.setAttribute("class", "courseDetails")
        divItem.innerHTML = course.course_name + "<br>" + this.dayName[course.course_day] + "<br>" + course.start_time + " - " + course.end_time;
        //divItem.onclick = createCourseTableItem(course.course_name, course.course_day, course.start_time, course.end_time);
        divItem.addEventListener('click', this.createCourseTableItem);
        divItem.courseParam = course;

        return divItem;
      },

      generateCourseDiv(course) {
        let divItem = this.generateCoursePlacementButton(course);

        let place = document.getElementById("courses-details");

        let coursesGroupsDiv = document.createElement("div");
        coursesGroupsDiv.setAttribute("class", "courseDetailsContainer");
        coursesGroupsDiv.id = "coursePlacementContainer_" + course.course_name; //to be changed to group id or something like that
        coursesGroupsDiv.innerHTML = "<h1><span>" + course.course_name + "</span></h1>";

        if (this.isCourseAlreadyInTable(course)) {
          divItem.style.visibility = "hidden";
        }


        if (!this.isCourseAlreadyInTable(course)) {
          coursesGroupsDiv.appendChild(divItem);

        }
        place.appendChild(coursesGroupsDiv);

        /*
        let containerDiv = document.createElement("div");
        containerDiv.appendChild(divItem);
        place.appendChild(containerDiv);
        */

        /*
            document.body.appendChild(divItem);

            document.body.appendChild(document.createElement("br"));
            document.body.appendChild(document.createElement("br"));*/

        //parent.prepend(newChild);

      },

      isCourseAlreadyInTable(course) {
        console.log("in isCourseAlreadyInTable");
        let currentCoursesInTable = document.getElementsByClassName("courseTableDiv");
        //let currentCoursesInTable = this.$refs.courseTableDiv;
        console.log(currentCoursesInTable);

        for (let i = 0; i < currentCoursesInTable.length; i++) {
          let courseInTable = currentCoursesInTable[i];
          console.log(courseInTable);
          if (course.course_name == courseInTable.courseDetails.course_name) { //need to change to group id or something like that
            console.log("does supposed to be here");
            return true;
          }
        }
        return false;
      },

      addCourseToDropdown(course) {
        console.log("inside adding to dd");
        const dropdown = document.getElementById('myDropdown');
        console.log(dropdown);
        let newCourseInDropdown = document.createElement("a");
        newCourseInDropdown.setAttribute("href", "#");
        newCourseInDropdown.innerText = course.course_name;
        newCourseInDropdown.course = course;
        newCourseInDropdown.addEventListener("click", this.courseDropDownOnClick);
        dropdown.appendChild(newCourseInDropdown);
      },

      courseDropDownOnClick(evt) {
        const dropdownBtn = document.getElementById("coursesDropdownBtn");
        console.log(evt.target);
        dropdownBtn.innerHTML = evt.target.innerText + "&emsp;" + "<i class=\"fa fa-caret-down\"></i>";
        document.getElementById("courses-details").style.visibility = "visible";
        document.getElementById("courses-details").innerHTML = "";
        this.generateCourseDiv(evt.target.course);
        //add code that shows the courses details here
      },

      myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
      }
    }
  }

</script>



<style>
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

  .scheduleContainer  .dropbtn {
    cursor: pointer;
    font-size: 16px;
    border: none;
    outline: none;
    color: black;
    padding: 14px 16px;
    font-family: Arial, Helvetica, sans-serif;
    margin-right: 20px;
    margin-top: 20px;
    background: #9bc7de;
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
    background: #e6f6ff;
  }

  .scheduleContainer  .show {
    display: block;
  }

  .scheduleContainer  .courseTableDiv {
    position: absolute;
    z-index: 1;
    background: linear-gradient(135deg, #8ebcee, #a08eee);
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
    box-shadow: inset 0px 1px 0px 0px #bbdaf7;
    background: linear-gradient(to bottom, #79bbff 5%, #378de5 100%);
    background-color: #79bbff;
    border-radius: 6px;
    border: 1px solid #84bbf3;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 15px;
    font-weight: bold;
    font-size: smaller;
    padding: 6px 24px;
    text-decoration: none;
    text-shadow: 0px 1px 0px #528ecc;
  }

  .scheduleContainer  .courseDetails:hover {
    background: linear-gradient(to bottom, #378de5 5%, #79bbff 100%);
    background-color: #378de5;
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
</style> 