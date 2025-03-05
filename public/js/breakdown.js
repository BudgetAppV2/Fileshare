console.log("breakdown.js loaded");

import { getMonthRange, normalizeNumber } from './utils.js'; // Ensure these are available

/**
 * Returns an object with the total expenses/revenues for each category
 * within the given date range.
 *
 * @param {Array} calendarData - Array of transaction data.
 * @param {string} viewType - "week" or "month"
 * @param {Object} customRange - Optional custom range with start and end Dates.
 * @returns {object} breakdown
 */
export function getTransactionBreakdown(calendarData, viewType, customRange) {
    let startDate, endDate;
    if (viewType === "month") {
        if (customRange && customRange.start && customRange.end) {
            startDate = customRange.start.toISOString().split("T")[0];
            endDate = customRange.end.toISOString().split("T")[0];
        } else {
            const { start, end } = getMonthRange(new Date());
            startDate = start.toISOString().split("T")[0];
            endDate = end.toISOString().split("T")[0];
        }
    } else {
        if (!window.currentWeekStartDate || !window.currentWeekEndDate) {
            console.error("Week range not defined – defaulting to today");
            const today = new Date();
            startDate = today.toISOString().split("T")[0];
            endDate = today.toISOString().split("T")[0];
        } else {
            startDate = window.currentWeekStartDate.toISOString().split("T")[0];
            endDate = window.currentWeekEndDate.toISOString().split("T")[0];
        }
    }

    // Define allowed categories (should match your budgets sheet)
    const allowed = ["épicerie", "transport", "resto", "santé", "loisirs"];
    let breakdown = {};
    allowed.forEach(cat => {
        breakdown[cat] = 0;
    });
    breakdown["autres"] = 0;
    breakdown["récurrent"] = 0;

    if (!calendarData || calendarData.length <= 1) {
        console.log("Fetched Data:", calendarData);
        console.warn("No calendar data available.");
        return breakdown;
    }

    // Process each transaction (starting at index 1, assuming header is at 0)
    for (let i = 1; i < calendarData.length; i++) {
        let [rawDate, type, description, , normalizedAmount, , recurrenceID] = calendarData[i];
        let txDate = new Date(rawDate + "T00:00:00");
        if (txDate < new Date(startDate) || txDate > new Date(endDate)) continue;
        const amt = normalizeNumber(normalizedAmount);
        const descLower = description.trim().toLowerCase();

        if (type === "Revenu") {
            if (descLower === "santé") {
                breakdown["santé"] += amt;
                console.log(`Revenu for santé added: ${amt} from "${description}"`);
            }
            continue;
        }

        if (recurrenceID) {
            breakdown["récurrent"] += amt;
            console.log(`Recurring expense added: ${amt} for "${description}"`);
        } else {
            let found = false;
            allowed.forEach(cat => {
                if (descLower === cat) {
                    console.log(`Expense matched: ${amt} for "${description}" equals allowed category "${cat}"`);
                    breakdown[cat] += amt;
                    found = true;
                }
            });
            if (!found) {
                breakdown["autres"] += amt;
                console.log(`Expense added to "autres": ${amt} for "${description}"`);
            }
        }
    }
    console.log("Unified Transaction Breakdown:", breakdown);
    return breakdown;
}
