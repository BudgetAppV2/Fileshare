import { fetchSheetData } from './dataService.js';
import { displayDayCards } from './daycards.js';
import { updateAllCharts } from './graphs.js'; 
import { updateProgress } from './progress.js';

// Initialize global variables for date range and view mode
window.currentWeekStartDate = getStartOfWeek(new Date());
window.currentWeekEndDate = getEndOfWeek(new Date());
window.currentMonthStartDate = new Date();
window.currentView = "week"; // Default to week mode

export async function updateAllData(fetchNew = false) {
  try {
      console.log("🔄 updateAllData: start");

      // Fetch transactions only if fetchNew is true or data is missing
      if (fetchNew || !window.calendarData) {
          console.log("📡 Fetching transactions from Google Sheets...");
          const data = await fetchSheetData();
          console.log("✅ Raw Data Fetched:", data);

          // Check if data is valid before storing
          if (!data || !data.data) {
              console.error("❌ No data received from fetchSheetData! Check API.");
              return;
          }

          // Store data globally for all sections
          window.calendarData = data.data;
          console.log("🗂 Transactions successfully stored in window.calendarData:", window.calendarData);
      } else {
          console.log("📂 Using cached transactions in window.calendarData");
      }

      // Make sure transactions exist before filtering
      if (!window.calendarData || window.calendarData.length === 0) {
          console.warn("⚠️ No transactions available in memory.");
          return;
      }

      // Get the correct date range
      let startDate, endDate;
      if (window.currentView === "month") {
          startDate = getStartOfMonth(window.currentMonthStartDate).toISOString().split("T")[0];
          endDate = getEndOfMonth(window.currentMonthStartDate).toISOString().split("T")[0];
      } else {
          startDate = window.currentWeekStartDate.toISOString().split("T")[0];
          endDate = window.currentWeekEndDate.toISOString().split("T")[0];
      }
      console.log(`📅 Updating UI with transactions from ${startDate} to ${endDate}`);

      // Filter transactions for the selected date range
      const filteredData = filterTransactions(window.calendarData, startDate, endDate);
      console.log("📊 Filtered transactions:", filteredData);

      // Update all sections with the filtered data
      displayDayCards(filteredData, startDate, endDate);
      updateAllCharts(startDate, endDate);

      console.log("✅ updateAllData: end");
  } catch (error) {
      console.error("❌ Error in updateAllData:", error);
  }
}


// Function to filter transactions within a given date range
function filterTransactions(data, startDate, endDate) {
  if (!data || !Array.isArray(data)) {
    console.warn("⚠️ Invalid data received for filtering.");
    return [];
  }

  console.log(`📅 Filtering Transactions from ${startDate} → ${endDate}`);

  const filtered = data.filter(([rawDate]) => {
    if (!rawDate) return false; // Skip empty entries
    const txDate = new Date(rawDate + "T00:00:00");
    return txDate >= new Date(startDate) && txDate <= new Date(endDate);
  });

  console.log("📊 Filtered Transactions:", filtered);
  return filtered;
}


// Helper Functions for Week & Month Start/End Dates
function getStartOfWeek(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay()); // Start of the week (Sunday)
    d.setHours(0, 0, 0, 0);
    return d;
}

function getEndOfWeek(date) {
    const d = getStartOfWeek(date);
    d.setDate(d.getDate() + 6); // End of the week (Saturday)
    return d;
}

function getStartOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getEndOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// Make function available in browser for debugging
window.updateAllData = updateAllData;
