console.log("addTask");
if (localStorage.getItem("tasks") === null) {
  localStorage.setItem("tasks", "[]");
}
const inputTaskName = document.querySelector("#tname");
console.log(inputTaskName);
const inputDesc = document.querySelector("#desc");
const inputSubTask = document.querySelector("#subtask");
const inputStartDate = document.querySelector("#sdate");
const inputEndDate = document.querySelector("#edate");
const inputCustomCategory = document.querySelector("#customc");
const btnAddTask = document.querySelector("#addb");
const priorityRadioArray = Array.from(document.querySelectorAll(".prb"));
console.log(priorityRadioArray);
const recurringPeriodArray = Array.from(document.querySelectorAll(".rpc"));
const durationType = document.querySelector("#priority");

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
  alert("task added!");
};

const printTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((element) => {
    console.log(element);
  });
};
btnAddTask.addEventListener("click", () => {
  const taskName = inputTaskName.value;
  const taskDesc = inputDesc.value;
  const subTask = inputSubTask.value;
  const startDate = inputStartDate.value;
  const endDate = inputEndDate.value;
  const customCategory = inputCustomCategory.value;
  const priority = priorityRadioArray.find((element) => element.checked).value;
  const recurringPeriod = recurringPeriodArray.find(
    (element) => element.checked
  ).value;
  const duration = durationType.value;
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
  };
  console.log(newTask);
  const temp = JSON.parse(localStorage.getItem("tasks"));
  temp.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(temp));
  console.log(localStorage.getItem("tasks"));
  resetForm();
});

setTimeout(() => {
  printTasks();
}, 60000);
