// budget.js
import { getMonthRange, normalizeNumber } from './utils.js';
import { getTotalRevenues, getRecurringExpenses, fetchBudgetProgress } from './api.js';

// Global variables (could be refactored later)
export let categories = {};
export let allowedCategories = [];
export let totalFunds = 0;

// Calculates the stats for last month.
export function calculateLastMonthStats() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    if (currentMonth === 2) {
        console.log("Current month is February; ignoring last month's data.");
        return { totalUnspent: 0, totalOverspending: 0 };
    }
    let totalUnspent = 0;
    let totalOverspending = 0;
    const unspentDetails = [];
    const overspendingDetails = [];

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

export async function calculateFondsDisponibles() {
    const now = new Date();
    const { start: currentStart, end: currentEnd } = getMonthRange(now);
    const startStr = currentStart.toISOString().split("T")[0];
    const endStr = currentEnd.toISOString().split("T")[0];

    const currentRevenues = await getTotalRevenues(startStr, endStr);
    console.log("Current Revenues:", currentRevenues);

    const recurringExpenses = await getRecurringExpenses(currentStart, currentEnd);
    console.log("Recurring Expenses:", recurringExpenses);

    const { totalUnspent, totalOverspending } = calculateLastMonthStats();
    console.log("Total Unspent (last month):", totalUnspent);
    console.log("Total Overspending (last month):", totalOverspending);

    const rollOver = totalUnspent - totalOverspending;
    console.log("Roll Over:", rollOver);

    const rawFonds = currentRevenues + recurringExpenses + rollOver;
    console.log("Raw Funds (Revenues + Recurring Expenses + Roll Over):", rawFonds);

    let totalAllowed = 0;
    for (let cat in categories) {
        totalAllowed += categories[cat].budget;
    }
    console.log("Total Allowed Budgets:", totalAllowed);

    const availableFunds = rawFonds - totalAllowed;
    console.log("Available Funds (Fonds Disponible):", availableFunds);

    return availableFunds;
}

export function updateFundsDisplay() {
    const availableFundsElem = document.getElementById("availableFunds");
    if (availableFundsElem) {
        availableFundsElem.textContent = `$${totalFunds}`;
    }
}

export function updateCategoriesDisplay() {
    console.log("Updating categories display for:", Object.keys(categories));
    const categoriesContainer = document.getElementById("categoriesContainer");
    const overspendingDisplay = document.getElementById("overspending");
    if (!categoriesContainer || !overspendingDisplay) return;
    categoriesContainer.innerHTML = "";

    const { start: currentStart, end: currentEnd } = getMonthRange(new Date());
    const startDate = currentStart.toISOString().split("T")[0];
    const endDate = currentEnd.toISOString().split("T")[0];

    if (!categories.hasOwnProperty("Autres")) {
        categories["Autres"] = { budget: 0, spent: 0 };
        allowedCategories.push("Autres");
        console.log("Added fallback 'Autres' category.");
    } else {
        categories["Autres"].spent = 0;
    }

    // Update spending for "Autres"
    // Here, you need to pass the transactions data if available:
    // categories["Autres"].spent = calculateAutresExpenses(startDate, endDate, calendarData);

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

export async function initBudgetAllocation() {
    console.log("Before init, allocatedCategories:", localStorage.getItem("allocatedCategories"));
    const storedCategories = localStorage.getItem("allocatedCategories");
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
        console.log("Loaded allocated budgets from localStorage.");
    }
    // Fetch dynamic data and update global calendarData if needed.
    await fetchBudgetProgress(); // Make sure this function is implemented in your api.js module.
    totalFunds = await calculateFondsDisponibles();
    updateFundsDisplay();
    updateCategoriesDisplay();
}

export function saveAllocations() {
    localStorage.setItem("allocatedCategories", JSON.stringify(categories));
    console.log("Saved allocations:", categories);
}
