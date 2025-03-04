console.log("daycards.js loaded");

// Exporting variables for external use if needed.
export let currentView = "week";
export let selectedWeek = 0;
export let selectedMonth = new Date().getMonth() + 1;

/**
 * Displays daycards for the given date range using provided calendar data.
 * @param {Array} calendarData - Array of transaction data.
 * @param {string} startDate - ISO date string for start date.
 * @param {string} endDate - ISO date string for end date.
 */
export function displayDayCards(calendarData, startDate, endDate) {
  const container = document.getElementById("dayCardsContainer");
  container.innerHTML = "";
  
  // Loop through calendarData starting at index 1 (assuming header at 0)
  for (let i = 1; i < calendarData.length; i++) {
    let [rawDate, type, description, amount] = calendarData[i];
    let txDate = new Date(rawDate + "T00:00:00");
    if (txDate >= new Date(startDate) && txDate <= new Date(endDate)) {
      const dayCard = document.createElement("div");
      dayCard.classList.add("day-card");
      
      dayCard.innerHTML = `
        <h2 class="day-summary">${rawDate}</h2>
        <div class="day-details" style="display: none;">
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Amount:</strong> ${amount}</p>
        </div>
        <button class="expand-transactions" title="Voir détails">+</button>
      `;
      
      container.appendChild(dayCard);
      
      const expandBtn = dayCard.querySelector(".expand-transactions");
      expandBtn.addEventListener("click", function () {
        const details = dayCard.querySelector(".day-details");
        if (details.style.display === "none") {
          details.style.display = "block";
          dayCard.classList.add("expanded");
        } else {
          details.style.display = "none";
          dayCard.classList.remove("expanded");
        }
      });
    }
  }
}

/**
 * Displays a monthly view by breaking the month into weeks.
 * @param {Array} calendarData - Array of transaction data.
 * @param {number} selectedMonth - The month number (1-indexed).
 */
export function displayMonthCards(calendarData, selectedMonth) {
  const container = document.getElementById("dayCardsContainer");
  container.innerHTML = "";
  
  const now = new Date();
  const year = now.getFullYear();
  const startOfMonth = new Date(year, selectedMonth - 1, 1);
  const endOfMonth = new Date(year, selectedMonth, 0);
  
  // Use displayDayCards with the calculated date range.
  displayDayCards(
    calendarData,
    startOfMonth.toISOString().split("T")[0],
    endOfMonth.toISOString().split("T")[0]
  );
}

/**
 * Sets up navigation buttons for week view.
 */
export function setupWeekNavigation() {
  const prevWeekButton = document.getElementById("prevWeek");
  const nextWeekButton = document.getElementById("nextWeek");
  
  if (prevWeekButton) {
    prevWeekButton.addEventListener("click", function () {
      selectedWeek = Math.max(0, selectedWeek - 1);
      console.log("Previous week clicked. New week index:", selectedWeek);
      // Calculate new week date range and call displayDayCards with calendarData
    });
  }
  
  if (nextWeekButton) {
    nextWeekButton.addEventListener("click", function () {
      selectedWeek++;
      console.log("Next week clicked. New week index:", selectedWeek);
      // Calculate new week date range and call displayDayCards with calendarData
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
      currentView = currentView === "week" ? "month" : "week";
      
      if (currentView === "month") {
        toggleViewButton.textContent = "📅 Vue Hebdomadaire";
        // You need to fetch calendarData from your API and pass it here:
        // displayMonthCards(calendarData, selectedMonth);
      } else {
        toggleViewButton.textContent = "📆 Vue Mensuelle";
        // Similarly, calculate week date range and update daycards.
        console.log("Switched to weekly view");
      }
      
      updateNavigationButtons();
    });
  }
}

/**
 * Toggles all daycards' expand/collapse state.
 */
export function setupToggleAllCards() {
  const toggleAllBtn = document.getElementById("toggleAllCards");
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener("click", function () {
      if (currentView === "month") {
        let allCards = document.querySelectorAll(".month-view-card");
        let isAnyExpanded = Array.from(allCards).some(card => card.classList.contains("expanded"));
        allCards.forEach(card => {
          card.classList.toggle("expanded", !isAnyExpanded);
          let details = card.querySelector(".day-details");
          if (details) {
            details.style.display = !isAnyExpanded ? "block" : "none";
          }
        });
        toggleAllBtn.textContent = isAnyExpanded ? "🔽 Déployer tout" : "🔼 Réduire tout";
      } else {
        let allCards = document.querySelectorAll(".day-card");
        let isAnyExpanded = Array.from(allCards).some(card => card.classList.contains("expanded"));
        allCards.forEach(card => {
          let details = card.querySelector(".day-details");
          let transactionsList = card.querySelector(".transactions-list");
          if (isAnyExpanded) {
            card.classList.remove("expanded");
            if (details) details.style.display = "none";
            if (transactionsList) transactionsList.style.display = "none";
          } else {
            card.classList.add("expanded");
            if (details) details.style.display = "block";
            if (transactionsList) transactionsList.style.display = "block";
          }
        });
        toggleAllBtn.textContent = isAnyExpanded ? "🔽 Déployer tout" : "🔼 Réduire tout";
      }
    });
  }
}

/**
 * Updates the labels of navigation buttons based on the current view.
 */
export function updateNavigationButtons() {
  const prevWeekButton = document.getElementById("prevWeek");
  const nextWeekButton = document.getElementById("nextWeek");
  if (!prevWeekButton || !nextWeekButton) return;
  if (currentView === "month") {
    prevWeekButton.textContent = "⬅️ Mois Précédent";
    nextWeekButton.textContent = "Mois Suivant ➡️";
  } else {
    prevWeekButton.textContent = "⬅️ Semaine Précédente";
    nextWeekButton.textContent = "Semaine Suivante ➡️";
  }
}

// Initialize event listeners when DOM is ready.
document.addEventListener("DOMContentLoaded", function () {
  setupToggleView();
  setupToggleAllCards();
  setupWeekNavigation();
  // Initialize the view (for testing, hardcoding a date range).
  // Replace calendarData with data fetched from your API.
  // For example: displayDayCards(calendarData, "2025-02-02", "2025-02-08");
});
