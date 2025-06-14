
import { ProcessedData } from "@/utils/dataProcessor";
import { AIChartSuggestion } from "./types";

export function generateFallbackSuggestions(data: ProcessedData): AIChartSuggestion[] {
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const categoricalColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');

  const suggestions: AIChartSuggestion[] = [];

  // Time series charts if date columns exist
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'line',
      title: 'Trend Over Time',
      description: 'Shows trends in your data over time',
      columns: [dateColumns[0].name, numericColumns[0].name],
      priority: 9
    });
  }

  // Bar chart for categorical data
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'bar',
      title: 'Category Comparison',
      description: 'Compares values across categories',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 8
    });
  }

  // Pie chart for part-to-whole
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'pie',
      title: 'Distribution Breakdown',
      description: 'Shows the composition of your data',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 7
    });
  }

  // Scatter plot for correlation
  if (numericColumns.length >= 2) {
    suggestions.push({
      type: 'scatter',
      title: 'Correlation Analysis',
      description: 'Explores relationships between variables',
      columns: [numericColumns[0].name, numericColumns[1].name],
      priority: 6
    });
  }

  // KPI card for key metrics
  if (numericColumns.length > 0) {
    suggestions.push({
      type: 'card',
      title: 'Key Metric',
      description: 'Highlights important numbers',
      columns: [numericColumns[0].name],
      priority: 5
    });
  }

  return suggestions;
}
