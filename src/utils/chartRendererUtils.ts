
import { ChartDataPoint, ChartType, ChartDataset } from "@/types";

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
  } else if (point && typeof point === 'object') {
    if ('y' in point && typeof point.y === 'number') {
      return point.y;
    }
    // Handle BoxPlotDataPoint type
    if ('median' in point && typeof point.median === 'number') {
      return point.median;
    }
  }
  return 0;
};

/**
 * Process chart data for rendering
 * This function keeps all datasets in the data but marks those with legendHidden
 * to be not displayed in the legend
 */
export const prepareChartData = (labels: string[], datasets: ChartDataset[]) => {
  return labels.map((label, index) => {
    const dataPoint: any = { name: label };
    
    datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.hidden) {
        // Always include the dataset in the data for rendering
        const key = dataset.label || `dataset-${datasetIndex}`;
        dataPoint[key] = getYValue(dataset.data[index]);
      }
    });
    
    return dataPoint;
  });
};

/**
 * Process chart data for legend display
 * This function completely filters out datasets that have legendHidden set to true
 * to completely hide them from the legend (both label and icon)
 */
export const prepareChartLegend = (datasets: ChartDataset[]) => {
  return datasets.filter(dataset => !dataset.legendHidden);
};

/**
 * Create a formatted data object for Recharts from chart datasets and labels
 */
export const formatChartData = (labels: string[], datasets: ChartDataset[]) => {
  return labels.map((label, index) => {
    const dataPoint: any = { name: label };
    
    datasets
      .filter(dataset => !dataset.hidden)
      .forEach((dataset, datasetIndex) => {
        const key = dataset.label || `dataset-${datasetIndex}`;
        const value = dataset.data[index];
        dataPoint[key] = typeof value === 'object' && value !== null 
          ? ('y' in value ? value.y : value) 
          : value;
      });
    
    return dataPoint;
  });
};
