import { type ApiData, type ChartData } from "../types";

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
  const endTargetTime = new Date(to).getTime();
  const result: ChartData = { labels: [], actuals: [], forecasts: [] };

  let current = new Date(from);

  while (current.getTime() <= endTargetTime) {
    const targetTime = current.getTime();

    const labelTime = current.toISOString().substring(11, 16);
    const labelDate = current.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    result.labels.push([labelTime, labelDate]);

    const actualMatch = actualData.find(
      (d) => new Date(d.startTime).getTime() === targetTime,
    );
    result.actuals.push(actualMatch ? actualMatch.generation : null);

    const cutoffMs = targetTime - forecastHorizon * 3600000;
    const validForecasts = forecastData.filter((d) => {
      if (!d.publishTime) return false;
      const dStartTime = new Date(d.startTime).getTime();
      const dPublishTime = new Date(d.publishTime).getTime();
      return dStartTime === targetTime && dPublishTime <= cutoffMs;
    });

    if (validForecasts.length > 0) {
      validForecasts.sort(
        (a, b) =>
          new Date(b.publishTime!).getTime() -
          new Date(a.publishTime!).getTime(),
      );
      result.forecasts.push(validForecasts[0].generation);
    } else {
      result.forecasts.push(null);
    }

    current.setMinutes(current.getMinutes() + 30);
  }

  return result;
};
