console.log("daycards.js loaded");

import { dateManager } from "./dateManager.js";

const sectionName = "daycards"; // Unique identifier for this section
dateManager.initSection(sectionName);

/**
 * Displays daycards for the given date range using provided calendar data.
 */
export function displayDayCards(calendarData, startDate, endDate) {
  const container = document.getElementById("dayCardsContainer");
  if (!container) {
    console.error("❌ ERROR: #dayCardsContainer not found in DOM!");
    return;
  }

  container.innerHTML = ""; // Clear existing day cards
  console.log(`📅 Filtering transactions from ${startDate} to ${endDate}`);

  if (!calendarData || !Array.isArray(calendarData) || calendarData.length === 0) {
    console.error("❌ ERROR: calendarData is empty or undefined!");
    return;
  }

  // ✅ Step 1: Ensure exactly 7 day cards are created, even if empty
  let transactionsByDate = {};
  let currentDay = new Date(Date.UTC(...startDate.split('-').map(Number)));

  for (let i = 0; i < 7; i++) {
    let dateKey = currentDay.toISOString().split("T")[0]; // Normalize to UTC
    transactionsByDate[dateKey] = { revenus: 0, depenses: 0, transactions: [] };
    currentDay.setUTCDate(currentDay.getUTCDate() + 1);
  }

  console.log("✅ Initialized transactionsByDate structure:", transactionsByDate);

  // ✅ Step 2: Process transactions and group them by date
  for (let i = 1; i < calendarData.length; i++) {
    let transaction = calendarData[i];

    if (!Array.isArray(transaction) || transaction.length < 4) {
      console.warn(`⚠️ Skipping invalid transaction at index ${i}:`, transaction);
      continue;
    }

    let [rawDate, type, description, amount] = transaction;

    if (!rawDate) {
      console.warn(`⚠️ Skipping transaction with missing date:`, transaction);
      continue;
    }

    // ✅ Normalize date and fix timezone shifts
    let [year, month, day] = rawDate.split('-').map(Number);
    let txDate = new Date(Date.UTC(year, month - 1, day)); // Fix month shift
    let txDateKey = txDate.toISOString().split("T")[0];

    console.log(`📅 Normalized Date for Transaction: ${txDateKey}`);

    if (txDateKey < startDate || txDateKey > endDate) {
      continue; // Skip transactions outside of range
    }

    if (!transactionsByDate[txDateKey]) {
      transactionsByDate[txDateKey] = { revenus: 0, depenses: 0, transactions: [] };
    }

    let parsedAmount = parseFloat(amount.replace(',', '.')) || 0; // Ensure correct decimal parsing

    if (type === "Revenu") {
      transactionsByDate[txDateKey].revenus += parsedAmount;
    } else if (type === "Dépense") {
      transactionsByDate[txDateKey].depenses += Math.abs(parsedAmount);
    }

    transactionsByDate[txDateKey].transactions.push({ type, description, amount: parsedAmount });
  }

  console.log("✅ Processed transactionsByDate:", transactionsByDate);

  // ✅ Step 3: Create 7 day cards (Default: Collapsed)
  let displayStartDate = new Date(Date.UTC(...startDate.split('-').map(Number))); // Ensure correct start date
  for (let i = 0; i < 7; i++) {
    let dateKey = displayStartDate.toISOString().split("T")[0]; // Normalize to UTC
    let { revenus, depenses, transactions } = transactionsByDate[dateKey] || { revenus: 0, depenses: 0, transactions: [] };

    let formattedDate = displayStartDate.toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', timeZone: 'UTC' });
    let dayName = displayStartDate.toLocaleDateString("fr-FR", { weekday: 'short', timeZone: 'UTC' });

    console.log(`🛠️ Creating day card for ${formattedDate}`);

    let card = document.createElement("div");
    card.classList.add("day-card");

    card.innerHTML = `
      <div class="day-summary">
          <span class="date-label">${dayName} ${formattedDate}</span>
      </div>
      <div class="day-details" style="display: none;">
          <p style="color: green;">+${revenus.toFixed(2)}</p>
          <p style="color: red;">-${depenses.toFixed(2)}</p>
      </div>
      <button class="expand-transactions" title="Voir détails">+</button>
      <div class="transactions-list" style="display: none;">
          ${transactions.length > 0 
            ? transactions.map(tx => `<p>${tx.type === "Revenu" ? "💰" : "💸"} ${tx.description} - ${tx.amount.toFixed(2)}</p>`).join("")
            : "<p>Aucune transaction</p>"
          }
      </div>
    `;

    console.log(`✅ Card created for ${formattedDate}, now attaching event listeners...`);

    // ✅ Expand/collapse summary when clicking the day card
    card.addEventListener("click", function (event) {
      if (event.target.classList.contains("expand-transactions")) return;

      let details = this.querySelector(".day-details");
      let transactionsList = this.querySelector(".transactions-list");
      let isExpanded = details.style.display === "block";

      if (isExpanded) {
        details.style.display = "none";
        transactionsList.style.display = "none";
      } else {
        details.style.display = "block";
      }
    });

    // ✅ Expand transactions when clicking the ➕ button
    let expandBtn = card.querySelector(".expand-transactions");
    let transactionsList = card.querySelector(".transactions-list");

    if (expandBtn && transactionsList) {
      expandBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        transactionsList.style.display = transactionsList.style.display === "block" ? "none" : "block";
      });
    }

    container.appendChild(card);
    displayStartDate.setUTCDate(displayStartDate.getUTCDate() + 1); // Move to next day
  }

  console.log("✅ Finished creating all day cards.");
}






