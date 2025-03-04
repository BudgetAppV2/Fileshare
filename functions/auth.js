// functions/auth.js
import { GoogleAuth } from 'google-auth-library';
import CONFIG from './config.js';

export async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: CONFIG,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}
