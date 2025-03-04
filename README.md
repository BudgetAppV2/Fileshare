# BudgetApp Web Application

## Overview

**Purpose:**  
BudgetApp is a budgeting application that allows users to track daily transactions, visualize expenses via graphs, and manage budgets across categories. It helps users gain real-time insights into their spending habits and available funds while supporting both weekly and monthly views.

**Key Features:**  
- **Daycards:**  
  - Displays daily transactions.
  - Toggle between weekly and monthly views.
  - Navigation controls for moving to previous/next week or month.
- **Graphs:**  
  - Visual representations of revenues vs. expenses.
  - Pie chart displaying expense breakdown by category.
  - Navigation to view data by week or month.
- **Progress:**  
  - A detailed list of transactions categorized for monitoring budget performance.
  - Uses the same unified data as the graphs for consistency.
- **Form:**  
  - A user-friendly form for adding new transactions.
- **Budget:**  
  - Displays allocated budgets, available funds (dynamically calculated), and a mechanism for moving funds between categories.
  - Available funds are updated based on current month revenues, recurring expenses, rollovers from the previous month, and current expenses.

## Current Challenges

- **Data Synchronization:**  
  Inconsistent values for available funds due to outdated or mixed calculation methods.
- **Navigation Issues:**  
  Confusing navigation in daycards and graph sections, where weekly data sometimes overrides monthly values.
- **Local Storage vs. Fresh Data:**  
  Allowed budgets are stored locally, but dynamic values (e.g., current expenses and available funds) must always reflect the latest sheet data.
- **Transaction Classification:**  
  Some recurring transactions and revenue items (especially in the Santé category) are not being handled as expected.
- **API Token Handling:**  
  Issues with token refresh and API call errors (e.g., 401 Unauthorized) impacting data retrieval.

## Project Vision & Goals

- **Unified Data Handling:**  
  Use a single function (or a set of functions) such as `getTransactionBreakdown` to provide consistent data across the graphs and progress sections.
- **Optimized Navigation:**  
  Each section (daycards, graphs, progress) will have its own independent navigation controls (prev/next for week or month) that do not interfere with one another.
- **Dynamic Updates:**  
  Available funds and category expenses update in real-time (or near-real time) based on live sheet data.
- **Robust Backend:**  
  Transition from test mode to a permanent API backend using Firebase Functions (or another solution) with long-lived tokens.
- **Zero-Based Budgeting:**  
  Optionally include an "Économie" category to track savings.

## Data Flow & Calculations

- **Fonds Disponible Calculation:**  
Available Funds = (Total Revenues for current month)
                  + (Recurring Expenses for current month)
                  + (Roll-over from last month: totalUnspent - totalOverspending)
                  - (Sum of Allowed Budgets for all categories)
- **Transaction Classification:**  
- **Basic Categories (5):** Épicerie, Transport, Resto, Santé, Loisirs.
- **Autres:** Transactions that do not match any of the basic categories.
- **Récurrent:** Transactions with a recurrence ID (note: recurring revenues in Santé are excluded).
- **Special Case – Santé:**  
  The Santé category includes both expense transactions and certain revenues (e.g., insurance reimbursements).

## Roadmap & Next Steps

1. **Initial Code Cleanup:**  
 - Refactor and remove obsolete functions.
 - Modularize the code (split into files by section if needed).

2. **Implement Unified Data Functions:**  
 - Consolidate functions like `getTransactionBreakdown`, `getTotalRevenues`, and `getTotalExpenses` to ensure consistency across sections.

3. **Improve Navigation:**  
 - Set up separate navigation controls for:
   - **Daycards:** Independent prev/next navigation for week/month views.
   - **Graphs:** Separate navigation controls for weekly and monthly data.
   - **Progress:** Similar navigation controls for viewing transactions by date range.

4. **Backend API Setup:**  
 - Transition the API to Firebase Functions (or your preferred backend).
 - Implement long-lived tokens or an automatic token refresh system for permanent deployment.

5. **Testing & Debugging:**  
 - Write tests or add logging to verify calculations (e.g., available funds, transaction breakdown).
 - Validate transaction classification rules with sample data.

6. **Deployment:**  
 - Configure the project for Firebase Hosting.
 - Ensure API calls work correctly in production (resolve any CORS or token issues).

## How to Contribute / Use

- **Local Development:**  
- Clone the repository.
- Use Visual Studio Code with Live Server for local testing.
- Run `npm install` if necessary for dependencies.

- **Deployment:**  
- Use Firebase CLI (`firebase deploy`) to deploy to Firebase Hosting.

- **Future Enhancements:**  
- Add features like reallocation of funds from categories back to available funds.
- Optionally implement an "Économie" (savings) category.
- Improve UI responsiveness and mobile optimization.

## License

(Include your license details here.)
