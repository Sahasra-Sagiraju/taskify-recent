import Chart from "chart.js/auto";
import moment from "moment";

const lodash = require("lodash");

//=============== ACTUAL DASHBOARD CODE ===============

const todaysTasksContainer = document.querySelector(".Task");
const nextDaysTasksContainer = document.querySelector(".nextDayTasksContainer");
const thisWeeksTasksContainer = document.querySelector(
  ".thisWeeksTasksContainer"
);
const dashboardBox = document.querySelector(".dashboard-box");
const detailsBox = document.querySelector(".details-box");

// Helper functions
const remDays = (currentDay) => 7 - currentDay;
const resetTimeForDates = (startDate, testDate, endDate) => {
  startDate.setHours(0, 0, 0, 0);
  testDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
};

// Main code
const groupTasks = (tasksArray) => {
  const todayTasks = tasksArray.filter((task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const currentDate = new Date();
    resetTimeForDates(startDate, currentDate, endDate);

    return startDate <= currentDate && currentDate <= endDate;
  });

  const nextDayTasks = tasksArray.filter((task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    resetTimeForDates(startDate, tomorrowDate, endDate);

    return startDate <= tomorrowDate && tomorrowDate <= endDate;
  });

  const thisWeekTasks = tasksArray.filter((task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const thisWeekCurrentDate = new Date();
    const thisWeekEndDate = new Date();
    thisWeekEndDate.setDate(
      thisWeekEndDate.getDate() + remDays(thisWeekEndDate.getDay()) - 1
    );

    resetTimeForDates(startDate, thisWeekCurrentDate, endDate);
    resetTimeForDates(startDate, thisWeekEndDate, endDate);

    while (thisWeekCurrentDate <= thisWeekEndDate) {
      if (startDate <= thisWeekCurrentDate && thisWeekCurrentDate <= endDate) {
        return true;
      }
      thisWeekCurrentDate.setDate(thisWeekCurrentDate.getDate() + 1);
    }

    return false;
  });

  return [todayTasks, nextDayTasks, thisWeekTasks];
};

