console.log("graphs.js loaded");

import { dateManager } from "./dateManager.js";

const sectionName = "graphs"; // Unique identifier for this section
dateManager.initSection(sectionName);

// ==========================
// 📊 Revenues vs Expenses Chart
// ==========================
export function updateEnhancedRevenuesVsExpensesChart(revenues, expenses) {
  const chartElement = document.getElementById("revenuesVsExpensesChart");

  if (!chartElement) {
    console.error("❌ ERROR: #revenuesVsExpensesChart not found in DOM!");
    return;
  }

  const ctx = chartElement.getContext("2d");

  if (window.revenuesVsExpensesChart) {
    console.log("🔄 Updating Existing Revenues vs Expenses Chart...");
    window.revenuesVsExpensesChart.data.datasets[0].data = [revenues, expenses];
    window.revenuesVsExpensesChart.update();
  } else {
    console.log("📊 Creating New Revenues vs Expenses Chart...");
    window.revenuesVsExpensesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Revenues", "Expenses"],
        datasets: [{
          label: "Amount",
          data: [revenues, expenses],
          backgroundColor: ["green", "red"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  console.log("📊 Updated Revenues vs Expenses Chart:", revenues, expenses);
}


// ==========================
// 🍕 Enhanced Pie Chart
// ==========================
export function updateEnhancedPieChart(dataValues, labels) {
  if (window.enhancedPieChartInstance) {
    window.enhancedPieChartInstance.data.datasets[0].data = dataValues;
    window.enhancedPieChartInstance.data.labels = labels;
    window.enhancedPieChartInstance.update();
  } else {
    const ctx = document.getElementById("enhancedPieChart").getContext("2d");
    window.enhancedPieChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: [
            "#007BFF", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6c757d"
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  console.log("🍕 Updated Pie Chart with labels:", labels, "and data:", dataValues);
}

// ==========================
// 🔄 Navigation Controls (Week & Month)
// ==========================
export function setupGraphNavigation() {
  const prevWeekButton = document.getElementById("prevGraphWeek");
  const nextWeekButton = document.getElementById("nextGraphWeek");
  const prevMonthButton = document.getElementById("prevGraphMonth");
  const nextMonthButton = document.getElementById("nextGraphMonth");

  if (prevWeekButton) {
    prevWeekButton.addEventListener("click", function () {
      dateManager.prev(sectionName);
    });
  }

  if (nextWeekButton) {
    nextWeekButton.addEventListener("click", function () {
      dateManager.next(sectionName);
    });
  }

  if (prevMonthButton) {
    prevMonthButton.addEventListener("click", function () {
      dateManager.prev(sectionName);
    });
  }

  if (nextMonthButton) {
    nextMonthButton.addEventListener("click", function () {
      dateManager.next(sectionName);
    });
  }
}

// ==========================
// 🎛️ Graph Toggle Event Listeners
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  const toggleDots = document.querySelectorAll("#chartToggle .toggle-dot");
  const chartsContainer = document.getElementById("fullChartsContainer");

  toggleDots.forEach(dot => {
    dot.addEventListener("click", function () {
      toggleDots.forEach(d => d.classList.remove("active"));
      this.classList.add("active");

      const index = parseInt(this.getAttribute("data-index"), 10);
      const scrollPosition = index * chartsContainer.clientWidth;

      chartsContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });

      console.log("📊 Scrolled to chart index:", index);
    });
  });
});

// ==========================
// 📆 Graph View Toggle (Week/Month)
// ==========================
export function setupGraphViewToggle() {
  const graphToggleButtons = document.querySelectorAll(".graph-toggle-btn");

  graphToggleButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      graphToggleButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      const viewType = this.getAttribute("data-view");
      if (viewType === "week") {
        dateManager.setWeekView(sectionName);
      } else {
        dateManager.setMonthView(sectionName);
      }

      console.log("📈 Graph view toggled to:", viewType);
    });
  });
}

// ==========================
// 📅 Listen for Global Date Updates
// ==========================
document.addEventListener("dateRangeUpdated", (event) => {
  const { section, startDate, endDate, view } = event.detail;
  if (section === sectionName) {
    console.log(`📊 Updating Graphs: ${startDate} → ${endDate} (View: ${view})`);
    updateAllCharts(startDate, endDate);
  }
});

// ==========================
// 🔄 Update All Charts Based on New Date Range
// ==========================
export function updateAllCharts(startDate, endDate) {
  const filteredData = filterChartData(window.calendarData, startDate, endDate);
  
  updateEnhancedRevenuesVsExpensesChart(filteredData.totalRevenues, filteredData.totalExpenses);
  updateEnhancedPieChart(filteredData.categoryData, filteredData.categoryLabels);
}

// ==========================
// 🔍 Filter Data for Graphs
// ==========================
function filterChartData(calendarData, startDate, endDate) {
  if (!calendarData || !Array.isArray(calendarData)) {
    console.warn("⚠️ No valid transaction data found for graphs.");
    return { totalRevenues: 0, totalExpenses: 0, categoryData: [], categoryLabels: [] };
  }

  let totalRevenues = 0;
  let totalExpenses = 0;
  let categoryData = {};

  for (let i = 1; i < calendarData.length; i++) {
    let [rawDate, type, description, amount] = calendarData[i];
    if (!rawDate || !amount) continue;

    let txDate = new Date(rawDate + "T00:00:00");
    if (txDate >= new Date(startDate) && txDate <= new Date(endDate)) {
      amount = parseFloat(amount);
      
      if (type.toLowerCase() === "revenu") {
        totalRevenues += amount;
      } else if (type.toLowerCase() === "dépense") {
        totalExpenses += Math.abs(amount);
        categoryData[description] = (categoryData[description] || 0) + Math.abs(amount);
      }
    }
  }

  return {
    totalRevenues,
    totalExpenses,
    categoryData: Object.values(categoryData),
    categoryLabels: Object.keys(categoryData)
  };
}


// ==========================
// 🚀 Initialize Listeners on Load
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  setupGraphNavigation();
  setupGraphViewToggle();
});
