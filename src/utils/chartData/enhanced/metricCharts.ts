
import { ChartData } from "@/types";
import { ProcessedData } from "../../dataProcessor";
import { ChartSuggestion } from "../../autoChartGenerator";

export function prepareCardChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  const relevantColumns = suggestion.columns;
  const valueCol = relevantColumns[0];
  
  console.log('\n=== PREPARING CARD CHART DATA ===');
  console.log('💳 Card chart column:', valueCol);
  console.log('📊 Available columns:', data.columns.map(col => col.name));
  console.log('📈 Sample data rows:', data.rows.slice(0, 3));
  
  // Find the actual column in data
  const actualColumn = data.columns.find(col => col.name === valueCol);
  if (!actualColumn) {
    console.warn('⚠️ Column not found, using first numeric column');
    const firstNumericCol = data.columns.find(col => col.type === 'number');
    if (firstNumericCol) {
      return prepareCardChartData(data, { ...suggestion, columns: [firstNumericCol.name] });
    }
  }
  
  // Extract and process values from the actual data
  const values = data.rows
    .map(row => {
      const value = row[valueCol];
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && !isNaN(parseFloat(value))) return parseFloat(value);
      return null;
    })
    .filter(val => val !== null && !isNaN(val));
  
  console.log('📈 Card values processed:', {
    valuesCount: values.length,
    sampleValues: values.slice(0, 5),
    columnType: actualColumn?.type,
    allDataSample: data.rows.slice(0, 3).map(row => ({ [valueCol]: row[valueCol] }))
  });
  
  let metricValue = 0;
  let metricLabel = valueCol || 'Metric';
  
  if (values.length > 0) {
    // Calculate meaningful metrics based on column name and context
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const count = values.length;
    
    // Smart metric selection based on column name
    const colLower = valueCol?.toLowerCase() || '';
    
    if (colLower.includes('total') || colLower.includes('sum') || colLower.includes('revenue') || colLower.includes('sales') || colLower.includes('amount')) {
      metricValue = Math.round(sum * 100) / 100;
      metricLabel = `Total ${valueCol}`;
    } else if (colLower.includes('average') || colLower.includes('avg') || colLower.includes('mean') || colLower.includes('rate')) {
      metricValue = Math.round(avg * 100) / 100;
      metricLabel = `Average ${valueCol}`;
    } else if (colLower.includes('max') || colLower.includes('peak') || colLower.includes('highest')) {
      metricValue = max;
      metricLabel = `Maximum ${valueCol}`;
    } else if (colLower.includes('count') || colLower.includes('number') || colLower.includes('qty') || colLower.includes('quantity')) {
      metricValue = count;
      metricLabel = `Count of ${valueCol}`;
    } else if (actualColumn?.type === 'number') {
      // For numeric columns, default to sum
      metricValue = Math.round(sum * 100) / 100;
      metricLabel = `Total ${valueCol}`;
    } else {
      // For other types, use count
      metricValue = count;
      metricLabel = `Count of ${valueCol}`;
    }
  } else {
    // If no numeric values, count all non-empty entries
    const nonEmptyCount = data.rows.filter(row => {
      const value = row[valueCol];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    if (nonEmptyCount > 0) {
      metricValue = nonEmptyCount;
      metricLabel = `Count of ${valueCol}`;
    } else {
      console.log('⚠️ No valid data for card');
      metricValue = 0;
      metricLabel = `No ${valueCol} Data`;
    }
  }
  
  console.log('✅ Card chart result:', { metricValue, metricLabel });
  
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
  
  console.log('\n=== PREPARING GAUGE CHART DATA ===');
  console.log('🎯 Gauge chart column:', valueCol);
  console.log('📊 Sample data:', data.rows.slice(0, 3));
  
  const values = data.rows
    .map(row => {
      const value = row[valueCol];
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && !isNaN(parseFloat(value))) return parseFloat(value);
      return null;
    })
    .filter(val => val !== null && !isNaN(val));
  
  console.log('📊 Gauge values processed:', {
    valuesCount: values.length,
    sampleValues: values.slice(0, 5)
  });
  
  let currentValue = 0;
  let maxValue = 100;
  
  if (values.length > 0) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Use average as current value
    currentValue = Math.round(avg);
    
    // Set max value intelligently based on data range
    const range = max - min;
    if (max <= 100 && min >= 0) {
      // Looks like percentage data
      maxValue = 100;
      currentValue = Math.min(currentValue, 100);
    } else if (range > 0) {
      // Use a reasonable max based on the data range
      maxValue = Math.round(max * 1.2); // 20% buffer above max
    } else {
      // Single value case
      maxValue = Math.max(100, currentValue * 2);
    }
    
    // For percentage-like data, ensure it's between 0-100
    if (valueCol?.toLowerCase().includes('percent') || valueCol?.toLowerCase().includes('%')) {
      currentValue = Math.min(Math.max(currentValue, 0), 100);
      maxValue = 100;
    }
  } else {
    // If no numeric values, try to count non-empty entries as a percentage
    const totalRows = data.rows.length;
    const nonEmptyCount = data.rows.filter(row => {
      const value = row[valueCol];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    if (totalRows > 0) {
      currentValue = Math.round((nonEmptyCount / totalRows) * 100);
      maxValue = 100;
    } else {
      console.log('⚠️ No valid data for gauge');
      currentValue = 0;
      maxValue = 100;
    }
  }
  
  console.log('✅ Gauge chart result:', { currentValue, maxValue });
  
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
