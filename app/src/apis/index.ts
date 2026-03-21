import { type ApiData } from "../types";

const BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets";

/**
 * Fetches wind generation forecast data from the Elexon BMRS API.
 * @param {string} from - The start date and time in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
 * @param {string} to - The end date and time in ISO 8601 format (e.g., "2024-01-02T00:00:00Z")
 * @returns {Promise<ApiData[]>} A promise that resolves to an array of forecast data objects
 * @throws {Error} Throws an error if the HTTP response is not ok
 */
export const fetchForecast = async (
  from: string,
  to: string,
): Promise<ApiData[]> => {
  const url = `${BASE_URL}/WINDFOR/stream?publishDateTimeFrom=${from}&publishDateTimeTo=${to}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Forecast Data HTTP error: ${res.status}`);
  return res.json();
};

/**
 * Fetches actual wind generation data from the Elexon BMRS API.
 * @param {string} from - The start date and time in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
 * @param {string} to - The end date and time in ISO 8601 format (e.g., "2024-01-02T00:00:00Z")
 * @returns {Promise<ApiData[]>} A promise that resolves to an array of actual data objects
 * @throws {Error} Throws an error if the HTTP response is not ok
 */
export const fetchActual = async (
  from: string,
  to: string,
): Promise<ApiData[]> => {
  const startDate = from.split("T")[0];
  const endDate = to.split("T")[0];
  const url = `${BASE_URL}/FUELHH/stream?settlementDateFrom=${startDate}&settlementDateTo=${endDate}&fuelType=WIND`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Actual Data HTTP error: ${res.status}`);
  return res.json();
};
