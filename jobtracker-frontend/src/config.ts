export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("Missing REACT_APP_API_BASE_URL");
}
