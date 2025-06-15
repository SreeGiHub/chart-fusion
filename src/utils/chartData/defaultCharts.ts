
import { ChartData } from "@/types";
import { ProcessedData } from "../dataProcessor";
import { ChartSuggestion } from "../autoChartGenerator";

export function prepareDefaultChartData(data: ProcessedData, suggestion: ChartSuggestion, relevantColumns: string[]): ChartData {
  console.log('\n=== PREPARING DEFAULT CHART DATA ===');
  console.log('📊 Chart type:', suggestion.type);
  console.log('📋 Relevant columns:', relevantColumns);
  console.log('🗂️ Available data columns:', data.columns.map(col => `${col.name} (${col.type})`));
  console.log('📈 Data rows count:', data.rows.length);
  
  // Validate that relevant columns exist in the data
  const validColumns = relevantColumns.filter(colName => 
    data.columns.some(col => col.name === colName)
  );
  
  console.log('✅ Valid columns found:', validColumns);
  
  if (validColumns.length === 0) {
    console.warn('⚠️ No valid columns found, using first available columns');
    validColumns.push(...data.columns.slice(0, 2).map(col => col.name));
  }
  
  // Default chart data preparation for scatter, line, area, and categorical charts
  if (suggestion.type === 'scatter') {
    const xCol = validColumns[0];
    const yCol = validColumns[1] || validColumns[0];
    
    console.log('🎯 Scatter chart columns:', { xCol, yCol });
    
    const scatterData = data.rows
      .filter(row => {
        const xVal = row[xCol];
        const yVal = row[yCol];
        const xIsNumber = typeof xVal === 'number' || !isNaN(Number(xVal));
        const yIsNumber = typeof yVal === 'number' || !isNaN(Number(yVal));
        return xIsNumber && yIsNumber;
      })
      .slice(0, 50)
      .map(row => ({
        x: typeof row[xCol] === 'number' ? row[xCol] : Number(row[xCol]),
        y: typeof row[yCol] === 'number' ? row[yCol] : Number(row[yCol])
      }));
    
    console.log('📊 Scatter data processed:', {
      pointsCount: scatterData.length,
      samplePoints: scatterData.slice(0, 3)
    });
    
    // Only use fallback if absolutely no data
    if (scatterData.length === 0) {
      console.log('⚠️ No valid scatter data found, using fallback');
      for (let i = 0; i < 15; i++) {
        scatterData.push({
          x: Math.floor(Math.random() * 100) + 10,
          y: Math.floor(Math.random() * 100) + 10
        });
      }
    }
    
    return {
      labels: [],
      datasets: [{
        label: `${xCol} vs ${yCol}`,
        data: scatterData,
        backgroundColor: '#4F46E5'
      }]
    };
  }
  
  // Handle line and area charts with time series data
  if (['line', 'area'].includes(suggestion.type)) {
    const xCol = validColumns[0]; // Usually date/time column
    const yCol = validColumns[1] || validColumns[0]; // Usually numeric column
    
    console.log('📈 Time series chart columns:', { xCol, yCol });
    
    let timeData = data.rows
      .filter(row => {
        const hasXValue = row[xCol] !== undefined && row[xCol] !== null && row[xCol] !== '';
        const yValue = row[yCol];
        const hasValidYValue = typeof yValue === 'number' || !isNaN(Number(yValue));
        return hasXValue && hasValidYValue;
      })
      .sort((a, b) => {
        // Try to sort by date if possible, otherwise by string comparison
        const aVal = a[xCol];
        const bVal = b[xCol];
        
        // Check if values look like dates
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          return aDate.getTime() - bDate.getTime();
        }
        
        return String(aVal).localeCompare(String(bVal));
      })
      .slice(0, 20);
    
    console.log('📊 Time series data processed:', {
      pointsCount: timeData.length,
      sampleData: timeData.slice(0, 3).map(row => ({ x: row[xCol], y: row[yCol] }))
    });
    
    // Only use fallback if absolutely no data
    if (timeData.length === 0) {
      console.log('⚠️ No valid time series data found, using fallback');
      timeData = Array.from({ length: 12 }, (_, i) => ({
        [xCol]: new Date(2024, i, 1).toLocaleDateString(),
        [yCol]: Math.floor(Math.random() * 100) + 50
      }));
    }
    
    const labels = timeData.map(row => {
      const value = row[xCol];
      // Try to format as date if possible
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }
      return String(value);
    });
    
    const values = timeData.map(row => {
      const value = row[yCol];
      return typeof value === 'number' ? value : Number(value) || 0;
    });
    
    return {
      labels,
      datasets: [{
        label: yCol || 'Value',
        data: values,
        borderColor: '#4F46E5',
        backgroundColor: suggestion.type === 'area' ? 'rgba(79, 70, 229, 0.1)' : undefined,
        fill: suggestion.type === 'area'
      }]
    };
  }
  
  // Enhanced categorical charts (bar, pie, etc.)
  const categoryCol = validColumns[0];
  const valueCol = validColumns[1] || validColumns[0];
  
  console.log('📊 Categorical chart columns:', { categoryCol, valueCol });
  
  const groupedData = new Map<string, number>();
  
  data.rows.slice(0, 15).forEach((row, index) => {
    const category = row[categoryCol] ? String(row[categoryCol]) : `Category ${index + 1}`;
    const rawValue = row[valueCol];
    
    let value: number;
    if (typeof rawValue === 'number') {
      value = rawValue;
    } else if (typeof rawValue === 'string' && !isNaN(Number(rawValue))) {
      value = Number(rawValue);
    } else {
      // For non-numeric data, count occurrences
      value = 1;
    }
    
    groupedData.set(category, (groupedData.get(category) || 0) + value);
  });
  
  console.log('📊 Grouped data processed:', {
    categoriesCount: groupedData.size,
    categories: Array.from(groupedData.keys()).slice(0, 5),
    sampleValues: Array.from(groupedData.values()).slice(0, 5)
  });
  
  // Only use fallback if absolutely no data
  if (groupedData.size === 0) {
    console.log('⚠️ No valid categorical data found, using fallback');
    ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'].forEach((cat, i) => {
      groupedData.set(cat, Math.floor(Math.random() * 100) + 20);
    });
  }
  
  const labels = Array.from(groupedData.keys());
  const values = Array.from(groupedData.values());
  
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
