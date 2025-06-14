
import { ChartData, ChartDataPoint, ChartType } from "@/types";
import { DEFAULT_COLORS } from "./types";

export function getRandomData(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 100));
}

export function generateExampleData(type: ChartType): ChartData {
  switch (type) {
    case "bar":
    case "line":
    case "area":
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Dataset 1",
            data: getRandomData(6),
            backgroundColor: DEFAULT_COLORS[0],
            borderColor: DEFAULT_COLORS[0],
          },
        ],
      };
    case "pie":
    case "donut":
      return {
        labels: ["Category 1", "Category 2", "Category 3", "Category 4"],
        datasets: [
          {
            label: "Dataset 1",
            data: getRandomData(4),
            backgroundColor: DEFAULT_COLORS.slice(0, 4),
          },
        ],
      };
    case "scatter":
      return {
        labels: ["Group A", "Group B", "Group C"],
        datasets: [
          {
            label: "Dataset 1",
            data: [
              { x: 10, y: 20 },
              { x: 30, y: 40 },
              { x: 50, y: 60 },
            ] as ChartDataPoint[],
            backgroundColor: DEFAULT_COLORS[0],
          },
        ],
      };
    default:
      return {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
          },
        ],
      };
  }
}
