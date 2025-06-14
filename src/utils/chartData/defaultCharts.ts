
import { ChartData } from "@/types";
import { ProcessedData } from "../dataProcessor";
import { ChartSuggestion } from "../autoChartGenerator";

export function prepareDefaultChartData(data: ProcessedData, suggestion: ChartSuggestion, relevantColumns: string[]): ChartData {
  console.log('Preparing default chart data for:', suggestion.type);
  
  // Default chart data preparation for scatter, line, area, and categorical charts
  if (suggestion.type === 'scatter') {
    const xCol = relevantColumns[0];
    const yCol = relevantColumns[1];
    
    const scatterData = data.rows
      .filter(row => typeof row[xCol] === 'number' && typeof row[yCol] === 'number')
      .slice(0, 50)
      .map(row => ({ x: row[xCol], y: row[yCol] }));
    
    console.log('Scatter data prepared:', scatterData);
    
    return {
      labels: [],
      datasets: [{
        label: `${xCol} vs ${yCol}`,
        data: scatterData,
        backgroundColor: '#4F46E5'
      }]
    };
  }
  
  // Handle line and area charts
  if (['line', 'area'].includes(suggestion.type)) {
    const dateCol = relevantColumns[0];
    const valueCol = relevantColumns[1];
    
    let timeData = data.rows
      .filter(row => row[dateCol] && typeof row[valueCol] === 'number')
      .sort((a, b) => new Date(a[dateCol]).getTime() - new Date(b[dateCol]).getTime())
      .slice(0, 20);
    
    if (timeData.length === 0) {
      timeData = Array.from({ length: 12 }, (_, i) => ({
        [dateCol]: new Date(2024, i, 1).toLocaleDateString(),
        [valueCol]: Math.floor(Math.random() * 100) + 50
      }));
    }
    
    console.log('Time series data prepared:', timeData);
    
    return {
      labels: timeData.map(row => {
        const date = new Date(row[dateCol]);
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }),
      datasets: [{
        label: valueCol || 'Value',
        data: timeData.map(row => row[valueCol]),
        borderColor: '#4F46E5',
        backgroundColor: suggestion.type === 'area' ? 'rgba(79, 70, 229, 0.1)' : undefined,
        fill: suggestion.type === 'area'
      }]
    };
  }
  
  // Enhanced categorical charts
  const categoryCol = relevantColumns[0];
  const valueCol = relevantColumns[1];
  
  const groupedData = new Map<string, number>();
  data.rows.slice(0, 10).forEach(row => {
    const category = String(row[categoryCol] || `Category ${groupedData.size + 1}`);
    const value = typeof row[valueCol] === 'number' ? row[valueCol] : Math.floor(Math.random() * 100) + 10;
    groupedData.set(category, (groupedData.get(category) || 0) + value);
  });
  
  if (groupedData.size === 0) {
    ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'].forEach((cat, i) => {
      groupedData.set(cat, Math.floor(Math.random() * 100) + 20);
    });
  }
  
  const labels = Array.from(groupedData.keys());
  const values = Array.from(groupedData.values());
  
  console.log('Categorical data prepared:', { labels, values });
  
  const colors = [
    '#4F46E5', '#8B5CF6', '#EC4899', '#F97316', '#0D9488', 
    '#DC2626', '#059669', '#7C3AED', '#DB2777'
  ];
  
  return {
    labels,
    datasets: [{
      label: valueCol || 'Value',
      data: values,
      backgroundColor: ['pie', 'donut', 'treemap'].includes(suggestion.type)
        ? colors.slice(0, labels.length)
        : colors[0],
      borderColor: suggestion.type === 'line' ? colors[0] : undefined,
      borderWidth: ['pie', 'donut'].includes(suggestion.type) ? 2 : undefined
    }]
  };
}