const updateDashboard = () => {
  const tasksArray = JSON.parse(localStorage.getItem("tasks"));
  const [todayTasks, nextDayTasks, thisWeekTasks] = groupTasks(tasksArray);

  todaysTasksContainer.innerHTML = "";
  nextDaysTasksContainer.innerHTML = "";
  thisWeeksTasksContainer.innerHTML = "";

  if (todayTasks.length === 0) {
    todaysTasksContainer.insertAdjacentHTML(
      "beforeend",
      "<h2>No Tasks Available for today</h2>"
    );
  } else {
    const temp = 0;
    const today = moment().format("DD/MM/YYYY");
    todayTasks.forEach((task, index) => {
      const { taskName, subTask, startDate, customCategory, progressEachDay } =
        task;
      const initialProgress =
        progressEachDay[today] === null ? 0 : progressEachDay[today];
      todaysTasksContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="Task-name ${"today-task-" + (index + 1)}">
            <div>
              <div class="task-brief">
                <i class='bx bx-check' style='color:#39bc71; font-size: 25px;'></i>
                <span>${taskName}</span>
              </div>
              <div class="details">
                <div class="date">
                <i class='bx bx-calendar' style='color:#118d98; font-size: 25px;'></i>
                  <span>${startDate}</span>
                </div>
                <span>${subTask}</span>
                <span>${customCategory}</span>
              </div>
            </div>
            <div class="progress-container">
              <span class="progress-details">${initialProgress}% Completed</span>
              <input class="progress-bar" type="range" value="${initialProgress}" min="0" max="100" step="1" />
            </div>
            <button class="details-btn" type="button">Details</button>
          </div>`
      );
    });
  }

  if (nextDayTasks.length === 0) {
    nextDaysTasksContainer.insertAdjacentHTML(
      "beforeend",
      "<h2>No Tasks Available for tomorrow</h2>"
    );
  } else {
    nextDayTasks.forEach((task, index) => {
      const { taskName } = task;
      nextDaysTasksContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="Task-name ${"next-day-task-" + (index + 1)}">
        <div>
          <div class="task-brief">
          <i class='bx bx-check' style='color:#39bc71; font-size: 25px;'></i>
            <span>${taskName}</span>
          </div>
        </div>

        <button class="details-btn" type="button">Details</button>
      </div>`
      );
    });
  }
  if (thisWeekTasks.length === 0) {
    thisWeeksTasksContainer.insertAdjacentHTML(
      "beforeend",
      "<h2>No Tasks Available for this week</h2>"
    );
  } else {
    thisWeekTasks.forEach((task, index) => {
      const { taskName } = task;
      thisWeeksTasksContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="Task-name ${"this-week-task-" + (index + 1)}">
        <div>
          <div class="task-brief">
          <i class='bx bx-check' style='color:#39bc71; font-size: 25px;'></i>
            <span>${taskName}</span>
          </div>
        </div>

        <button class="details-btn" type="button">Details</button>
      </div>`
      );
    });
  }
};

updateDashboard();

// details button click functionality

const getStreak = (task) => {
  const today = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
  const sortedTaskDates = Object.keys(task.progressEachDay).sort(
    (date1, date2) => {
      const dateA = moment(date1, "DD/MM/YYYY");
      const dateB = moment(date2, "DD/MM/YYYY");
      return dateA.diff(dateB);
    }
  );

  // find the date this task was last performed on except today
  let index = 0;
  while (
    index < sortedTaskDates.length &&
    moment(sortedTaskDates[index], "DD/MM/YYYY").isBefore(today)
  ) {
    ++index;
  }

  --index;

  // count the streak
  let count = 0;
  while (index >= 0 && task.progressEachDay[sortedTaskDates[index]] > 0) {
    ++count;
    --index;
  }

  return count;
};

const getProgressTillDate = (task) => {
  let totalProgress = 0;
  let count = 0;
  for (const key in task.progressEachDay) {
    const date = moment(key, "DD/MM/YYYY");
    const today = moment();
    if (date.isSameOrBefore(today)) {
      ++count;
    }
    if (date.isSameOrBefore(today) && task.progressEachDay[date._i] > 0) {
      totalProgress += Number(task.progressEachDay[date._i]);
    }
  }

  const possibleProgress = count * 100;
  const totalProgressPercentage = (totalProgress / possibleProgress) * 100;
  return totalProgressPercentage;
};

const renderDetailsCard = (sNo, task) => {
  const progress = getProgressTillDate(task);
  const conicGradientDegree = (360 / 100) * progress;
  const streak = getStreak(task);
  const {
    taskName,
    taskDesc,
    subTask,
    startDate,
    endDate,
    customCategory,
    priority,
    recurringPeriod,
    duration,
    progressEachDay,
  } = task;

  detailsBox.innerHTML = "";
  detailsBox.insertAdjacentHTML(
    "beforeend",
    `
    <!-- Header part -->
    <div class="details-box__header">
      <i
        class="bx bx-arrow-back details-box__back-btn"
        style="color: #fffefe"
      ></i>
      <div class="details-box__header-inner-container">
        <i class="bx bxs-edit" style="color: #fffefe"></i>
        <i class="bx bxs-trash-alt" style="color: #fffefe"></i>
      </div>
    </div>

    <!-- main data part -->
    <div class="details-box__main">
      <!-- S.no, name and description-->
      <div class="details-box__heading-outer-container">
        <span class="task-no">${sNo}</span>
        <div class="details-box__heading-inner-container">
          <span class="details-box__task-name">${taskName}</span>
          <span class="details-box__task-description"
            >${taskDesc}</span
          >
        </div>
      </div>
      <!-- Category -->
      <span class="details-box__category">${customCategory}</span>
      <!-- start date -->
      <div class="details-box__start-date">
        <i class="bx bxs-calendar" style="color: #fffefe"></i>
        <span>Start date: ${startDate}</span>
      </div>
      <!-- end date -->
      <div class="details-box__end-date">
        <i class="bx bxs-calendar" style="color: #fffefe"></i>
        <span>End date: ${endDate}</span>
      </div>

      <!-- streak -->
      <span class="details-box__streak">
        <span class="details-box__property">Streak:</span>
        <span class="details-box__streak-value">${streak} ${
      streak === 1 ? "day" : "days"
    }</span>
      </span>

      <!-- progress -->
      <div class="details-box__progress">
        <span class="details-box__property">Progress:</span>
        <div class="details-box__progress-circle" style="  background: conic-gradient(#45a2a9 ${conicGradientDegree}deg, #bcccbf ${conicGradientDegree}deg 360deg);
        ">
          <span class="details-box__progress-value">${progress}%</span>
        </div>
      </div>

      <!-- Tag details -->
      <div class="details-box__tags-table">
        <div class="details-box__tags-table-item">
          <span class="details-box__property">Duration:</span>
          <span class="details-box__property-value details-tag">
            ${recurringPeriod}
          </span>
        </div>
        <div class="details-box__tags-table-item">
          <span class="details-box__property">Recurring:</span>
          <span class="details-box__property-value details-tag">${priority}</span>
        </div>
        <div class="details-box__tags-table-item">
          <span class="details-box__property">Priority:</span>
          <span class="details-box__property-value details-tag details-tag-${duration.toLowerCase()}">
              ${duration}
          </span>
        </div>
        <div class="details-box__tags-table-item">
          <span class="details-box__property">Missed:</span>
          <span class="details-box__property-value details-tag">0</span>
        </div>
      </div>

      <!-- Subtasks -->
      <div class="details-box__subtasks-table">
        <span class="details-box__property">Subtasks:</span>
        <div class="details-box__subtasks-table-items">
          <div class="details-box__subtasks-table-item">
            <i class="bx bx-check-square" style="color: #0e8c87"></i>
            <span class="subtask-item">
              ${subTask}
            </span>
          </div>
        </div>
      </div>

      <!-- Graph -->
      <div class="graph">
        <canvas id="progress-by-day"></canvas>
      </div>
    </div>
  </div>
    `
  );

  const backBtn = document.querySelector(".details-box__back-btn");

  backBtn.addEventListener("click", () => {
    detailsBox.setAttribute("hidden", true);
    dashboardBox.removeAttribute("hidden");
  });

  const deleteBtn = document.querySelector(".bxs-trash-alt");
  deleteBtn.addEventListener("click", () => {
    backBtn.click();
    const tasksArray = JSON.parse(localStorage.getItem("tasks"));
    const newTasksArray = tasksArray.filter(
      (ele) => !lodash.isEqual(ele, task)
    );
    localStorage.setItem("tasks", JSON.stringify(newTasksArray));
    updateDashboard();
  });
};

const constructGraph = async (task) => {
  const data = Object.keys(task.progressEachDay)
    .map((date) => ({
      date,
      progress:
        task.progressEachDay[date] === null ? 0 : task.progressEachDay[date],
    }))
    .filter((obj) =>
      moment(obj.date).isSameOrBefore(moment().format("DD/MM/YYYY"))
    )
    .sort((obj1, obj2) => {
      const dateA = moment(obj1.date, "DD/MM/YYYY");
      const dateB = moment(obj2.date, "DD/MM/YYYY");
      return dateA.diff(dateB);
    });

  new Chart(document.getElementById("progress-by-day"), {
    type: "line",
    options: {
      animation: false,
      plugins: {
        legend: {
          display: true,
          onClick: null,
        },
      },
    },
    data: {
      labels: data.map((row) => row.date),
      datasets: [
        {
          label: "Progress each day",
          data: data.map((row) => row.progress),
        },
      ],
    },
  });
};

dashboardBox.addEventListener("click", (event) => {
  if (event.target.classList.contains("details-btn")) {
    dashboardBox.setAttribute("hidden", true);
    detailsBox.removeAttribute("hidden");

    const tasksArray = JSON.parse(localStorage.getItem("tasks"));
    const [todayTasks, nextDayTasks, thisWeekTasks] = groupTasks(tasksArray);

    const classNames = event.target.parentElement.classList;
    const taskType = event.target.parentElement.parentElement.classList[0];

    switch (taskType) {
      case "Task": {
        const sNo = +classNames[1].slice(11);
        const index = sNo - 1;
        const task = todayTasks[index];
        renderDetailsCard(sNo, task);
        constructGraph(task);
        break;
      }
      case "nextDayTasksContainer": {
        const sNo = +classNames[1].slice(14);
        const index = sNo - 1;
        const task = nextDayTasks[index];
        renderDetailsCard(sNo, task);
        constructGraph(task);
        break;
      }
      case "thisWeeksTasksContainer": {
        const sNo = +classNames[1].slice(15);
        const index = sNo - 1;
        const task = thisWeekTasks[index];
        renderDetailsCard(sNo, task);
        constructGraph(task);
        break;
      }
      default:
        console.log("something wrong happened");
    }
  }
});

document.querySelector(".TodaysTasks").addEventListener("change", (event) => {
  const taskIndex =
    event.target.parentElement.parentElement.classList[1].slice(11) - 1;
  const tasksArray = JSON.parse(localStorage.getItem("tasks"));
  const [todayTasks, nextDayTasks, thisWeekTasks] = groupTasks(tasksArray);
  const taskToBeChanged = todayTasks[taskIndex];
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  taskToBeChanged.progressEachDay[formattedDate] = event.target.value;
  tasksArray.forEach((task) => {
    if (lodash.isEqual(task, taskToBeChanged)) {
      task.progressEachDay[formattedDate] = event.target.value;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
  event.target.previousElementSibling.textContent = `${event.target.value}% Completed`;
});
