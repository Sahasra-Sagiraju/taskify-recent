//=============== ACTUAL DASHBOARD CODE ===============

const todaysTasksContainer = document.querySelector(".Task");
const nextDaysTasksContainer = document.querySelector(".nextDayTasksContainer");
const thisWeeksTasksContainer = document.querySelector(
  ".thisWeeksTasksContainer"
);

const remDays = (currentDay) => 7 - currentDay;
const resetTimeForDates = (startDate, testDate, endDate) => {
  startDate.setHours(0, 0, 0, 0);
  testDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
};

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
  console.log(tasksArray);
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
    todayTasks.forEach((task) => {
      const { taskName, subTask, startDate, customCategory } = task;
      todaysTasksContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="Task-name">
            <div>
              <div class="task-brief">
                <img
                  src="check.png"
                  alt="task icon"
                  style="height: 18px"
                />
                <span>${taskName}</span>
              </div>
              <div class="details">
                <div class="date">
                  <img src="calendar-days.png" alt="calender-icon" />
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
              src="check.png"
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
              src="check.png"
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
