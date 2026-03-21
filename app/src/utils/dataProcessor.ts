import { type ApiData, type ChartData } from "../types";

const STEP_MS = 30 * 60 * 1_000;
const MS_PER_HOUR = 3_600_000;

/**
 * Processes forecast and actual generation datasets to produce chart-ready data.
 *
 * @param forecastData - Array of forecast data objects, each containing a start time, publish time, and generation value.
 * @param actualData - Array of actual data objects, each containing a start time and generation value.
 * @param from - ISO string representing the start of the time range (inclusive).
 * @param to - ISO string representing the end of the time range (inclusive).
 * @param forecastHorizon - The forecast horizon in hours; forecasts published after (target time - forecastHorizon) are ignored.
 * @returns {ChartData}
 */
export const processDatasets = (
  forecastData: ApiData[],
  actualData: ApiData[],
  from: string,
  to: string,
  forecastHorizon: number,
): ChartData => {
  const startMs = new Date(from).getTime();
  const endMs = new Date(to).getTime();

  if (startMs > endMs) {
    return { labels: [], actuals: [], forecasts: [] };
  }

  const horizonMs = forecastHorizon * MS_PER_HOUR;

  const actualByTime = new Map<number, number | null>(
    actualData.map((d) => [new Date(d.startTime).getTime(), d.generation]),
  );

  type ForecastEntry = { publishMs: number; generation: number | null };
  const forecastsByTime = new Map<number, ForecastEntry[]>();

  for (const d of forecastData) {
    if (!d.publishTime) continue;

    const startTimeMs = new Date(d.startTime).getTime();
    const publishMs = new Date(d.publishTime).getTime();

    const bucket = forecastsByTime.get(startTimeMs);
    const entry: ForecastEntry = { publishMs, generation: d.generation };

    if (bucket) {
      bucket.push(entry);
    } else {
      forecastsByTime.set(startTimeMs, [entry]);
    }
  }

  const slotCount = Math.floor((endMs - startMs) / STEP_MS) + 1;
  const result: ChartData = {
    labels: new Array(slotCount),
    actuals: new Array(slotCount),
    forecasts: new Array(slotCount),
  };

  let idx = 0;

  for (let t = startMs; t <= endMs; t += STEP_MS) {
    const date = new Date(t);

    result.labels[idx] = [
      date.toISOString().substring(11, 16),
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
    ];

    result.actuals[idx] = actualByTime.get(t) ?? null;

    const cutoffMs = t - horizonMs;
    const candidates = forecastsByTime.get(t);
    result.forecasts[idx] = pickLatestValidForecast(candidates, cutoffMs);

    idx++;
  }

  return result;
};

/**
 * Returns the generation value of the candidate with the latest publishMs
 * that is still ≤ cutoffMs, or null if no valid candidate exists.
 *
 * @param {Array<{publishMs: number; generation: number | null}>} [candidates] - Array of forecast candidates with publish time and generation value
 * @param {number} cutoffMs - The maximum publish time (in milliseconds) for a valid forecast
 * @returns {number | null} The generation value of the latest valid forecast, or null if no valid candidate exists
 */
function pickLatestValidForecast(
  candidates:
    | Array<{ publishMs: number; generation: number | null }>
    | undefined,
  cutoffMs: number,
): number | null {
  if (!candidates || candidates.length === 0) return null;

  let bestPublishMs = -Infinity;
  let bestGeneration: number | null = null;

  for (const { publishMs, generation } of candidates) {
    if (publishMs <= cutoffMs && publishMs > bestPublishMs) {
      bestPublishMs = publishMs;
      bestGeneration = generation;
    }
  }

  return bestPublishMs === -Infinity ? null : bestGeneration;
}
