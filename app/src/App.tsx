import { useState } from "react";
import { ForecastChart } from "./components/Chart";
import { useDebounce } from "./hooks/useDebounce";
import { useData } from "./hooks/useData";

function App() {
  const [start, setStart] = useState<string>("2024-01-01T08:00");
  const [end, setEnd] = useState<string>("2024-01-02T08:00");
  const [forecastHorizon, setForecastHorizon] = useState<number>(4);

  const debouncedHorizon = useDebounce<number>(forecastHorizon, 400);

  const { status, message, chartData } = useData(
    `${start}:00Z`,
    `${end}:00Z`,
    debouncedHorizon,
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 md:p-8 flex justify-center font-sans">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Wind Generation: Actual vs Forecast
          </h1>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
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
                onChange={(e) => {
                  setStart(e.target.value);
                  e.currentTarget.blur();
                }}
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
                onChange={(e) => {
                  setEnd(e.target.value);
                  e.currentTarget.blur();
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Forecast Horizon</label>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {forecastHorizon} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="1"
                value={forecastHorizon}
                onChange={(e) => setForecastHorizon(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600 [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&:hover::-moz-range-thumb]:bg-blue-600"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <ForecastChart data={chartData} status={status} message={message} />
        </section>
      </div>
    </div>
  );
}

export default App;
