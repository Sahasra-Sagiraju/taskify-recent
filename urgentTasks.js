const urgentTasksContainer = document.querySelector(".urgent-tasks-container");

const valueOf = (priority) => {
  switch (priority) {
    case "High":
      return 2;
    case "Medium":
      return 1;
    case "Low":
      return 0;
    default:
      return NaN;
  }
};

const sortByPriority = (task1, task2) => {
  const priorityComparison = valueOf(task2.duration) - valueOf(task1.duration);
  if (priorityComparison !== 0) {
    return priorityComparison;
  } else {
    const startDate1 = new Date(task1.startDate);
    const startDate2 = new Date(task2.startDate);
    return startDate1 - startDate2;
  }
};

const updateUrgentTasksList = () => {
  const tasksArray = JSON.parse(localStorage.getItem("tasks"));

  const tasksArrayCopy = [...tasksArray];
  tasksArrayCopy.sort(sortByPriority);

  urgentTasksContainer.innerHTML = "";

  tasksArrayCopy.forEach((task, index) => {
    console.log("urgent-tasks tag-" + task.duration.toLowerCase());
    urgentTasksContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="urgent-tasks-details">
        <div id="sno" class="urgent-tasks">${index + 1}</div>
        <div id="urgent-task-name" class="urgent-tasks">${task.taskName}</div>
        <div id="urgency" class=${"tag-" + task.duration.toLowerCase()}>
            <p>${task.duration}</p>
        </div>
        <button type="button" class="details-btn">Details</button>
      </div>`
    );
  });
};

updateUrgentTasksList();
