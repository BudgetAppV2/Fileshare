console.log("graphs.js loaded");

// Exported function to update the Revenues vs Expenses chart.
export function updateEnhancedRevenuesVsExpensesChart(revenues, expenses) {
  // Use window scope for the chart instance
  if (window.revenuesVsExpensesChart) {
    window.revenuesVsExpensesChart.data.datasets[0].data = [revenues, expenses];
    window.revenuesVsExpensesChart.update();
  } else {
    const ctx = document.getElementById("revenuesVsExpensesChart").getContext("2d");
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
  console.log("Updated Revenues vs Expenses Chart:", revenues, expenses);
}

// Exported function to update the enhanced pie chart.
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
            "#007BFF",
            "#28a745",
            "#dc3545",
            "#ffc107",
            "#17a2b8",
            "#6c757d"
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  console.log("Updated Pie Chart with labels:", labels, "and data:", dataValues);
}

// Graph Toggle Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  const toggleDots = document.querySelectorAll("#chartToggle .toggle-dot");
  const chartsContainer = document.getElementById("fullChartsContainer");

  toggleDots.forEach(dot => {
    dot.addEventListener("click", function () {
      // Remove active class from all dots
      toggleDots.forEach(d => d.classList.remove("active"));
      // Add active class to the clicked dot
      this.classList.add("active");

      // Get the index from the data-index attribute
      const index = parseInt(this.getAttribute("data-index"), 10);

      // Calculate the scroll position for the charts container
      const scrollPosition = index * chartsContainer.clientWidth;

      // Smooth scroll to the selected chart page
      chartsContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });
      console.log("Scrolled to chart index:", index);
    });
  });
});

// Graph Toggle Buttons for weekly/monthly views
document.addEventListener("DOMContentLoaded", function () {
  const graphToggleButtons = document.querySelectorAll(".graph-toggle-btn");
  graphToggleButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      graphToggleButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      
      // Determine view type (e.g., "week" or "month")
      const viewType = this.getAttribute("data-view");
      // Insert your logic to update charts based on viewType.
      console.log("Graph view toggled to:", viewType);
    });
  });
});
