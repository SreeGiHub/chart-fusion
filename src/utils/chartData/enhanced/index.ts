
import { ChartData } from "@/types";
import { ProcessedData } from "../../dataProcessor";
import { ChartSuggestion } from "../../autoChartGenerator";
import { prepareBubbleChartData } from "./bubbleCharts";
import { prepareScatterChartData } from "./scatterCharts";
import { prepareCardChartData, prepareGaugeChartData } from "./metricCharts";
import { preparePieChartData } from "./pieCharts";

export function prepareEnhancedChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData | null {
  console.log('Preparing enhanced chart data for:', suggestion.type, 'with suggestion:', suggestion);
  
  const relevantColumns = suggestion.columns;
  console.log('Relevant columns:', relevantColumns);
  
  if (!relevantColumns || relevantColumns.length === 0) {
    console.log('No relevant columns found, returning null');
    return null;
  }

  // Enhanced bubble chart with three-dimensional data
  if (suggestion.type === 'bubble') {
    return prepareBubbleChartData(data, suggestion);
  }

  // Enhanced scatter chart with correlation analysis
  if (suggestion.type === 'scatter') {
    return prepareScatterChartData(data, suggestion);
  }

  // Enhanced card/metric charts with KPI calculations
  if (suggestion.type === 'card') {
    return prepareCardChartData(data, suggestion);
  }

  // Enhanced gauge chart for performance metrics
  if (suggestion.type === 'gauge') {
    return prepareGaugeChartData(data, suggestion);
  }

  // Enhanced pie chart with better data grouping
  if (['pie', 'donut'].includes(suggestion.type)) {
    return preparePieChartData(data, suggestion);
  }
  
  console.log('No enhanced chart preparation found for type:', suggestion.type);
  return null;
}
