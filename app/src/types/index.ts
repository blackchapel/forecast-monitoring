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
