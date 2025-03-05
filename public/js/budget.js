console.log("budget.js loaded");

import { dateManager } from "./dateManager.js";
import { getTotalRevenues, getRecurringExpenses, fetchBudgetProgress } from "./api.js";

const sectionName = "budget"; // Unique identifier for this section
dateManager.initSection(sectionName);

export let categories = {};
export let allowedCategories = [];
export let totalFunds = 0;

// ==========================
// 📅 Get Budget Date Range
// ==========================
function getBudgetDateRange() {
    return dateManager.getDateRange(sectionName);
}

// ==========================
// 📊 Calculate Last Month Stats
// ==========================
export function calculateLastMonthStats() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    if (currentMonth === 2) {
        console.log("Current month is February; ignoring last month's data.");
        return { totalUnspent: 0, totalOverspending: 0 };
    }

    let totalUnspent = 0, totalOverspending = 0;
    const unspentDetails = [], overspendingDetails = [];

    for (let cat in categories) {
        const data = categories[cat];
        if (data.spent < data.budget) {
            const unspent = data.budget - data.spent;
            totalUnspent += unspent;
            unspentDetails.push(`${cat}: Budget ${data.budget} - Spent ${data.spent} = Unspent ${unspent}`);
        } else if (data.spent > data.budget) {
            const over = data.spent - data.budget;
            totalOverspending += over;
            overspendingDetails.push(`${cat}: Spent ${data.spent} - Budget ${data.budget} = Over ${over}`);
        }
    }

    console.log("Categories contributing to Unspent:", unspentDetails.join(" | "));
    console.log("Categories contributing to Overspending:", overspendingDetails.join(" | "));
    console.log("Total Unspent:", totalUnspent, "Total Overspending:", totalOverspending);

    return { totalUnspent, totalOverspending };
}

// ==========================
// 💰 Calculate Available Funds
// ==========================
export async function calculateFondsDisponibles() {
    const { startDate, endDate } = getBudgetDateRange();
    console.log(`📅 Budget Range: ${startDate} → ${endDate}`);

    const currentRevenues = await getTotalRevenues(startDate, endDate);
    console.log("💰 Current Revenues:", currentRevenues);

    const recurringExpenses = await getRecurringExpenses(startDate, endDate);
    console.log("📉 Recurring Expenses:", recurringExpenses);

    const { totalUnspent, totalOverspending } = calculateLastMonthStats();
    console.log("📊 Total Unspent (last month):", totalUnspent);
    console.log("📊 Total Overspending (last month):", totalOverspending);

    const rollOver = totalUnspent - totalOverspending;
    console.log("🔄 Roll Over:", rollOver);

    const rawFonds = currentRevenues + recurringExpenses + rollOver;
    console.log("💰 Raw Funds (Revenues + Recurring Expenses + Roll Over):", rawFonds);

    let totalAllowed = 0;
    for (let cat in categories) {
        totalAllowed += categories[cat].budget;
    }
    console.log("📊 Total Allowed Budgets:", totalAllowed);

    const availableFunds = rawFonds - totalAllowed;
    console.log("📌 Available Funds (Fonds Disponible):", availableFunds);

    return availableFunds;
}

// ==========================
// 🏦 Update Funds Display
// ==========================
export function updateFundsDisplay() {
    const availableFundsElem = document.getElementById("availableFunds");
    if (availableFundsElem) {
        availableFundsElem.textContent = `$${totalFunds}`;
    }
}

// ==========================
// 🗂️ Update Categories Display
// ==========================
export function updateCategoriesDisplay() {
    console.log("🔄 Updating categories display for:", Object.keys(categories));

    const categoriesContainer = document.getElementById("categoriesContainer");
    const overspendingDisplay = document.getElementById("overspending");
    if (!categoriesContainer || !overspendingDisplay) return;

    categoriesContainer.innerHTML = "";

    const { startDate, endDate } = getBudgetDateRange();
    console.log(`📅 Using budget range: ${startDate} - ${endDate}`);

    if (!categories.hasOwnProperty("Autres")) {
        categories["Autres"] = { budget: 0, spent: 0 };
        allowedCategories.push("Autres");
        console.log("✅ Added fallback 'Autres' category.");
    } else {
        categories["Autres"].spent = 0;
    }

    let overspendingTotal = 0;
    Object.entries(categories).forEach(([name, data]) => {
        const overspent = data.budget > 0 ? Math.max(0, data.spent - data.budget) : 0;
        overspendingTotal += overspent;
        const progress = data.budget > 0 ? Math.min(100, (data.spent / data.budget) * 100) : 0;
        const progressColor = overspent > 0 ? "red" : "blue";

        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category-item";
        categoryDiv.innerHTML = `
            <div class="category-header">
                <span class="category-label">${name} - Budget: $${data.budget}</span>
                <input type="number" value="${data.spent}" min="0" class="spent-input" data-category="${name}">
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progress}%; background-color: ${progressColor};"></div>
            </div>
            <div class="move-funds">
                <select class="move-category" data-from="${name}">
                    <option value="">Déplacer vers...</option>
                    ${Object.keys(categories).map(cat => (cat !== name ? `<option value="${cat}">${cat}</option>` : "")).join("")}
                    <option value="fondsDisponible">Fonds Disponible</option>
                </select>
            </div>
        `;
        categoriesContainer.appendChild(categoryDiv);
    });

    overspendingDisplay.textContent = `$${overspendingTotal}`;
}

// ==========================
// 🚀 Initialize Budget Allocation
// ==========================
export async function initBudgetAllocation() {
    console.log("🔄 Before init, allocatedCategories:", localStorage.getItem("allocatedCategories"));
    const storedCategories = localStorage.getItem("allocatedCategories");
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
        console.log("✅ Loaded allocated budgets from localStorage.");
    }

    await fetchBudgetProgress(); // Fetch dynamic data from API
    totalFunds = await calculateFondsDisponibles();
    updateFundsDisplay();
    updateCategoriesDisplay();
}

// ==========================
// 💾 Save Allocations
// ==========================
export function saveAllocations() {
    localStorage.setItem("allocatedCategories", JSON.stringify(categories));
    console.log("💾 Saved allocations:", categories);
}

// ==========================
// 🔄 Listen for Global Date Updates
// ==========================
document.addEventListener("dateRangeUpdated", (event) => {
    const { section, startDate, endDate, view } = event.detail;
    if (section === sectionName) {
        console.log(`💰 Updating Budget: ${startDate} → ${endDate} (View: ${view})`);
        updateCategoriesDisplay();
    }
});
