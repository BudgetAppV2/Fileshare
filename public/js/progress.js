console.log("progress.js loaded");

import { dateManager } from "./dateManager.js";

const sectionName = "progress"; // Unique identifier for this section
dateManager.initSection(sectionName);

// ==========================
// 📊 Display Transactions in Progress Section
// ==========================
export function displayTransactionsSection(viewType) {
  console.log(`📊 displayTransactionsSection called: View = ${viewType}`);

  // Determine the date range from dateManager
  const { startDate, endDate } = dateManager.getDateRange(sectionName);

  console.log(`📆 Filtering transactions from ${startDate} to ${endDate}`);

  const container = document.getElementById("transactionsContainer");
  if (!container) {
    console.error("❌ transactionsContainer element not found!");
    return;
  }
  container.innerHTML = ""; // Clear previous content.

  if (!window.allowedCategories || window.allowedCategories.length === 0) {
    container.innerHTML = "<p>Aucune catégorie disponible.</p>";
    return;
  }

  window.allowedCategories.forEach(category => {
    let transactions = getTransactionsForCategory(category, startDate, endDate);
    let total = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    let categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-transactions");

    let header = document.createElement("h2");
    header.textContent = `${category} - Total: ${formatCurrency(total)}`;
    categoryDiv.appendChild(header);

    let toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Voir Transactions";
    toggleBtn.classList.add("toggle-transactions-btn");
    toggleBtn.addEventListener("click", function () {
      let listDiv = categoryDiv.querySelector(".transactions-list");
      if (listDiv) {
        listDiv.style.display = listDiv.style.display === "none" ? "block" : "none";
      } else {
        listDiv = document.createElement("div");
        listDiv.classList.add("transactions-list");
        if (transactions.length === 0) {
          listDiv.innerHTML = "<p>Aucune transaction pour cette catégorie.</p>";
        } else {
          transactions.forEach(tx => {
            listDiv.innerHTML += `<p><strong>${tx.date}</strong> - ${tx.description} - ${tx.type} - ${formatCurrency(tx.amount)}</p>`;
          });
        }
        categoryDiv.appendChild(listDiv);
      }
    });
    categoryDiv.appendChild(toggleBtn);
    container.appendChild(categoryDiv);
  });
}

// ==========================
// 🔄 Navigation Controls (Week & Month)
// ==========================
export function setupProgressNavigation() {
  const prevWeekButton = document.getElementById("prevProgressWeek");
  const nextWeekButton = document.getElementById("nextProgressWeek");
  const prevMonthButton = document.getElementById("prevProgressMonth");
  const nextMonthButton = document.getElementById("nextProgressMonth");

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
// 📆 Progress View Toggle (Week/Month)
// ==========================
export function setupProgressViewToggle() {
  const progressToggleButtons = document.querySelectorAll(".progress-toggle-btn");

  progressToggleButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      progressToggleButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      const viewType = this.getAttribute("data-view");
      if (viewType === "week") {
        dateManager.setWeekView(sectionName);
      } else {
        dateManager.setMonthView(sectionName);
      }

      console.log("📈 Progress view toggled to:", viewType);
    });
  });
}

// ==========================
// 📅 Listen for Global Date Updates
// ==========================
document.addEventListener("dateRangeUpdated", (event) => {
  const { section, startDate, endDate, view } = event.detail;
  if (section === sectionName) {
    console.log(`📊 Updating Progress: ${startDate} → ${endDate} (View: ${view})`);
    displayTransactionsSection(view);
  }
});

// ==========================
// 🚀 Initialize Listeners on Load
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  setupProgressNavigation();
  setupProgressViewToggle();
});
export function updateProgress(startDate, endDate) {
  console.log(`📊 Updating Progress Section: ${startDate} → ${endDate}`);

  // Ensure we have transactions
  if (!window.calendarData || window.calendarData.length === 0) {
    console.warn("⚠️ No transaction data available for progress update.");
    return;
  }

  // Filter transactions for the given date range
  const filteredData = filterProgressData(window.calendarData, startDate, endDate);
  console.log("🔍 Filtered transactions for progress:", filteredData);

  // Update the progress display
  displayTransactionsSection(filteredData);
}
function filterProgressData(calendarData, startDate, endDate) {
  return calendarData.filter(([rawDate]) => {
    if (!rawDate) return false; // Skip empty entries
    const txDate = new Date(rawDate + "T00:00:00");
    return txDate >= new Date(startDate) && txDate <= new Date(endDate);
  });
}
