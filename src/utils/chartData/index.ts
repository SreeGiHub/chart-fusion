
import { ChartData } from "@/types";
import { ProcessedData } from "../dataProcessor";
import { ChartSuggestion } from "../autoChartGenerator";
import { prepareEnhancedChartData } from "./enhancedCharts";
import { prepareDefaultChartData } from "./defaultCharts";

export function prepareChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  console.log('Preparing chart data for:', suggestion.type, 'with data:', data);
  
  const relevantColumns = suggestion.columns;
  
  // Try enhanced charts first
  const enhancedData = prepareEnhancedChartData(data, suggestion);
  if (enhancedData) {
    return enhancedData;
  }
  
  // Fall back to default chart data preparation
  console.log('Using default chart data preparation for type:', suggestion.type);
  return prepareDefaultChartData(data, suggestion, relevantColumns);
}
