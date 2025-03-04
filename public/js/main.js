// main.js
console.log("main.js loaded");

// Import functions from other modules:
import { initBudgetAllocation } from './budget.js';
import { fetchSheetData } from './dataService.js';
import { updateAllData } from './datamanager.js'; // Ensure updateAllData is exported from datamanager.js
window.fetchSheetData = fetchSheetData;

// ====================================================
// Global Variables
// ====================================================
export const SHEET_ID = "1h9jMrBRBkDiduNSMolQp80TvhUr_5_5yDbQlBVc21ms";
export const GAS_URL = "https://script.google.com/macros/s/AKfycbymY7agtsI-nsLO7ZZibnZo2uvgx3o09l9Qt0hatJxh6vEUcJtAwA_1ED-TqfLWvXg/exec";

// Authentication & Data Variables
export let accessToken = localStorage.getItem("accessToken") || "";
export let currentWeek = 0;
export let weeklyData = [];
export let calendarData = [];

// Budget-related Variables
export let categories = {};          // Stores allowed budgets and spent amounts per category.
export let allowedCategories = [];   // Array of allowed category names.
export let totalFunds = 0;           // Calculated available funds.

// ----------------------------------------------------
// DOMContentLoaded: Set default view and set up navigation
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Set default view to dayCardsSection on initial load.
  const defaultSection = document.getElementById("dayCardsSection");
  if (defaultSection) {
    defaultSection.style.display = "block";
  }

  // Set up navigation button event listeners.
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(btn => {
    btn.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent any default behavior

      // Remove active class from all buttons and add to this one.
      navButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      // Hide all app sections (ensure all sections have class "app-section").
      const sections = document.querySelectorAll(".app-section");
      sections.forEach(section => {
        section.style.display = "none";
      });

      // Get target section id.
      const targetId = this.getAttribute("data-target");
      console.log("Navigating to section:", targetId);

      // Show the target section.
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = "block";
        // For sections that need updated data, call updateAllData.
        if (targetId === "budgetSection" || targetId === "graphsSection" || targetId === "progressSection") {
          updateAllData();
        }
      }
    });
  });
});
