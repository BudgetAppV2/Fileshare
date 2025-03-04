import { fetchSheetData } from './dataService.js';
console.trace("fetchSheetData called");
import { getTransactionBreakdown } from './breakdown.js';
// Import any UI update functions from your UI modules, e.g., from graphs.js, budget.js, etc.

export async function updateAllData() {
        debugger; // Pauses execution when the function is called
        // ...
      }
      
  try {
    console.log("updateAllData: start");
    // 1. Fetch data from the backend
    const data = await fetchSheetData();
    console.log("Fetched Data:", data);

    // 2. Store the calendar data in a global variable for consistency.
    // For example, if you have a global variable `calendarData` in main.js:
    window.calendarData = data.calendarData || [];  // Or assign to a state variable

    // 3. Process the data: get a unified transaction breakdown.
    // Pass the fetched calendarData and a view type (e.g., "month").
    const breakdown = getTransactionBreakdown(window.calendarData, "month");
    console.log("Transaction Breakdown:", breakdown);

    // 4. Update UI Sections:
    // Call the functions that update your charts, budget, progress, daycards, etc.
    // For example, if you have functions like:
    // updateEnhancedRevenuesVsExpensesChart(revenues, expenses);
    // updateEnhancedPieChart(pieDataValues, pieLabels);
    // updateBudgetSection(breakdown);
    // updateProgressSection(window.calendarData);
    // displayDayCards(window.calendarData, startDate, endDate);
    // (You may need to calculate some totals separately.)
    
    console.log("updateAllData: end");
  } catch (error) {
    console.error("Error updating all data:", error);
  }


// Expose the function for testing:
window.updateAllData = updateAllData;

