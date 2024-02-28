import Chart from "chart.js/auto";

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
  console.log(`todayTasks: ${todayTasks}`);

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
    todayTasks.forEach((task, index) => {
      const { taskName, subTask, startDate, customCategory } = task;
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
              <span class="progress-details">0% Completed</span>
              <input class="progress-bar" type="range" value="0" min="0" max="100" step="1" />
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

const getProgressTillDate = (task) => {
  const totalProgress = 0;
  let count = 0;
  for (const key in Object.keys(task.progressEachDay)) {
    const date = new Date(key);
    const today = new Date();
    if (date <= today && task.progressEachDay[date] > 0) {
      totalProgress += task.progressEachDay[date];
      ++count;
    }
  }

  const possibleProgress = count * 100;
  const totalProgressPercentage = (totalProgress / possibleProgress) * 100;
  return totalProgressPercentage;
};

const renderDetailsCard = (sNo, task) => {
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
    progress,
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
        <span class="details-box__streak-value">${Math.floor(
          Math.random() * 50
        )} days</span>
      </span>

      <!-- progress -->
      <div class="details-box__progress">
        <span class="details-box__property">Progress:</span>
        <div class="details-box__progress-circle">
          <span class="details-box__progress-value">${getProgressTillDate(
            task
          )}%</span>
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
          <span class="details-box__property-value details-tag details-tag-low">
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
};

const func = (event) => {
  if (event.target.classList.contains("details-btn")) {
    // renderDetailsPage(task);

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
        console.log(task);
        renderDetailsCard(sNo, task);
        break;
      }
      case "nextDayTasksContainer": {
        const sNo = +classNames[1].slice(14);
        const index = sNo - 1;
        const task = nextDayTasks[index];
        renderDetailsCard(sNo, task);
        break;
      }
      case "thisWeeksTasksContainer": {
        const sNo = +classNames[1].slice(15);
        const index = sNo - 1;
        const task = thisWeekTasks[index];
        renderDetailsCard(sNo, task);
        break;
      }
      default:
        console.log("something wrong happened");
    }
  }
};

dashboardBox.addEventListener("click", func);

const constructGraph = async () => {
  const data = [
    { date: "2024-2-10", progress: 10 },
    { date: "2024-2-11", progress: 60 },
    { date: "2024-2-12", progress: 90 },
    { date: "2024-2-13", progress: 40 },
    { date: "2024-2-14", progress: 30 },
  ];

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

constructGraph();

const progressBarInput = document.querySelector(".progress-bar");
progressBarInput.addEventListener("change", (event) => {
  document.querySelector(
    ".progress-details"
  ).textContent = `${event.target.value}% Completed`;

  const tasksArray = JSON.parse(localStorage.getItem("tasks"));
  const [todayTasks] = groupTasks(tasksArray);
});
