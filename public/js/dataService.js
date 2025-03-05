// public/js/dataService.js
// If you want to import configuration from a JSON file, ensure it's available to the frontend.
// For simplicity, you can also hardcode the sheet ID (or use a separate config file for the frontend).
const SHEET_ID = '1h9jMrBRBkDiduNSMolQp80TvhUr_5_5yDbQlBVc21ms';
// Use your Cloud Function URL from the emulator. (Update this URL when deploying.)
const CLOUD_FUNCTION_URL = 'http://127.0.0.1:5001/budgetappv2-c53a6/us-central1/getSheetData';

export async function fetchSheetData() {
  console.log("📡 Calling fetchSheetData...");
  try {
      const response = await fetch("http://127.0.0.1:5001/budgetappv2-c53a6/us-central1/getSheetData?sheetId=1h9jMrBRBkDiduNSMolQp80TvhUr_5_5yDbQlBVc21ms");
      const data = await response.json();
      console.log("📄 Raw data received from API:", data);
      
      if (!data || !data.data) {
          console.warn("⚠️ No data received from API.");
          return { data: [] }; // Return an empty array to avoid errors
      }

      return data;
  } catch (error) {
      console.error("❌ Error fetching data:", error);
      return { data: [] };
  }
}

