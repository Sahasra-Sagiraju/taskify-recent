const moment = require("moment");

if (localStorage.getItem("tasks") === null) {
  localStorage.setItem("tasks", "[]");
}
const inputTaskName = document.querySelector("#tname");
const inputDesc = document.querySelector("#desc");
const inputSubTask = document.querySelector("#subtask");
const inputStartDate = document.querySelector("#sdate");
const inputEndDate = document.querySelector("#edate");
const inputCustomCategory = document.querySelector("#customc");
const btnAddTask = document.querySelector("#addb");
const priorityDiv = document.querySelector(".priority");
const priorityRadioArray = Array.from(document.querySelectorAll(".prb"));
const priorityDatePicker = document.querySelector(".priority-date-picker");
const recurringPeriodArray = Array.from(document.querySelectorAll(".rpc"));
const durationType = document.querySelector("#priority");

let taskName = "";
let taskDesc = "";
let subTask = "";
let startDate = "";
let endDate = "";
let pickedFirstStartDate = "";
let pickedFirstEndDate = "";
let pickedSecondStartDate = "";
let pickedSecondEndDate = "";
let customCategory = "";
let priorityfind = "";
let duration = "";
let progressEachDay = {};

function getMonthlyDates(pickedFirstStartDate, endDate) {
  const startMoment = moment(pickedFirstStartDate);
  const endMoment = moment(endDate);

  let monthlyDates = [];

  while (!startMoment.isAfter(endMoment)) {
    const lastDayOfMonth = startMoment.endOf("month").format("YYYY-MM-DD");
    monthlyDates.push(lastDayOfMonth);

    startMoment.add(1, "month");
  }

  return monthlyDates;
}

const resetForm = () => {
  inputTaskName.value = "";
  inputDesc.value = "";
  inputSubTask.value = "";
  inputStartDate.value = "";
  inputEndDate.value = "";
  inputCustomCategory.value = "";
  priorityRadioArray.map((element) => (element.checked = false));
  recurringPeriodArray.map((element) => (element.checked = false));
  durationType.value = "";

  taskName = "";
  taskDesc = "";
  subTask = "";
  startDate = "";
  endDate = "";
  pickedFirstStartDate = "";
  pickedFirstEndDate = "";
  pickedSecondStartDate = "";
  pickedSecondEndDate = "";
  customCategory = "";
  priorityfind = "";
  duration = "";

  priorityDatePicker.innerHTML = "";

  Object.keys(progressEachDay).forEach((key) => {
    delete object[key];
  });

  alert("task added!");
};

priorityDiv.addEventListener("change", (event) => {
  priorityDatePicker.innerHTML = "";

  const priority = event.target.value;
  switch (priority) {
    case "weekly": {
      const date = new Date(startDate);
      const lastDate = new Date(startDate);
      if (startDate === "") {
        alert("Please pick start date and end date for this task first");
        event.target.checked = false;
        return;
      }
      lastDate.setDate(lastDate.getDate() + 7);
      const formattedStartDate = date.toISOString().split("T")[0];
      const formattedLastDate = lastDate.toISOString().split("T")[0];
      priorityDatePicker.insertAdjacentHTML(
        "beforeend",
        `<label for="priority-date-picker__input">Pick a date:
                  <input
                    id="priority-date-picker__input"
                    type="date"
                    min=${formattedStartDate}
                    max=${formattedLastDate}
                /></label>`
      );
      return;
    }
    case "biweekly": {
      const date = new Date(startDate);
      const lastDate = new Date(startDate);
      if (startDate === "") {
        alert("Please pick start date and end date for this task first");
        event.target.checked = false;
        return;
      }
      lastDate.setDate(lastDate.getDate() + 7);
      console.log(typeof date);
      const formattedStartDate = date.toISOString().split("T")[0];
      const formattedLastDate = lastDate.toISOString().split("T")[0];
      priorityDatePicker.insertAdjacentHTML(
        "beforeend",
        `<label for="priority-date-picker__input">Pick first date:
                  <input
                    id="priority-date-picker__input"
                    type="date"
                    min=${formattedStartDate}
                    max=${formattedLastDate}
                /></label>
          <label for="priority-date-picker__input">Pick second date:
          <input
            id="priority-date-picker__input-1"
            type="date"
            min=${formattedStartDate}
            max=${formattedLastDate}
        /></label>`
      );
      return;
    }
    case "monthly": {
      const date = new Date(startDate);
      const lastDate = new Date(startDate);
      if (startDate === "") {
        alert("Please pick start date and end date for this task first");
        event.target.checked = false;
        return;
      }
      lastDate.setMonth(date.getMonth() + 1);
      lastDate.setDate(date.getDate() - 1);
      const formattedStartDate = date.toISOString().split("T")[0];
      const formattedLastDate = lastDate.toISOString().split("T")[0];
      priorityDatePicker.insertAdjacentHTML(
        "beforeend",
        `<label for="priority-date-picker__input">Pick a date:
                  <input
                    id="priority-date-picker__input"
                    type="date"
                    min=${formattedStartDate}
                    max=${formattedLastDate}
                /></label>`
      );
      return;
    }
  }
});

const printTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((element) => {
    console.log(element);
  });
};

const getMinDate = (date1, date2) => {
  if (date1 < date2) {
    return date1;
  } else {
    return date2;
  }
};

btnAddTask.addEventListener("click", () => {
  taskName = inputTaskName.value;
  taskDesc = inputDesc.value;
  subTask = inputSubTask.value;
  startDate = inputStartDate.value;
  endDate = inputEndDate.value;
  customCategory = inputCustomCategory.value;
  priority = priorityRadioArray.find((element) => element.checked).value;
  const recurringPeriod = recurringPeriodArray.find(
    (element) => element.checked
  ).value;
  const duration = durationType.value;

  const progressEachDay = {};
  switch (priority) {
    case "daily":
      console.log("I'm here");
      let date = new Date(startDate);
      let lastDate = new Date(endDate);
      while (date <= lastDate) {
        const formattedDate = date.toLocaleDateString();
        console.log(formattedDate);
        progressEachDay[formattedDate] = undefined;
        date.setDate(date.getDate() + 1);
      }
      break;
    case "weekly": {
      let date = new Date(pickedFirstStartDate);
      let lastDate = new Date(endDate);
      while (date <= lastDate) {
        const formattedDate = date.toLocaleDateString();
        console.log(formattedDate);
        progressEachDay[formattedDate] = undefined;
        date.setDate(date.getDate() + 7);
      }
      break;
    }
    case "biweekly": {
      let firstDate = new Date(pickedFirstStartDate);
      let secondDate = new Date(pickedSecondStartDate);
      let lastDate = new Date(endDate);
      while (firstDate <= lastDate) {
        const formattedDate = firstDate.toLocaleDateString();
        progressEachDay[formattedDate] = undefined;
        firstDate.setDate(firstDate.getDate() + 7);
      }
      console.log(secondDate);
      console.log(lastDate);
      while (secondDate <= lastDate) {
        console.log("I'm here");
        const formattedDate = secondDate.toLocaleDateString();
        progressEachDay[formattedDate] = undefined;
        secondDate.setDate(secondDate.getDate() + 7);
      }
      break;
    }
    case "monthly": {
      const dates = getMonthlyDates(pickedFirstStartDate, endDate);
      dates.forEach((date) => (progressEachDay[date] = undefined));
      break;
    }
    default:
      console.log("Line: 232, This is the default case in the switch case!");
  }

  const copyProgressEachDay = { ...progressEachDay };

  const newTask = {
    taskName,
    taskDesc,
    subTask,
    startDate,
    endDate,
    customCategory,
    priority,
    recurringPeriod,
    duration,
    progressEachDay: copyProgressEachDay,
  };

  console.log(newTask);
  const temp = JSON.parse(localStorage.getItem("tasks"));
  console.log(temp);
  temp.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(temp));
  console.log(localStorage.getItem("tasks"));
  resetForm();
});

// setTimeout(() => {
//   printTasks();
// }, 0);
// const temp = getDatePickerHTML(priority, startDate);
//       console.log(temp);

const formDiv = document.querySelector(".form-custom");
formDiv.addEventListener("change", (event) => {
  if (event.target.getAttribute("type") === "date") {
    const date = event.target;
    if (date.getAttribute("id") === "sdate") {
      startDate = inputStartDate.value;
    } else {
      endDate = inputEndDate.value;
    }
  }
  console.log(startDate, endDate);
});

priorityDatePicker.addEventListener("change", () => {
  const datePickerArray = Array.from(priorityDatePicker.children).map(
    (labelChild) => Array.from(labelChild.children)[0]
  );

  if (datePickerArray.length === 1) {
    pickedFirstStartDate = datePickerArray[0].value;
  } else {
    pickedFirstStartDate = datePickerArray[0].value;
    pickedSecondEndDate = datePickerArray[1].value;
  }
});
