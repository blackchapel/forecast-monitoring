import { type ApiData } from "../types";

const BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets";

export const fetchForecast = async (
  from: string,
  to: string,
): Promise<ApiData[]> => {
  const url = `${BASE_URL}/WINDFOR/stream?publishDateTimeFrom=${from}&publishDateTimeTo=${to}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Forecast Data HTTP error: ${res.status}`);
  return res.json();
};

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
