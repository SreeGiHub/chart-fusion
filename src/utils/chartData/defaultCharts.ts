
import { ChartData } from "@/types";
import { ProcessedData } from "../dataProcessor";
import { ChartSuggestion } from "../autoChartGenerator";

export function prepareDefaultChartData(data: ProcessedData, suggestion: ChartSuggestion, relevantColumns: string[]): ChartData {
  console.log('\n=== ENHANCED DEFAULT CHART PREPARATION ===');
  console.log('📊 Chart type:', suggestion.type);
  console.log('📋 Target columns:', relevantColumns);
  console.log('🗂️ Data overview:', {
    totalRows: data.rows.length,
    availableColumns: data.columns.map(col => `${col.name} (${col.type})`),
    columnsExist: relevantColumns.map(col => ({
      name: col,
      exists: data.columns.some(dataCol => dataCol.name === col)
    }))
  });
  
  // Validate and fix column references
  const validColumns = relevantColumns.filter(colName => 
    data.columns.some(col => col.name === colName)
  );
  
  if (validColumns.length === 0) {
    console.warn('⚠️ No valid columns found, using intelligent fallback');
    const fallbackColumns = selectOptimalColumns(data, suggestion.type);
    validColumns.push(...fallbackColumns);
  }
  
  console.log('✅ Using columns:', validColumns);
  
  // Enhanced scatter chart handling
  if (suggestion.type === 'scatter') {
    return prepareEnhancedScatterData(data, validColumns);
  }
  
  // Enhanced line/area chart handling
  if (['line', 'area'].includes(suggestion.type)) {
    return prepareEnhancedTimeSeriesData(data, validColumns, suggestion.type);
  }
  
  // Enhanced categorical chart handling
  return prepareEnhancedCategoricalData(data, validColumns, suggestion.type);
}

function selectOptimalColumns(data: ProcessedData, chartType: string): string[] {
  const numericCols = data.columns.filter(col => col.type === 'number');
  const textCols = data.columns.filter(col => col.type === 'text');
  const dateCols = data.columns.filter(col => col.type === 'date');
  
  console.log('🎯 Selecting optimal columns for', chartType, {
    numeric: numericCols.length,
    text: textCols.length,
    date: dateCols.length
  });
  
  switch (chartType) {
    case 'scatter':
      if (numericCols.length >= 2) {
        return [numericCols[0].name, numericCols[1].name];
      }
      break;
      
    case 'line':
    case 'area':
      if (dateCols.length > 0 && numericCols.length > 0) {
        return [dateCols[0].name, numericCols[0].name];
      }
      if (textCols.length > 0 && numericCols.length > 0) {
        return [textCols[0].name, numericCols[0].name];
      }
      break;
      
    case 'card':
    case 'gauge':
      if (numericCols.length > 0) {
        return [numericCols[0].name];
      }
      break;
      
    case 'pie':
    case 'donut':
      if (textCols.length > 0 && numericCols.length > 0) {
        return [textCols[0].name, numericCols[0].name];
      }
      break;
      
    default:
      if (textCols.length > 0 && numericCols.length > 0) {
        return [textCols[0].name, numericCols[0].name];
      }
  }
  
  // Ultimate fallback
  return data.columns.slice(0, 2).map(col => col.name);
}

