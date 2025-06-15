
import { ChartData } from "@/types";
import { ProcessedData } from "../../dataProcessor";
import { ChartSuggestion } from "../../autoChartGenerator";

export function prepareCardChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  const relevantColumns = suggestion.columns;
  const valueCol = relevantColumns[0];
  
  console.log('\n=== ENHANCED CARD CHART PREPARATION ===');
  console.log('💳 Target column:', valueCol);
  console.log('📊 Available data:', {
    totalRows: data.rows.length,
    columnExists: data.columns.some(col => col.name === valueCol),
    columnType: data.columns.find(col => col.name === valueCol)?.type,
    sampleValues: data.rows.slice(0, 5).map(row => ({
      [valueCol]: row[valueCol],
      type: typeof row[valueCol]
    }))
  });
  
  // Find the actual column in data
  const actualColumn = data.columns.find(col => col.name === valueCol);
  if (!actualColumn) {
    console.warn('⚠️ Column not found, using first numeric column');
    const firstNumericCol = data.columns.find(col => col.type === 'number');
    if (firstNumericCol) {
      return prepareCardChartData(data, { ...suggestion, columns: [firstNumericCol.name] });
    }
  }
  
  // Extract and intelligently process values
  const processedValues = data.rows
    .map(row => {
      const rawValue = row[valueCol];
      
      // Handle different data types intelligently
      if (typeof rawValue === 'number') {
        return rawValue;
      } else if (typeof rawValue === 'string') {
        // Try to parse as number
        const parsed = parseFloat(rawValue.replace(/[,$%]/g, ''));
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    })
    .filter(val => val !== null && !isNaN(val) && isFinite(val));
  
  console.log('📈 Processed values:', {
    originalCount: data.rows.length,
    validCount: processedValues.length,
    sampleProcessed: processedValues.slice(0, 10),
    hasValidData: processedValues.length > 0
  });
  
  let metricValue = 0;
  let metricLabel = valueCol || 'Metric';
  let formattedValue = '0';
  
  if (processedValues.length > 0) {
    // Calculate meaningful metrics based on column characteristics
    const sum = processedValues.reduce((a, b) => a + b, 0);
    const avg = sum / processedValues.length;
    const max = Math.max(...processedValues);
    const min = Math.min(...processedValues);
    const count = processedValues.length;
    
    // Intelligent metric selection based on column name and data patterns
    const colLower = valueCol?.toLowerCase() || '';
    
    if (colLower.includes('total') || colLower.includes('sum') || colLower.includes('revenue') || colLower.includes('sales') || colLower.includes('amount')) {
      metricValue = sum;
      metricLabel = `Total ${valueCol}`;
      formattedValue = formatBusinessNumber(sum);
    } else if (colLower.includes('average') || colLower.includes('avg') || colLower.includes('mean')) {
      metricValue = avg;
      metricLabel = `Average ${valueCol}`;
      formattedValue = formatBusinessNumber(avg);
    } else if (colLower.includes('max') || colLower.includes('peak') || colLower.includes('highest')) {
      metricValue = max;
      metricLabel = `Maximum ${valueCol}`;
      formattedValue = formatBusinessNumber(max);
    } else if (colLower.includes('min') || colLower.includes('lowest')) {
      metricValue = min;
      metricLabel = `Minimum ${valueCol}`;
      formattedValue = formatBusinessNumber(min);
    } else if (colLower.includes('count') || colLower.includes('number') || colLower.includes('qty') || colLower.includes('quantity')) {
      metricValue = count;
      metricLabel = `Count of ${valueCol}`;
      formattedValue = count.toLocaleString();
    } else if (colLower.includes('rate') || colLower.includes('percent') || colLower.includes('%')) {
      metricValue = avg;
      metricLabel = `Average ${valueCol}`;
      formattedValue = `${avg.toFixed(1)}%`;
    } else if (actualColumn?.type === 'number') {
      // For numeric columns, intelligently choose based on data characteristics
      const range = max - min;
      if (range > 1000 || sum > 10000) {
        // Large numbers likely represent totals
        metricValue = sum;
        metricLabel = `Total ${valueCol}`;
        formattedValue = formatBusinessNumber(sum);
      } else {
        // Smaller numbers likely represent averages or rates
        metricValue = avg;
        metricLabel = `Average ${valueCol}`;
        formattedValue = formatBusinessNumber(avg);
      }
    } else {
      metricValue = count;
      metricLabel = `Count of ${valueCol}`;
      formattedValue = count.toLocaleString();
    }
  } else {
    // Count non-empty entries as fallback
    const nonEmptyCount = data.rows.filter(row => {
      const value = row[valueCol];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    metricValue = nonEmptyCount;
    metricLabel = `Count of ${valueCol}`;
    formattedValue = nonEmptyCount.toLocaleString();
  }
  
  console.log('✅ Card metric calculated:', { 
    metricValue, 
    metricLabel, 
    formattedValue,
    dataQuality: `${processedValues.length}/${data.rows.length} valid values`
  });
  
  return {
    labels: [metricLabel],
    datasets: [{
      label: metricLabel,
      data: [metricValue],
      backgroundColor: '#4F46E5',
      formattedValue: formattedValue // Add formatted display value
    }]
  };
}

export function prepareGaugeChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  const relevantColumns = suggestion.columns;
  const valueCol = relevantColumns[0];
  
  console.log('\n=== ENHANCED GAUGE CHART PREPARATION ===');
  console.log('🎯 Target column:', valueCol);
  
  const processedValues = data.rows
    .map(row => {
      const rawValue = row[valueCol];
      if (typeof rawValue === 'number') return rawValue;
      if (typeof rawValue === 'string') {
        const parsed = parseFloat(rawValue.replace(/[,$%]/g, ''));
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    })
    .filter(val => val !== null && !isNaN(val) && isFinite(val));
  
  console.log('🎯 Gauge values processed:', {
    validCount: processedValues.length,
    range: processedValues.length > 0 ? {
      min: Math.min(...processedValues),
      max: Math.max(...processedValues),
      avg: processedValues.reduce((a, b) => a + b, 0) / processedValues.length
    } : null
  });
  
  let currentValue = 0;
  let maxValue = 100;
  let displayValue = '0';
  
  if (processedValues.length > 0) {
    const avg = processedValues.reduce((a, b) => a + b, 0) / processedValues.length;
    const max = Math.max(...processedValues);
    const min = Math.min(...processedValues);
    
    // Smart gauge configuration based on data characteristics
    const colLower = valueCol?.toLowerCase() || '';
    
    if (colLower.includes('percent') || colLower.includes('%') || colLower.includes('rate')) {
      // Percentage data
      currentValue = Math.min(Math.max(avg, 0), 100);
      maxValue = 100;
      displayValue = `${currentValue.toFixed(1)}%`;
    } else if (colLower.includes('rating') || colLower.includes('score')) {
      // Rating data (assume 0-5 or 0-10 scale)
      const scale = max <= 5 ? 5 : 10;
      currentValue = (avg / scale) * 100;
      maxValue = 100;
      displayValue = `${avg.toFixed(1)}/${scale}`;
    } else if (max <= 100 && min >= 0) {
      // Looks like percentage or score data
      currentValue = Math.min(avg, 100);
      maxValue = 100;
      displayValue = currentValue.toFixed(1);
    } else {
      // Regular numeric data - convert to percentage of max
      currentValue = (avg / max) * 100;
      maxValue = 100;
      displayValue = formatBusinessNumber(avg);
    }
  } else {
    // Fallback: calculate completion percentage
    const totalRows = data.rows.length;
    const nonEmptyCount = data.rows.filter(row => {
      const value = row[valueCol];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    currentValue = totalRows > 0 ? (nonEmptyCount / totalRows) * 100 : 0;
    maxValue = 100;
    displayValue = `${currentValue.toFixed(1)}%`;
  }
  
  console.log('✅ Gauge configured:', { 
    currentValue, 
    maxValue, 
    displayValue,
    percentage: (currentValue / maxValue * 100).toFixed(1) + '%'
  });
  
  return {
    labels: [valueCol || 'Performance'],
    datasets: [{
      label: valueCol || 'Performance',
      data: [currentValue, maxValue - currentValue],
      backgroundColor: ['#4F46E5', '#E5E7EB'],
      borderWidth: 0,
      displayValue: displayValue
    }]
  };
}

// Helper function to format business numbers
function formatBusinessNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else if (value % 1 === 0) {
    return value.toLocaleString();
  } else {
    return value.toFixed(2);
  }
}
