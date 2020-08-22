<template>
  <div>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div class="tab">
        <ul class="tabs">
          <li id="semester1"  class="current"><a href="#">סמסטר א'</a></li>
          <li id="semester2"><a href="#">סמסטר ב'</a></li>
          <li id="semester3"><a href="#">סמסטר קיץ</a></li>
        </ul>
      </div>

    <div class = "scheduleContainer">
    <div>
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
    </div>
  </div>
</template>

<script>
  import CoursesSchedulesLoader from "../loaders/courses-schedules-loader";
  import UserScheduleDraftsLoader from "../loaders/user-schedule-drafts-loader";
  import _ from "lodash";
  export default {
    name: "ScheduleReadOnly",

    data: function () {
      return {
        coursesSchedules: [],
        currentSemester: 1,
        draftBySemesterMap: {1:[], 2:[], 3:[]},

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

    props: ['draft_json'],

    mounted:  function () {
      this.$nextTick(() => {
            this.createClickEventsForSemesterButtons();
            this.generateTableCells();
            this.draftBySemesterMap = JSON.parse(this.draft_json);
            this.loadCurrentSemesterDraft();
          });
    },

    created:  function () {
            // Close the dropdown if the user clicks outside of it
      },


    methods: {
      createCourseTableItem(evt) {
        let course = evt.target.courseParam;
        let courseTitle = course.course_name;
        let courseDay = course.day;
        let courseStartHour = course.start_time.replace(":",".");
        let courseEndHour = course.end_time.replace(":",".");
        let courseTeacher = course.teacher;
        let courseType = course.type;

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
        //divItem.addEventListener('click', this.removeCourseFromTimeTable);

        this.placeCourseInTable(divItem, course);
        //this.remove
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
        this.currentSemester = evt.target.parentNode.id.slice(-1);
        this.clearSchedule();
        this.loadCurrentSemesterDraft();
      },

      loadCurrentSemesterDraft() {
        console.log("in problem");
        console.dir(this.draftBySemesterMap[this.currentSemester]);
        this.draftBySemesterMap[this.currentSemester].forEach (courseToPlaceInTable => {
            const fakeCoursePlacementButton = this.generateCoursePlacementButton(courseToPlaceInTable);
            fakeCoursePlacementButton.click();
        });
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

      clearSchedule() {
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
    direction: rtl !important;
  }

  .scheduleContainer  table {
    font-family: arial !important;
    width: 100% !important;
    border-spacing: 0 !important;
    border-collapse: separate !important;
    table-layout: fixed !important;
    margin-bottom: 50px !important;
  }

  .scheduleContainer  table td {
    position: relative !important;
  }

    .scheduleContainer  th {
    text-align: center !important;
  }

  /*
  table td#child {

  }*/

  .scheduleContainer  table thead tr th {
    background: #626e7e !important;
    color: #d1d5db !important;
    padding: 0.5em !important;
    overflow: hidden !important;
  }

  .scheduleContainer  table thead tr th:first-child {
    border-radius: 3px 0 0 0 !important;
  }

  .scheduleContainer  table thead tr th:last-child {
    border-radius: 0 3px 0 0 !important;
  }

  .scheduleContainer  table thead tr th .day {
    display: block !important;
    font-size: 1.2em !important;
    border-radius: 50% !important;
    width: 30px !important;
    height: 30px !important;
    margin: 0 auto 5px !important;
    padding: 5px !important;
    line-height: 1.8 !important;
    text-align: center !important;
  }

  .scheduleContainer  table thead tr th .day.active {
    background: #d1d5db !important;
    color: #626e7e !important;
  }

  .scheduleContainer  table thead tr th .short {
    display: none !important;
  }

  .scheduleContainer  table thead tr th i {
    vertical-align: middle !important;
    font-size: 2em !important;
  }

  .scheduleContainer  table tbody tr {
    background: #d1d5db !important;
  }

  .scheduleContainer  table tbody tr:nth-child(odd) {
    background: #c8cdd4 !important;
  }

  .scheduleContainer  .leftcolumn {
    //float: left;
    width: 75% !important;
  }

  /* Right column */

  .scheduleContainer  .rightcolumn {
    float: right !important;
    width: 22% !important;
    background-color: #f1f1f1 !important;
    padding-left: 20px !important;
    min-height: 100px !important;
    overflow: hidden !important;
  }

  .scheduleContainer  .card {
    background-color: white !important;
    padding: 20px !important;
    margin-top: 20px !important;
    margin-right: 20px !important;
    margin-bottom: 20px !important;
  }

  .scheduleContainer  .card div {
    padding-bottom: 20px !important;
  }

  .scheduleContainer  .tabbed {
    position: absolute !important;
    left: 150px !important;
  }

  .scheduleContainer  .dropdown {
    /*float: left;*/
    /*overflow: hidden;*/
    height: 10px !important;
  }

  .dropbtn-drafts {
    font-size: 16px !important;
    border: none !important;
    outline: none !important;
    padding: 0.4em 1em !important;
    font-family: Arial, Helvetica, sans-serif !important;
    background: #67b897 !important;
    color: #fff !important;
    font-weight: bold !important;
  }

    .scheduleContainer  .dropbtn{
    font-size: 16px !important;
    border: none !important;
    outline: none !important;
    color: black !important;
    padding: 14px 16px !important;
    font-family: Arial, Helvetica, sans-serif !important;
    margin-right: 20px !important;
    margin-top: 20px !important;
    background: #9bdecb !important;
    color: #fff !important;
    font-weight: bold !important;
  }

  .scheduleContainer  .dropdown-content {
    display: none !important;
    position: absolute !important;
    background-color: #f9f9f9 !important;
    min-width: 160px !important;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2) !important;
    z-index: 1 !important;
    margin-right: 20px !important;
    font-family: Arial !important;
    font-size: smaller !important;
    overflow: auto !important;
    max-height: 50% !important
  }

  .scheduleContainer  .dropdown-content a {
    /*float: none;*/
    color: black !important;
    padding: 12px 16px !important;
    text-decoration: none !important;
    display: block !important;
    text-align: right !important;
  }

  .scheduleContainer  .dropdown-content a:hover {
    background: #f0fffb !important;
  }


  .drafts-dropdown-container  .dropdown-content {
    display: none !important;
    position: absolute !important;
    background-color: #f9f9f9 !important;
    min-width: 160px !important;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2) !important;
    z-index: 1 !important;
    font-family: Arial !important;
    font-size: smaller !important;
    overflow: auto !important;
    max-height: 50% !important;
  }

  .drafts-dropdown-container .dropdown-content a {
    /*float: none;*/
    color: black !important;
    padding: 12px 16px !important;
    text-decoration: none !important;
    display: block !important;
    text-align: right !important;
  }

  .drafts-dropdown-container  .dropdown-content a:hover {
    background: #f0fffb !important;
  }




  .scheduleContainer  .show {
    display: block !important;
  }

  .drafts-dropdown-container  .show {
    display: block !important;
  }

  .scheduleContainer  .courseTableDiv {
    line-height: 150% !important;
    position: absolute !important;
    z-index: 1 !important;
    background: linear-gradient(135deg, #8eeecc, #8ebbee) !important;
    /*height: 94.05px;*/
    /*height: 120px;
      33 * NUMBER*/
    text-align: center !important;
    border: 1px outset black !important;
    /*box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);*/
    /*width: 180px;*/
    width: 99% !important;
    font-size: small !important;
    font-weight: bold !important;
    /*margin-left: auto;
      margin-right: auto;*/
    justify-content: center !important;
    /*margin-right: 15px;
      margin-top: -18px;*/
    /*line-height: 200px;*/
    /*white-space: pre;*/
    display: -webkit-box !important;
    display: flex !important;
    transition: 0.2s ease box-shadow, 0.2s ease transform !important;
  }

  .scheduleContainer  .courseTableDiv:hover {
    box-shadow: 0 20px 30px 0 rgba(142, 188, 238, 0.3) !important;
    -webkit-transform: scale(1.05) !important;
    transform: scale(1.05) !important;
    cursor: default !important;
  }

  .scheduleContainer  .courseTableDiv p {
    margin: auto !important;
    position: relative !important;
    /*top: 30%;*/
    font-size: small !important;
    font-weight: bold !important;
    vertical-align: middle !important;
    margin-left: auto !important;
    margin-right: auto !important;
    text-align: center !important;
  }

  /*
  table tbody tr:nth-child(4n+0) td {
      border-bottom: 1px solid #626E7E;
  }
  */

  .scheduleContainer  table tbody tr td {
    text-align: center !important;
    vertical-align: top !important;
    border-left: 1px solid #626e7e !important;
    position: relative !important;
    height: 32px !important;
  }

  /*
  table tbody tr td:last-child {
      border-right: 1px solid #626E7E;
  }
  */

  .scheduleContainer  table tbody tr td.hour {
    /*font-size: 2em;*/
    padding: 0 !important;
    color: #626e7e !important;
    background: #fff !important;
    border-bottom: 1px solid #626e7e !important;
    border-right: 1px solid #626e7e !important;
    border-collapse: separate !important;
    min-width: 100px !important;
    cursor: default !important;
  }

  .scheduleContainer  table tbody tr td.hour span {
    display: block !important;
  }

  .scheduleContainer  .courseDetails {
	  box-shadow:inset 0px 1px 0px 0px #91b8b3 !important;
	  background:linear-gradient(to bottom, #85b8aa 5%, #6c7c7c 100%) !important;
	  background-color:#85b8aa !important;
	  border-radius:6px !important;
	  border:1px solid #566963 !important;
	  display:inline-block !important;
	  color:#ffffff !important;
	  font-family:Arial !important;
	  font-size:15px !important;
	  font-weight:bold !important;
	  padding:6px 24px !important;
	  text-decoration:none !important;
	  text-shadow:0px 1px 0px #2b665e !important;
    margin-bottom: 10px !important;
    line-height: 100% !important;
  }

  .scheduleContainer  .courseDetails:hover {
	  background:linear-gradient(to bottom, #6c7c7c 5%, #85b8aa 100%) !important;
	  background-color:#6c7c7c !important;
  }

  .scheduleContainer  .courseDetails:active {
    position: relative !important;
    top: 1px !important;
  }

  .scheduleContainer  .courseDetailsContainer {
    border-radius: 10px 10px 10px 10px !important;
    -moz-border-radius: 10px 10px 10px 10px !important;
    -webkit-border-radius: 10px 10px 10px 10px !important;
    border: 1px solid #000000 !important;
    font-family: Arial, Helvetica, sans-serif !important;
    /*padding-bottom: 20px;*/
    padding-right: 5px !important;
    margin-bottom: 10px !important;
  }

  .scheduleContainer  .courseDetailsContainer h1 {
    text-align: right !important;
    margin-top: -10px !important;
    height: 20px !important;
    line-height: 20px !important;
    font-size: 12px !important;
  }

  .scheduleContainer  .courseDetailsContainer h1 span {
    background-color: white !important;
  }

  

  @media (max-width: 60em) {
    table thead tr th .long {
      display: none !important;
    }
    table thead tr th .short {
      display: block !important;
    }
    table tbody tr td.hour span {
      transform: rotate(270deg) !important;
      -webkit-transform: rotate(270deg) !important;
      -moz-transform: rotate(270deg) !important;
    }
  }
  
  

    @media (max-width: 27em) {
    table thead tr th {
      font-size: 65% !important;
    }
    table thead tr th .day {
      display: block !important;
      font-size: 1.2em !important;
      border-radius: 50% !important;
      width: 20px !important;
      height: 20px !important;
      margin: 0 auto 5px !important;
      padding: 5px !important;
    }
    table thead tr th .day.active {
      background: #d1d5db !important;
      color: #626e7e !important;
    }
    table tbody tr td.hour {
      font-size: 1.7em !important;
    }
    table tbody tr td.hour span {
      transform: translateY(16px) rotate(270deg) !important;
      -webkit-transform: translateY(16px) rotate(270deg) !important;
      -moz-transform: translateY(16px) rotate(270deg) !important;
    }
  }

  .tab {
	margin-bottom: 20px !important;
	position: relative !important;
	overflow: hidden !important;
	background: #fff !important;
	font-family: "Arial" !important;
	line-height: 1.5 !important;
	font-weight: 300 !important;
	color: #888 !important;
	-webkit-font-smoothing: antialiased !important;
  direction: rtl !important;
    text-align:center !important;/* Add This*/
    
}

.tabs {
	/*display: table;
	position: relative;*/
	overflow: hidden !important;
	margin: 0 !important;
	width: 100% !important;
  direction: rtl !important;
    display: flex !important;
  justify-content: center !important;
  align-items: center !important;


	li {
		float: left !important;
		line-height: 38px !important;
		overflow: hidden !important;
		padding: 0 !important;
		position: relative !important;


	}

	a {
		background-color: #eff0f2 !important;
		border-bottom: 1px solid #fff !important;
		color: #888 !important;
		font-weight: 500 !important;
		display: block !important;
		letter-spacing: 0 !important;
		outline: none !important;
		padding: 0 20px !important;
		text-decoration: none !important;
		-webkit-transition: all 0.2s ease-in-out !important;
		-moz-transition: all 0.2s ease-in-out !important;
		transition: all 0.2s ease-in-out !important;
		border-bottom: 2px solid #67b897 !important;
	}
}

.current a{
	color: #fff !important;
	background: #67b897 !important;
}

.tabs-drafts-container {
  display: flex !important;
  flex-direction: row !important;
}

.reset-layout-btn-cls {
  background-color:gray !important;
	border-radius:28px !important;
	display:inline-block !important;
	color:#ffffff !important;
	font-family:Arial !important;
	font-size:17px !important;
	padding:0.4em 1em !important;
	text-decoration: rtl !important;
}

.reset-layout-btn-cls:hover {
  background-color:#696969 !important;
	border-radius:28px !important;
	display:inline-block !important;
	color:#ffffff !important;
	font-family:Arial !important;
	font-size:17px !important;
	padding:0.4em 1em !important;
	text-decoration:rtl !important;
}

.save-draft-btn {
	background-color:#67b897 !important;
	border-radius:28px !important;
	display:inline-block !important;
	color:#ffffff !important;
	font-family:Arial !important;
	font-size:17px !important;
	padding:0.4em 1em !important;
	text-decoration:rtl !important;
	text-shadow:0px 1px 0px #2f6627 !important;


}
.save-draft-btn:hover {
	background-color:#49856c !important;
}

.save-draft-btn.disabled {
  visibility: hidden !important;
}

</style> 