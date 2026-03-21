import { useState, useEffect, useCallback } from "react";
import {
  fetchForecast,
  fetchActual,
  FORECAST_FETCH_BUFFER_HOURS,
} from "../apis";
import { processDatasets } from "../utils/dataProcessor";
import { type DataState } from "../types";

export const useData = (from: string, to: string, forecastHorizon: number) => {
  const [state, setState] = useState<DataState>({
    status: "idle",
    message: "",
    chartData: { labels: [], actuals: [], forecasts: [] },
  });

  const loadData = useCallback(async () => {
    if (!from || !to) return;
    if (from >= to) {
      setState((s) => ({
        ...s,
        status: "error",
        message: "Start Time must be before End Time.",
        chartData: { labels: [], actuals: [], forecasts: [] },
      }));
      return;
    }
    if (!from.startsWith("2024-01") || !to.startsWith("2024-01")) {
      setState((s) => ({
        ...s,
        status: "error",
        message: "Please select dates within January 2024.",
        chartData: { labels: [], actuals: [], forecasts: [] },
      }));
      return;
    }

    setState((s) => ({
      ...s,
      status: "loading",
      message: "Fetching Data...",
    }));

    try {
      const targetStart = new Date(from);
      const fetchFromForecast = new Date(
        targetStart.getTime() -
          (forecastHorizon + FORECAST_FETCH_BUFFER_HOURS) * 3600000,
      ).toISOString();

      const promises = [];
      promises.push(fetchForecast(fetchFromForecast, to));
      promises.push(fetchActual(from, to));

      const results = await Promise.all(promises);
      const forecastData = results[0];
      const actualData = results.length === 2 ? results[1] : results[0];

      setState((s) => ({ ...s, message: "Processing visual data..." }));

      const processed = processDatasets(
        forecastData,
        actualData,
        from,
        to,
        forecastHorizon,
      );

      if (processed.labels.length > 0) {
        setState({ status: "success", message: "", chartData: processed });
      } else {
        setState((s) => ({
          ...s,
          status: "error",
          message: "No data mapped for this range.",
        }));
      }
    } catch (err) {
      setState((s) => ({
        ...s,
        status: "error",
        message: "Something went wrong.",
      }));
    }
  }, [from, to, forecastHorizon]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return state;
};