function prepareEnhancedScatterData(data: ProcessedData, columns: string[]): ChartData {
  const xCol = columns[0];
  const yCol = columns[1] || columns[0];
  
  console.log('🎯 Preparing scatter plot:', { xCol, yCol });
  
  const scatterData = data.rows
    .map(row => {
      const xVal = parseNumericValue(row[xCol]);
      const yVal = parseNumericValue(row[yCol]);
      
      if (xVal !== null && yVal !== null) {
        return { x: xVal, y: yVal };
      }
      return null;
    })
    .filter(point => point !== null)
    .slice(0, 100); // Limit for performance
  
  console.log('📊 Scatter data result:', {
    pointsGenerated: scatterData.length,
    xRange: scatterData.length > 0 ? {
      min: Math.min(...scatterData.map(p => p.x)),
      max: Math.max(...scatterData.map(p => p.x))
    } : null,
    yRange: scatterData.length > 0 ? {
      min: Math.min(...scatterData.map(p => p.y)),
      max: Math.max(...scatterData.map(p => p.y))
    } : null
  });
  
  return {
    labels: [],
    datasets: [{
      label: `${xCol} vs ${yCol}`,
      data: scatterData,
      backgroundColor: '#4F46E5',
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };
}

function prepareEnhancedTimeSeriesData(data: ProcessedData, columns: string[], chartType: string): ChartData {
  const xCol = columns[0];
  const yCol = columns[1] || columns[0];
  
  console.log('📈 Preparing time series:', { xCol, yCol, chartType });
  
  // Process and sort data
  const processedData = data.rows
    .map(row => {
      const xValue = row[xCol];
      const yValue = parseNumericValue(row[yCol]);
      
      return {
        x: xValue,
        y: yValue !== null ? yValue : 0,
        sortKey: getSortKey(xValue)
      };
    })
    .filter(item => item.x !== undefined && item.x !== null && item.x !== '')
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, 50); // Limit for readability
  
  console.log('📊 Time series result:', {
    pointsProcessed: processedData.length,
    dateRange: processedData.length > 0 ? {
      start: processedData[0].x,
      end: processedData[processedData.length - 1].x
    } : null,
    valueRange: processedData.length > 0 ? {
      min: Math.min(...processedData.map(p => p.y)),
      max: Math.max(...processedData.map(p => p.y))
    } : null
  });
  
  const labels = processedData.map(item => formatTimeLabel(item.x));
  const values = processedData.map(item => item.y);
  
  return {
    labels,
    datasets: [{
      label: yCol,
      data: values,
      borderColor: '#4F46E5',
      backgroundColor: chartType === 'area' ? 'rgba(79, 70, 229, 0.1)' : undefined,
      fill: chartType === 'area',
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5
    }]
  };
}

function prepareEnhancedCategoricalData(data: ProcessedData, columns: string[], chartType: string): ChartData {
  const categoryCol = columns[0];
  const valueCol = columns[1] || columns[0];
  
  console.log('📊 Preparing categorical chart:', { categoryCol, valueCol, chartType });
  
  const groupedData = new Map<string, number>();
  let processedRows = 0;
  
  data.rows.forEach((row, index) => {
    const categoryValue = row[categoryCol];
    const category = categoryValue !== undefined && categoryValue !== null && categoryValue !== '' 
      ? String(categoryValue).trim() 
      : `Category ${index + 1}`;
    
    const numericValue = parseNumericValue(row[valueCol]);
    const value = numericValue !== null ? numericValue : 1; // Count if not numeric
    
    groupedData.set(category, (groupedData.get(category) || 0) + value);
    processedRows++;
  });
  
  console.log('📊 Categorical result:', {
    rowsProcessed: processedRows,
    categoriesFound: groupedData.size,
    topCategories: Array.from(groupedData.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, val]) => ({ category: cat, value: val }))
  });
  
  // Sort by value and limit categories for readability
  const sortedEntries = Array.from(groupedData.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  const labels = sortedEntries.map(([label]) => label);
  const values = sortedEntries.map(([, value]) => value);
  
  const colors = generateChartColors(labels.length);
  
  return {
    labels,
    datasets: [{
      label: valueCol,
      data: values,
      backgroundColor: ['pie', 'donut'].includes(chartType) ? colors : colors[0],
      borderColor: ['pie', 'donut'].includes(chartType) ? '#FFFFFF' : undefined,
      borderWidth: ['pie', 'donut'].includes(chartType) ? 2 : 1
    }]
  };
}

// Helper functions
function parseNumericValue(value: any): number | null {
  if (typeof value === 'number' && isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[,$%]/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

function getSortKey(value: any): number {
  // Try to parse as date first
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.getTime();
  }
  
  // Try numeric
  const numeric = parseFloat(String(value));
  if (!isNaN(numeric)) {
    return numeric;
  }
  
  // Fallback to string hash
  return String(value).length;
}

function formatTimeLabel(value: any): string {
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return String(value);
}

function generateChartColors(count: number): string[] {
  const baseColors = [
    '#4F46E5', '#8B5CF6', '#EC4899', '#F97316', '#0D9488', 
    '#DC2626', '#059669', '#7C3AED', '#DB2777', '#0EA5E9',
    '#65A30D', '#CA8A04', '#9333EA', '#C2410C', '#0891B2'
  ];
  
  // Repeat colors if needed
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
}
