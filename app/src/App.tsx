import { useEffect, useState } from "react";
import { type ApiData } from "./types";
import { fetchActual, fetchForecast } from "./apis";

function App() {
  const [start, setStart] = useState<string>("2024-01-01T08:00");
  const [end, setEnd] = useState<string>("2024-01-02T08:00");
  const [localHorizon, setLocalHorizon] = useState<number>(4);

  const [forecastData, setForecastData] = useState<ApiData[]>();
  const [actualData, setActualData] = useState<ApiData[]>();

  const fetchData = async () => {
    if (start < end) {
      setForecastData(await fetchForecast(start, end));
      setActualData(await fetchActual(start, end));
    }
  };

  useEffect(() => {
    fetchData();
  }, [start, end]);

  return (
    <div>
      <div>
        <header>
          <h1>Wind Generation: Actual vs Forecast</h1>
          <p>
            BMRS API Data &bull; Historical limits constrained to January 2024.
            <br />
            <strong>Note:</strong> Forecast points provided hourly. Actual
            points provided half-hourly.
          </p>
        </header>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Start Time (UTC)</label>
              <input
                type="datetime-local"
                value={start}
                min="2024-01-01T00:00"
                max="2024-01-31T23:59"
                onChange={(e) => setStart(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">End Time (UTC)</label>
              <input
                type="datetime-local"
                value={end}
                min="2024-01-01T00:00"
                max="2024-01-31T23:59"
                onChange={(e) => setEnd(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Forecast Horizon</label>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {localHorizon} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="1"
                value={localHorizon}
                onChange={(e) => setLocalHorizon(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
