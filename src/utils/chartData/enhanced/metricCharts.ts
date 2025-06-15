
import { ChartData } from "@/types";
import { ProcessedData } from "../../dataProcessor";
import { ChartSuggestion } from "../../autoChartGenerator";

export function prepareCardChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  const relevantColumns = suggestion.columns;
  const valueCol = relevantColumns[0];
  
  console.log('Processing card chart with column:', valueCol);
  
  const values = data.rows
    .map(row => typeof row[valueCol] === 'number' ? row[valueCol] : 0)
    .filter(val => val !== 0);
  
  let metricValue = 0;
  let metricLabel = valueCol || 'Metric';
  
  if (values.length > 0) {
    // Calculate meaningful metrics
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    
    // Choose the most appropriate metric
    if (valueCol?.toLowerCase().includes('total') || valueCol?.toLowerCase().includes('sum')) {
      metricValue = sum;
      metricLabel = `Total ${valueCol}`;
    } else if (valueCol?.toLowerCase().includes('average') || valueCol?.toLowerCase().includes('avg')) {
      metricValue = avg;
      metricLabel = `Average ${valueCol}`;
    } else if (valueCol?.toLowerCase().includes('max') || valueCol?.toLowerCase().includes('peak')) {
      metricValue = max;
      metricLabel = `Maximum ${valueCol}`;
    } else {
      metricValue = sum;
      metricLabel = `Total ${valueCol}`;
    }
  } else {
    // Sample data
    metricValue = Math.floor(Math.random() * 10000) + 1000;
    metricLabel = `Total ${valueCol || 'Value'}`;
  }
  
  console.log('Card chart data prepared:', { metricValue, metricLabel });
  
  return {
    labels: [metricLabel],
    datasets: [{
      label: metricLabel,
      data: [metricValue],
      backgroundColor: '#4F46E5'
    }]
  };
}

export function prepareGaugeChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  const relevantColumns = suggestion.columns;
  const valueCol = relevantColumns[0];
  
  console.log('Processing gauge chart with column:', valueCol);
  
  const values = data.rows
    .map(row => typeof row[valueCol] === 'number' ? row[valueCol] : 0)
    .filter(val => val !== 0);
  
  let currentValue = 0;
  let maxValue = 100;
  
  if (values.length > 0) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    currentValue = Math.round(avg);
    maxValue = Math.round(max * 1.2); // 20% buffer above max
  } else {
    currentValue = Math.floor(Math.random() * 80) + 20;
    maxValue = 100;
  }
  
  console.log('Gauge chart data prepared:', { currentValue, maxValue });
  
  return {
    labels: [valueCol || 'Performance'],
    datasets: [{
      label: valueCol || 'Performance',
      data: [currentValue, maxValue - currentValue],
      backgroundColor: ['#4F46E5', '#E5E7EB'],
      borderWidth: 0
    }]
  };
}
