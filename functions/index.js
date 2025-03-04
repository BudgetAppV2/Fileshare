import { onRequest } from 'firebase-functions/v2/https';
import { getAccessToken } from './auth.js';
import CONFIG from './config.js';
import { google } from 'googleapis';

export const getSheetData = onRequest(async (req, res) => {
  try {
    // Option 1: Use your getAccessToken to get a token (if needed)
    const token = await getAccessToken();

    // Create an authenticated client using a JWT (service account) 
    const authClient = new google.auth.JWT(
      CONFIG.client_email,
      null,
      CONFIG.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    // Authorize the client.
    await authClient.authorize();

    // Create a Sheets API client.
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Determine which sheet ID to use.
    // Use the sheetId from the query parameter if provided, otherwise fallback to CONFIG.SHEET_ID.
    const spreadsheetId = req.query.sheetId || CONFIG.SHEET_ID;

    // Define the range to fetch. Adjust this as needed, e.g., "Calendar!A:G" or "Budgets!A:B".
    const range = 'Calendar!A:G';

    // Fetch data from the Google Sheet.
    const sheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    // Return the fetched data.
    res.status(200).json({
      data: sheetResponse.data.values,
      sheetId: spreadsheetId,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
