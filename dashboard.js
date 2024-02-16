const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

const savedMode = localStorage.getItem("mode");
if (savedMode) {
  body.classList.add(savedMode);
  if (savedMode === "dark") {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
}

sidebar.classList.remove("close");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  const currentMode = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("mode", currentMode);
  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});

function myFunction(x) {
  x.classList.toggle("change");
}

console.log("testing");

//=============== ACTUAL DASHBOARD CODE ===============

const todaysTasksContainer = document.querySelector(".Task");
const nextDaysTasksContainer = document.querySelector(".nextDayTasksContainer");
const thisWeeksTasksContainer = document.querySelector(
  ".thisWeeksTasksContainer"
);
console.log(thisWeeksTasksContainer);
// startDate
// :
// "2024-02-09"
const isInRange = (a, b, c) => {
  return a <= b && b <= c;
};
const tasksArray = JSON.parse(localStorage.getItem("tasks"));

const groupTasks = (tasksArray) => {
  const currentDate = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const todayTasks = tasksArray.filter((task) => {
    const startDate = new Date(task.startDate);
    // const startDay = startDate.getDate();
    // const startMonth = startDate.getMonth() + 1;
    // const startYear = startDate.getFullYear();

    const endDate = new Date(task.endDate);
    // const endDay = endDate.getDate();
    // const endMonth = endDate.getMonth() + 1;
    // const endYear = endDate.getFullYear();

    // return (
    //   isInRange(startDay, currentDate, endDay) &&
    //   isInRange(startMonth, currentMonth, endMonth) &&
    //   isInRange(startYear, currentYear, endYear)
    // );
    return startDate <= currentDate && currentDate <= endDate;
  });
  const nextDayTasks = tasksArray.filter((task) => {
    const startDate = new Date(task.startDate);
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth() + 1;
    const startYear = startDate.getFullYear();

    const endDate = new Date(task.endDate);
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endYear = endDate.getFullYear();

    return (
      isInRange(startDay, currentDate + 1, endDay) &&
      isInRange(startMonth, currentMonth, endMonth) &&
      isInRange(startYear, currentYear, endYear)
    );
  });
  const thisWeekTasks = tasksArray.filter((task) => {
    const startDate = new Date(task.startDate);
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth() + 1;
    const startYear = startDate.getFullYear();

    const endDate = new Date(task.endDate);
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endYear = endDate.getFullYear();

    return (
      isInRange(startDay, currentDate + 7, endDay) &&
      isInRange(startMonth, currentMonth, endMonth) &&
      isInRange(startYear, currentYear, endYear)
    );
  });

  return [todayTasks, nextDayTasks, thisWeekTasks];
};

groupTasks(tasksArray);

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
    todayTasks.forEach((task) => {
      const {
        taskName,
        taskDesc,
        subTask,
        startDate,
        recurringPeriod,
        priority,
        endDate,
        duration,
        customCategory,
      } = task;
      todaysTasksContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="Task">
          <div class="Task-name">
            <div>
              <div class="task-brief">
                <img
                  src="images/check.png"
                  alt="task icon"
                  style="height: 18px"
                />
                <span>${taskName}</span>
              </div>
              <div class="details">
                <div class="date">
                  <img src="images/calendar-days.png" alt="calender-icon" />
                  <span>${startDate}</span>
                </div>
                <span>${subTask}</span>
                <span>${customCategory}</span>
              </div>
            </div>
            <div class="progress-container">
              <span class="progress-details"> 25% Completed </span>
              <progress class="progress-bar" value="25" max="100"></progress>
            </div>
            <button class="details-btn" type="button">Details</button>
          </div>
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
    nextDayTasks.forEach((task) => {
      const { taskName } = task;
      nextDaysTasksContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="Task-name">
        <div>
          <div class="task-brief">
            <img
              src="images/check.png"
              alt="task icon"
              style="height: 18px"
            />
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
    thisWeekTasks.forEach((task) => {
      const { taskName } = task;
      thisWeeksTasksContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="Task-name">
        <div>
          <div class="task-brief">
            <img
              src="images/check.png"
              alt="task icon"
              style="height: 18px"
            />
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
