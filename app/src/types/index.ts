export interface ApiData {
  dataset: string;
  startTime: string;
  publishTime?: string;
  generation: number;
}

export interface ChartData {
  labels: string[][];
  actuals: (number | null)[];
  forecasts: (number | null)[];
}

export type FetchStatus = "idle" | "loading" | "error" | "success";

export interface DataState {
  status: FetchStatus;
  message: string;
  chartData: ChartData;
}
