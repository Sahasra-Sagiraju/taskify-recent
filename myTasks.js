"use strict";

const tasks = JSON.parse(localStorage.getItem("tasks"));
console.log(tasks);
const myTasksContainer = document.querySelector(".mytasks-container");
const updateMyTasksList = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  myTasksContainer.innerHTML = "";
  tasks.forEach((task, index) => {
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
    myTasksContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="tasks-details">
        <div id="sno" class="mytasks">${index + 1}</div>
        <div id="task-name" class="mytasks">${taskName}</div>
        <div id="progress-bar" class="mytasks">
          <label for="file"></label>
          <progress
            id="file"
            value="32"
            max="100"
            style="height: 24px; width: 100%"
          >
            32%
          </progress>
        </div>
        <div id="details-button" class="mytasks">
          <button>details</button>
        </div>
        <div id="menu-icon" class="mytasks" onclick="myFunction(this)">
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
`
    );
  });
};
updateMyTasksList();
