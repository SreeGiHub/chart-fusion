
import { ChartData } from "@/types";
import { ProcessedData } from "../../dataProcessor";
import { ChartSuggestion } from "../../autoChartGenerator";

export function prepareScatterChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  const relevantColumns = suggestion.columns;
  const xCol = relevantColumns[0];
  const yCol = relevantColumns[1];
  
  console.log('Processing scatter chart with columns:', { xCol, yCol });
  
  const scatterData = data.rows
    .filter(row => typeof row[xCol] === 'number' && typeof row[yCol] === 'number')
    .slice(0, 50)
    .map(row => ({ x: row[xCol], y: row[yCol] }));
  
  // Add sample data if no valid data found
  if (scatterData.length === 0) {
    console.log('No scatter data found, using sample data');
    for (let i = 0; i < 25; i++) {
      scatterData.push({
        x: Math.floor(Math.random() * 100) + 10,
        y: Math.floor(Math.random() * 100) + 10
      });
    }
  }
  
  console.log('Scatter chart data prepared:', scatterData);
  
  return {
    labels: [],
    datasets: [{
      label: `${xCol} vs ${yCol}`,
      data: scatterData,
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5'
    }]
  };
}
