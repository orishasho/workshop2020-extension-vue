<template>
  <div>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <div class="tabRo">
      <ul class="tabsRo">
        <li id="semester1"  class="current"><a href="#">סמסטר א'</a></li>
        <li id="semester2"><a href="#">סמסטר ב'</a></li>
        <li id="semester3"><a href="#">סמסטר קיץ</a></li>
      </ul>
    </div>

    <div class = "scheduleContainerRo">
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
        divItem.setAttribute("class", "courseTableDivRo");
        divItem.setAttribute("ref", "courseTableDivRo");
        divItem.innerHTML = evt.target.innerHTML;
        divItem.courseDetails = course;
        divItem.buttonRef = evt.target;

        this.placeCourseInTable(divItem, course);
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
        this.draftBySemesterMap[this.currentSemester].forEach (courseToPlaceInTable => {
          const fakeCoursePlacementButton = this.generateCoursePlacementButton(courseToPlaceInTable);
          fakeCoursePlacementButton.click();
        });
      },

      generateTableCells() {
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
        divItem.setAttribute("class", "courseDetails")
        divItem.innerHTML = course.course_name + "<br>" + course.teacher + "<br>" + this.classTypeName[course.type] + "<br>" + this.dayName[course.day] + "<br>" + course.start_time + " - " + course.end_time;
        divItem.addEventListener('click', this.createCourseTableItem);
        divItem.courseParam = course;

        return divItem;
      },

      clearSchedule() {
        const currentCoursesInTable = document.querySelectorAll(".courseTableDivRo");
        for (let i = 0; i < currentCoursesInTable.length; i++) {
          currentCoursesInTable[i].parentNode.removeChild(currentCoursesInTable[i]);
        }
      }
    }
  }

</script>



