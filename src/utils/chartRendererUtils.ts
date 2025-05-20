
import { ChartDataPoint } from "@/types";

/**
 * Safely converts a chart data point to a string for rendering
 */
export const formatDataPointToString = (value: ChartDataPoint | undefined): string => {
  if (value === undefined) return '';
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  // Handle complex data points
  if (typeof value === 'object') {
    // For ComplexDataPoint with x and y
    if ('x' in value && 'y' in value) {
      return `${value.y}`;
    }
    
    // For BoxPlotDataPoint
    if (Array.isArray(value.y)) {
      return value.y.join(', ');
    }
  }
  
  return String(value);
};

/**
 * Safely compares chart types for equality
 */
export const isChartTypeEqual = (type1: string, type2: string): boolean => {
  return type1 === type2;
};

/**
 * Safely formats numbers for display with commas as thousand separators
 */
export const formatNumberWithCommas = (num: number | string): string => {
  if (typeof num === 'number') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  if (typeof num === 'string' && !isNaN(Number(num))) {
    return Number(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  return String(num);
};

/**
 * Safely adds two values that could be strings or numbers
 */
export const safelyAddValues = (a: string | number, b: string | number): number => {
  const numA = typeof a === 'string' ? parseFloat(a) : a;
  const numB = typeof b === 'string' ? parseFloat(b) : b;
  
  if (isNaN(numA) || isNaN(numB)) {
    return 0;
  }
  
  return numA + numB;
};
