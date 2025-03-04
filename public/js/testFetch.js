// testFetch.js

const { fetchSheetData } = require('./dataService');

(async () => {
  try {
    const data = await fetchSheetData();
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error during fetch:", error);
  }
})();
