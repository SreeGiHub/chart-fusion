
import { ChartItemType, Position } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { ProcessedData } from "@/utils/dataProcessor";
import { v4 as uuidv4 } from "uuid";
import { AIChartSuggestion } from "../types";

export function createIntelligentFallback(
  suggestion: AIChartSuggestion, 
  data: ProcessedData, 
  position: Position, 
  index: number
): ChartItemType {
  const fallbackChart = createNewChartItem('bar', position);
  fallbackChart.title = suggestion.title || `Business Insight ${index + 1}`;
  fallbackChart.size = { width: 420, height: 320 };
  fallbackChart.id = uuidv4();
  
  // Create meaningful fallback data based on business context
  const numericCols = data.columns.filter(col => col.type === 'number');
  const textCols = data.columns.filter(col => col.type === 'text');
  
  if (numericCols.length > 0) {
    const targetCol = numericCols[0];
    const categoryCol = textCols.length > 0 ? textCols[0] : null;
    
    if (categoryCol) {
      // Group data by category
      const groupedData = new Map<string, number>();
      data.rows.forEach(row => {
        const category = String(row[categoryCol.name] || 'Unknown');
        const value = parseFloat(String(row[targetCol.name] || 0));
        groupedData.set(category, (groupedData.get(category) || 0) + (isNaN(value) ? 0 : value));
      });
      
      const sortedEntries = Array.from(groupedData.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      fallbackChart.data = {
        labels: sortedEntries.map(([label]) => label),
        datasets: [{
          label: targetCol.name,
          data: sortedEntries.map(([, value]) => value),
          backgroundColor: '#4F46E5'
        }]
      };
    } else {
      // Single metric summary
      const values = data.rows
        .map(row => parseFloat(String(row[targetCol.name] || 0)))
        .filter(val => !isNaN(val));
      
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = values.length > 0 ? sum / values.length : 0;
      
      fallbackChart.data = {
        labels: ['Total', 'Average', 'Records'],
        datasets: [{
          label: 'Business Metrics',
          data: [sum, avg, data.rows.length],
          backgroundColor: ['#4F46E5', '#8B5CF6', '#EC4899']
        }]
      };
    }
  } else {
    // Count-based fallback
    fallbackChart.data = {
      labels: ['Total Records', 'Columns', 'Data Points'],
      datasets: [{
        label: 'Data Summary',
        data: [data.rows.length, data.columns.length, data.rows.length * data.columns.length],
        backgroundColor: '#4F46E5'
      }]
    };
  }
  
  return fallbackChart;
}