<style lang="scss">



  .scheduleContainerRo  {
    direction: rtl ;
  }

  .scheduleContainerRo  table {
    font-family: arial ;
    width: 100% ;
    border-spacing: 0 ;
    border-collapse: separate ;
    table-layout: fixed ;
    margin-bottom: 50px ;
  }

  .scheduleContainerRo  table td {
    position: relative ;
  }

  .scheduleContainerRo  th {
    text-align: center ;
  }


  .scheduleContainerRo  table thead tr th {
    background: #626e7e ;
    color: #d1d5db ;
    padding: 0.5em ;
    overflow: hidden ;
  }

  .scheduleContainerRo  table thead tr th:first-child {
    border-radius: 3px 0 0 0 ;
  }

  .scheduleContainerRo  table thead tr th:last-child {
    border-radius: 0 3px 0 0 ;
  }

  .scheduleContainerRo  table thead tr th .day {
    display: block ;
    font-size: 1.2em ;
    border-radius: 50% ;
    width: 30px ;
    height: 30px ;
    margin: 0 auto 5px ;
    padding: 5px ;
    line-height: 1.8 ;
    text-align: center ;
  }

  .scheduleContainerRo  table thead tr th .day.active {
    background: #d1d5db ;
    color: #626e7e ;
  }

  .scheduleContainerRo  table thead tr th .short {
    display: none ;
  }

  .scheduleContainerRo  table thead tr th i {
    vertical-align: middle ;
    font-size: 2em ;
  }

  .scheduleContainerRo  table tbody tr {
    background: #d1d5db ;
  }

  .scheduleContainerRo  table tbody tr:nth-child(odd) {
    background: #c8cdd4 ;
  }

  .scheduleContainerRo  .leftcolumn {
    width: 75% ;
  }

  /* Right column */

  .scheduleContainerRo  .rightcolumn {
    float: right ;
    width: 22% ;
    background-color: #f1f1f1 ;
    padding-left: 20px ;
    min-height: 100px ;
    overflow: hidden ;
  }


  .scheduleContainerRo  .show {
    display: block ;
  }

  .scheduleContainerRodrafts-dropdown-container-ro  .show {
    display: block ;
  }

  .scheduleContainerRo  .courseTableDivRo {
    line-height: 150% ;
    position: absolute ;
    z-index: 1 ;
    background: linear-gradient(135deg, #8eeecc, #8ebbee) ;
    text-align: center ;
    border: 1px outset black ;
    width: 99% ;
    font-size: small ;
    font-weight: bold ;
    justify-content: center ;
    display: -webkit-box ;
    display: flex ;
    transition: 0.2s ease box-shadow, 0.2s ease transform ;
  }

  .scheduleContainerRo  .courseTableDivRo:hover {
    box-shadow: 0 20px 30px 0 rgba(142, 188, 238, 0.3) ;
    -webkit-transform: scale(1.05) ;
    transform: scale(1.05) ;
    cursor: default ;
  }

  .scheduleContainerRo  .courseTableDivRo p {
    margin: auto ;
    position: relative ;
    font-size: small ;
    font-weight: bold ;
    vertical-align: middle ;
    margin-left: auto ;
    margin-right: auto ;
    text-align: center ;
  }

  .scheduleContainerRo  table tbody tr td {
    text-align: center ;
    vertical-align: top ;
    border-left: 1px solid #626e7e ;
    position: relative ;
    height: 32px ;
  }

  .scheduleContainerRo  table tbody tr td.hour {
    padding: 0 ;
    color: #626e7e ;
    background: #fff ;
    border-bottom: 1px solid #626e7e ;
    border-right: 1px solid #626e7e ;
    border-collapse: separate ;
    min-width: 100px ;
    cursor: default ;
  }

  .scheduleContainerRo  table tbody tr td.hour span {
    display: block ;
  }

  @media (max-width: 60em) {
    table thead tr th .long {
      display: none ;
    }
    table thead tr th .short {
      display: block ;
    }
    table tbody tr td.hour span {
      transform: rotate(270deg) ;
      -webkit-transform: rotate(270deg) ;
      -moz-transform: rotate(270deg) ;
    }
  }



  @media (max-width: 27em) {
    table thead tr th {
      font-size: 65% ;
    }
    table thead tr th .day {
      display: block ;
      font-size: 1.2em ;
      border-radius: 50% ;
      width: 20px ;
      height: 20px ;
      margin: 0 auto 5px ;
      padding: 5px ;
    }
    table thead tr th .day.active {
      background: #d1d5db ;
      color: #626e7e ;
    }
    table tbody tr td.hour {
      font-size: 1.7em ;
    }
    table tbody tr td.hour span {
      transform: translateY(16px) rotate(270deg) ;
      -webkit-transform: translateY(16px) rotate(270deg) ;
      -moz-transform: translateY(16px) rotate(270deg) ;
    }
  }

  .tabRo {
    margin-bottom: 20px ;
    position: relative ;
    overflow: hidden ;
    background: #fff ;
    font-family: "Arial" ;
    line-height: 1.5 ;
    font-weight: 300 ;
    color: #888 ;
    -webkit-font-smoothing: antialiased ;
    direction: rtl ;
    text-align:center ;

  }

  .tabsRo {
    overflow: hidden ;
    margin: 0 ;
    width: 100% ;
    direction: rtl ;
    display: flex ;
    justify-content: center ;
    align-items: center ;



    li {
      float: left ;
      line-height: 38px ;
      overflow: hidden ;
      padding: 0 ;
      position: relative ;


    }

    a {
      background-color: #eff0f2 ;
      border-bottom: 1px solid #fff ;
      color: #888 ;
      font-weight: 500 ;
      display: block ;
      letter-spacing: 0 ;
      outline: none ;
      padding: 0 20px ;
      text-decoration: none ;
      -webkit-transition: all 0.2s ease-in-out ;
      -moz-transition: all 0.2s ease-in-out ;
      transition: all 0.2s ease-in-out ;
      border-bottom: 2px solid #67b897 ;
    }
  }

  .current a{
    color: #fff ;
    background: #67b897 ;
  }

</style> 