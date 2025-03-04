// public/js/api.js

const BASE_API_URL = 'http://localhost:4000'; // Update for production

// Helper to build URLs for Cloud Functions endpoints.
function buildEndpoint(path, params = {}) {
  const url = new URL(`${BASE_API_URL}/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}

// Fetch total revenues for the given date range.
export async function getTotalRevenues(start, end) {
  const url = buildEndpoint('getTotalRevenues', { start, end });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  return data.totalRevenues; // Adjust based on your API response
}

// Fetch recurring expenses for the given date range.
export async function getRecurringExpenses(startDate, endDate) {
  const url = buildEndpoint('getRecurringExpenses', { start: startDate.toISOString(), end: endDate.toISOString() });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  return data.recurringExpenses; // Adjust based on your API response
}

// Fetch budget progress data (updates calendarData)
export async function fetchBudgetProgress() {
  const url = buildEndpoint('getBudgetProgress');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  // Assume data contains updated calendarData.
  // Update your global calendarData variable accordingly, or return it.
  return data.calendarData;
}
