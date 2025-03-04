console.log("progress.js loaded");

/**
 * Displays the transactions (grouped by category) in the Progress section.
 * @param {string} viewType - Either "week" or "month"
 */
function displayTransactionsSection(viewType) {
  console.log("displayTransactionsSection called with viewType:", viewType);
  console.log("allowedCategories:", allowedCategories);

  // Determine the date range based on viewType.
  let startDate, endDate;
  if (viewType === "month") {
    const { start, end } = getMonthRange(new Date());
    startDate = start.toISOString().split("T")[0];
    endDate = end.toISOString().split("T")[0];
  } else {
    // For weekly view, use the global week range.
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

  // Get the container element where transactions are displayed.
  const container = document.getElementById("transactionsContainer");
  if (!container) {
    console.error("transactionsContainer element not found!");
    return;
  }
  container.innerHTML = ""; // Clear previous content.

  // Check if there are any allowed categories.
  if (!allowedCategories || allowedCategories.length === 0) {
    container.innerHTML = "<p>Aucune catégorie disponible.</p>";
    return;
  }

  // Loop through each allowed category and display its transactions.
  allowedCategories.forEach(category => {
    // Get transactions for this category within the date range.
    let transactions = getTransactionsForCategory(category, startDate, endDate);

    // Calculate the total amount for these transactions.
    let total = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    // Create a container for this category.
    let categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-transactions");

    // Create a header that shows the category and total.
    let header = document.createElement("h2");
    header.textContent = `${category} - Total: ${formatCurrency(total)}`;
    categoryDiv.appendChild(header);

    // Create a button to toggle the transactions list.
    let toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Voir Transactions";
    toggleBtn.classList.add("toggle-transactions-btn");
    toggleBtn.addEventListener("click", function () {
      let listDiv = categoryDiv.querySelector(".transactions-list");
      if (listDiv) {
        // Toggle visibility.
        listDiv.style.display = listDiv.style.display === "none" ? "block" : "none";
      } else {
        // Create and display the transactions list.
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

    // Append the category block to the main container.
    container.appendChild(categoryDiv);
  });
}

// Event listeners for Progress section navigation buttons.
document.addEventListener("DOMContentLoaded", function () {
  const weeklyBtn = document.getElementById("weeklyProgressBtn");
  const monthlyBtn = document.getElementById("monthlyProgressBtn");

  if (weeklyBtn) {
    weeklyBtn.addEventListener("click", function () {
      displayTransactionsSection("week");
    });
  }
  if (monthlyBtn) {
    monthlyBtn.addEventListener("click", function () {
      displayTransactionsSection("month");
    });
  }
});