/**
 * Handles week navigation.
 */
export function setupWeekNavigation() {
  const prevWeekButton = document.getElementById("prevWeek");
  const nextWeekButton = document.getElementById("nextWeek");

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
}

/**
 * Handles month navigation.
 */
export function setupMonthNavigation() {
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");

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

/**
 * Sets up toggle view between week and month.
 */
export function setupToggleView() {
  const toggleViewButton = document.getElementById("toggleView");

  if (toggleViewButton) {
    toggleViewButton.addEventListener("click", function () {
      if (dateManager.sectionStates[sectionName].view === "week") {
        dateManager.setMonthView(sectionName);
        toggleViewButton.textContent = "📅 Vue Hebdomadaire";
      } else {
        dateManager.setWeekView(sectionName);
        toggleViewButton.textContent = "📆 Vue Mensuelle";
      }
      updateNavigationButtons();
    });
  }
}

/**
 * Updates navigation button visibility based on the current view.
 */
export function updateNavigationButtons() {
  const prevWeekButton = document.getElementById("prevWeek");
  const nextWeekButton = document.getElementById("nextWeek");
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");

  let currentView = dateManager.sectionStates[sectionName].view;

  if (currentView === "month") {
    if (prevWeekButton) prevWeekButton.style.display = "none";
    if (nextWeekButton) nextWeekButton.style.display = "none";
    if (prevMonthButton) prevMonthButton.style.display = "inline-block";
    if (nextMonthButton) nextMonthButton.style.display = "inline-block";
  } else {
    if (prevWeekButton) prevWeekButton.style.display = "inline-block";
    if (nextWeekButton) nextWeekButton.style.display = "inline-block";
    if (prevMonthButton) prevMonthButton.style.display = "none";
    if (nextMonthButton) nextMonthButton.style.display = "none";
  }
}

/**
 * Listens for updates from `dateManager.js` and updates daycards.
 */
document.addEventListener("dateRangeUpdated", (event) => {
  const { section, startDate, endDate, view } = event.detail;
  if (section === sectionName) {
    console.log(`📅 Updating Day Cards: ${startDate} → ${endDate} (View: ${view})`);
    displayDayCards(window.calendarData, startDate, endDate);
  }
});

/**
 * Initializes event listeners when DOM is ready.
 */
document.addEventListener("DOMContentLoaded", function () {
  setupToggleView();
  setupWeekNavigation();
  setupMonthNavigation();
  updateNavigationButtons();
});
