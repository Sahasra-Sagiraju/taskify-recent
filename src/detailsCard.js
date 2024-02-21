import Chart from "chart.js/auto";

// DOM Elements
const backBtn = document.querySelector(".details-box__back-btn");
const dashboardBox = document.querySelector(".dashboard-box");
const detailsBox = document.querySelector(".details-box");

backBtn.addEventListener("click", () => {
  detailsBox.setAttribute("hidden", true);
  dashboardBox.removeAttribute("hidden");
});

const constructGraph = async () => {
  const data = [
    { date: "2024-2-10", progress: 60 },
    { date: "2024-2-11", progress: 100 },
    { date: "2024-2-12", progress: 90 },
    { date: "2024-2-13", progress: 40 },
    { date: "2024-2-14", progress: 50 },
  ];

  new Chart(document.getElementById("progress-by-day"), {
    type: "line",
    options: {
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
