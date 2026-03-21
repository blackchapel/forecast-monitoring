import React, { useMemo, type JSX } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { type ChartData, type FetchStatus } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  data: ChartData;
  status: FetchStatus;
  message: string;
}

/**
 * Renders a responsive line chart visualizing actual and forecasted power data.
 *
 * @param data - The chart data containing labels, actuals, and forecasts.
 * @param status - The current fetch status indicating loading, success, or error.
 * @param message - A message to display during loading or error states.
 * @returns {JSX.Element} A styled chart component with overlays for loading and error states.
 */
export const ForecastChart: React.FC<Props> = ({
  data,
  status,
  message,
}: Props): JSX.Element => {
  const chartConfig = useMemo(
    () => ({
      labels: data.labels,
      datasets: [
        {
          label: "Actual Power (MW)",
          data: data.actuals,
          borderColor: "#1a73e8",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#1a73e8",
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.3,
          spanGaps: false,
        },
        {
          label: "Forecasted Power (MW)",
          data: data.forecasts,
          borderColor: "#10b981",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#059669",
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.3,
          spanGaps: true,
        },
      ],
    }),
    [data],
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" as const },
    scales: {
      x: {
        title: {
          display: true,
          text: "Target Time End (UTC)",
          color: "#64748b",
          font: { family: "Inter", weight: 500, size: 13 },
        },
        grid: { display: false },
        ticks: {
          maxTicksLimit: 8,
          color: "#64748b",
          font: { family: "Inter" },
        },
      },
      y: {
        title: {
          display: true,
          text: "Power (MW)",
          color: "#64748b",
          font: { family: "Inter", weight: 500, size: 13 },
        },
        grid: { color: "#f1f5f9" },
        ticks: {
          color: "#64748b",
          font: { family: "Inter" },
          callback: (value: any) =>
            value >= 1000 ? `${value / 1000}k` : value,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true, font: { family: "Inter", weight: 500 } },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        titleFont: { family: "Inter", size: 13 },
        bodyFont: { family: "Inter", size: 14, weight: "bold" as const },
      },
    },
  };

  return (
    <div className="relative h-[450px] w-full mt-2">
      {status !== "success" && status !== "idle" && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl transition-opacity">
          {status === "loading" && (
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
          )}
          <p
            className={`font-medium text-sm ${status === "error" ? "text-red-500 max-w-[80%] text-center" : "text-slate-500"}`}
          >
            {message}
          </p>
        </div>
      )}
      <Line data={chartConfig} options={options} />
    </div>
  );
};
