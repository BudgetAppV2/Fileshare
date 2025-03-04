// public/js/dataService.js
// If you want to import configuration from a JSON file, ensure it's available to the frontend.
// For simplicity, you can also hardcode the sheet ID (or use a separate config file for the frontend).
const SHEET_ID = '1h9jMrBRBkDiduNSMolQp80TvhUr_5_5yDbQlBVc21ms';
// Use your Cloud Function URL from the emulator. (Update this URL when deploying.)
const CLOUD_FUNCTION_URL = 'http://127.0.0.1:5001/budgetappv2-c53a6/us-central1/getSheetData';

export async function fetchSheetData() {
  console.log("fetchSheetData called"); // Debug log
  try {
    const url = `${CLOUD_FUNCTION_URL}?sheetId=${SHEET_ID}`;
    console.log("Fetching URL:", url);
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    console.log("Data received:", data);  // Debug log
    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

