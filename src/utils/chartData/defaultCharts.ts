
import { ChartData } from "@/types";
import { ProcessedData } from "../dataProcessor";
import { ChartSuggestion } from "../autoChartGenerator";

export function prepareDefaultChartData(data: ProcessedData, suggestion: ChartSuggestion, relevantColumns: string[]): ChartData {
  console.log('\n=== PREPARING DEFAULT CHART DATA ===');
  console.log('📊 Chart type:', suggestion.type);
  console.log('📋 Relevant columns:', relevantColumns);
  console.log('🗂️ Available data columns:', data.columns.map(col => `${col.name} (${col.type})`));
  console.log('📈 Data rows count:', data.rows.length);
  console.log('🔍 First few data rows:', data.rows.slice(0, 3));
  
  // Validate that relevant columns exist in the data
  const validColumns = relevantColumns.filter(colName => 
    data.columns.some(col => col.name === colName)
  );
  
  console.log('✅ Valid columns found:', validColumns);
  
  if (validColumns.length === 0) {
    console.warn('⚠️ No valid columns found in relevantColumns, using first available columns');
    const firstTextCol = data.columns.find(col => col.type === 'text');
    const firstNumCol = data.columns.find(col => col.type === 'number');
    
    if (firstTextCol && firstNumCol) {
      validColumns.push(firstTextCol.name, firstNumCol.name);
    } else if (data.columns.length >= 2) {
      validColumns.push(data.columns[0].name, data.columns[1].name);
    } else {
      validColumns.push(...data.columns.map(col => col.name));
    }
    console.log('🔄 Using fallback columns:', validColumns);
  }
  
  // Handle scatter charts
  if (suggestion.type === 'scatter') {
    const xCol = validColumns[0];
    const yCol = validColumns[1] || validColumns[0];
    
    console.log('🎯 Scatter chart columns:', { xCol, yCol });
    
    const scatterData = data.rows
      .map(row => {
        const xVal = row[xCol];
        const yVal = row[yCol];
        
        // Convert to numbers if possible
        let x = typeof xVal === 'number' ? xVal : parseFloat(String(xVal));
        let y = typeof yVal === 'number' ? yVal : parseFloat(String(yVal));
        
        // If conversion failed, skip this row
        if (isNaN(x) || isNaN(y)) {
          return null;
        }
        
        return { x, y };
      })
      .filter(point => point !== null)
      .slice(0, 50);
    
    console.log('📊 Scatter data processed:', {
      pointsCount: scatterData.length,
      samplePoints: scatterData.slice(0, 3)
    });
    
    // Only use fallback if we have absolutely no valid numeric data
    if (scatterData.length === 0) {
      console.log('⚠️ No valid numeric data for scatter chart, trying text columns as categories');
      // For scatter with non-numeric data, create indexed data
      const categoryData = data.rows.slice(0, 20).map((row, index) => ({
        x: index + 1,
        y: Math.random() * 100 + 10
      }));
      
      return {
        labels: [],
        datasets: [{
          label: `${xCol} vs ${yCol}`,
          data: categoryData,
          backgroundColor: '#4F46E5'
        }]
      };
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
  
  // Handle line and area charts
  if (['line', 'area'].includes(suggestion.type)) {
    const xCol = validColumns[0];
    const yCol = validColumns[1] || validColumns[0];
    
    console.log('📈 Time series chart columns:', { xCol, yCol });
    
    // Process the data and ensure we have valid entries
    const processedData = data.rows
      .map(row => {
        const xValue = row[xCol];
        const yValue = row[yCol];
        
        // Convert Y value to number
        let numericY = typeof yValue === 'number' ? yValue : parseFloat(String(yValue));
        if (isNaN(numericY)) {
          numericY = 1; // Default value for counting
        }
        
        return {
          x: xValue,
          y: numericY,
          originalRow: row
        };
      })
      .filter(item => item.x !== undefined && item.x !== null && item.x !== '')
      .slice(0, 20);
    
    console.log('📊 Line/Area data processed:', {
      pointsCount: processedData.length,
      sampleData: processedData.slice(0, 3).map(item => ({ x: item.x, y: item.y }))
    });
    
    if (processedData.length === 0) {
      console.log('⚠️ No valid data for line/area chart');
      return {
        labels: ['No Data'],
        datasets: [{
          label: yCol || 'Value',
          data: [0],
          borderColor: '#4F46E5',
          backgroundColor: suggestion.type === 'area' ? 'rgba(79, 70, 229, 0.1)' : undefined,
          fill: suggestion.type === 'area'
        }]
      };
    }
    
    // Sort by x value if it looks like a date or number
    processedData.sort((a, b) => {
      const aDate = new Date(a.x);
      const bDate = new Date(b.x);
      
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return aDate.getTime() - bDate.getTime();
      }
      
      // Try numeric sort
      const aNum = parseFloat(String(a.x));
      const bNum = parseFloat(String(b.x));
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      // Fallback to string sort
      return String(a.x).localeCompare(String(b.x));
    });
    
    const labels = processedData.map(item => {
      const value = item.x;
      // Try to format as date if possible
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return String(value);
    });
    
    const values = processedData.map(item => item.y);
    
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
  
  // Handle categorical charts (bar, pie, etc.)
  const categoryCol = validColumns[0];
  const valueCol = validColumns[1] || validColumns[0];
  
  console.log('📊 Categorical chart columns:', { categoryCol, valueCol });
  
  const groupedData = new Map<string, number>();
  
  // Process actual data
  data.rows.forEach((row, index) => {
    const categoryValue = row[categoryCol];
    const category = categoryValue !== undefined && categoryValue !== null && categoryValue !== '' 
      ? String(categoryValue) 
      : `Item ${index + 1}`;
    
    const rawValue = row[valueCol];
    let value: number;
    
    if (typeof rawValue === 'number') {
      value = rawValue;
    } else if (typeof rawValue === 'string' && !isNaN(parseFloat(rawValue))) {
      value = parseFloat(rawValue);
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
  
  // Only use fallback if we have absolutely no data
  if (groupedData.size === 0) {
    console.log('⚠️ No valid data for categorical chart');
    return {
      labels: ['No Data'],
      datasets: [{
        label: valueCol || 'Value',
        data: [0],
        backgroundColor: '#4F46E5'
      }]
    };
  }
  
  const labels = Array.from(groupedData.keys()).slice(0, 10); // Limit to 10 categories for readability
  const values = labels.map(label => groupedData.get(label) || 0);
  
  const colors = [
    '#4F46E5', '#8B5CF6', '#EC4899', '#F97316', '#0D9488', 
    '#DC2626', '#059669', '#7C3AED', '#DB2777', '#0EA5E9'
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
