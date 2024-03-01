const moment = require("moment");

const dataArray = [
  { date: "02/03/2025", progress: 70 },
  { date: "28/02/2024", progress: 40 },
  { date: "01/03/2024", progress: 89 },
];

// Sort the array based on the parsed dates
dataArray.sort((a, b) => {
  const dateA = moment(a.date, "DD/MM/YYYY");
  const dateB = moment(b.date, "DD/MM/YYYY");
  return dateA.diff(dateB);
});

console.log(dataArray);
