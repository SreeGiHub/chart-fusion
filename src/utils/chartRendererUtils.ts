
import { ChartDataPoint, ChartType } from "@/types";

/**
 * Check if a chart type is a text-based chart type
 */
export const isTextChartType = (type: ChartType): boolean => {
  return type === "text";
};

/**
 * Safely add values which might be of different types
 */
export const safelyAddValues = (a: any, b: any): number => {
  const numA = typeof a === 'number' ? a : 0;
  const numB = typeof b === 'number' ? b : 0;
  return numA + numB;
};

/**
 * Safely extract Y value from complex data points
 */
export const getYValue = (point: ChartDataPoint): number => {
  if (typeof point === 'number') {
    return point;
  } else if (point && typeof point === 'object' && 'y' in point) {
    return typeof point.y === 'number' ? point.y : 0;
  }
  return 0;
};

/**
 * Process chart data for rendering
 */
export const prepareChartData = (labels: string[], datasets: any[]) => {
  return labels.map((label, index) => {
    const dataPoint: any = { name: label };
    
    datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.hidden) {
        const key = dataset.label || `dataset-${datasetIndex}`;
        dataPoint[key] = getYValue(dataset.data[index]);
      }
    });
    
    return dataPoint;
  });
};
