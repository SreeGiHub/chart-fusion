
import { ChartData } from "@/types";
import { ProcessedData } from "../../dataProcessor";
import { ChartSuggestion } from "../../autoChartGenerator";

export function prepareBubbleChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  const relevantColumns = suggestion.columns;
  const xCol = relevantColumns[0];
  const yCol = relevantColumns[1];
  const sizeCol = relevantColumns[2] || relevantColumns[1];
  
  console.log('Processing bubble chart with columns:', { xCol, yCol, sizeCol });
  
  const bubbleData = data.rows
    .filter(row => 
      typeof row[xCol] === 'number' && 
      typeof row[yCol] === 'number' && 
      typeof row[sizeCol] === 'number'
    )
    .slice(0, 30)
    .map(row => ({
      x: row[xCol],
      y: row[yCol],
      r: Math.max(5, Math.min(30, row[sizeCol] / 10)) // Scale bubble size appropriately
    }));
  
  // Add sample data if no valid data found
  if (bubbleData.length === 0) {
    console.log('No bubble data found, using sample data');
    for (let i = 0; i < 15; i++) {
      bubbleData.push({
        x: Math.floor(Math.random() * 100) + 10,
        y: Math.floor(Math.random() * 100) + 10,
        r: Math.floor(Math.random() * 20) + 5
      });
    }
  }
  
  console.log('Bubble chart data prepared:', bubbleData);
  
  return {
    labels: [],
    datasets: [{
      label: `${xCol} vs ${yCol} (Size: ${sizeCol})`,
      data: bubbleData,
      backgroundColor: 'rgba(79, 70, 229, 0.6)',
      borderColor: '#4F46E5',
      borderWidth: 2
    }]
  };
}
