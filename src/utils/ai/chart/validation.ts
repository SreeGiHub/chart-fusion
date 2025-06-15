
import { ProcessedData } from "@/utils/dataProcessor";
import { AIChartSuggestion } from "../types";

export function validateAndOptimizeColumns(data: ProcessedData, suggestion: AIChartSuggestion): string[] {
  const availableColumns = data.columns.map(col => col.name);
  
  // Validate suggested columns exist
  const validColumns = suggestion.columns.filter(colName => 
    availableColumns.includes(colName)
  );
  
  if (validColumns.length > 0) {
    console.log('✅ Using validated columns:', validColumns);
    return validColumns;
  }
  
  // Intelligent fallback based on chart type and data structure
  console.log('⚠️ No valid columns found, generating intelligent fallback');
  
  const numericCols = data.columns.filter(col => col.type === 'number');
  const textCols = data.columns.filter(col => col.type === 'text');
  const dateCols = data.columns.filter(col => col.type === 'date');
  
  switch (suggestion.type) {
    case 'multi-row-card':
    case 'card':
    case 'gauge':
      return numericCols.length > 0 ? [numericCols[0].name] : [availableColumns[0]];
      
    case 'table':
      return availableColumns.slice(0, 6);
      
    case 'pie':
    case 'donut':
    case 'funnel':
      if (textCols.length > 0 && numericCols.length > 0) {
        return [textCols[0].name, numericCols[0].name];
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
      
    case 'scatter':
      if (numericCols.length >= 2) {
        return [numericCols[0].name, numericCols[1].name];
      }
      break;
      
    case 'stacked-bar':
    case 'stacked-column':
      if (textCols.length > 0 && numericCols.length >= 2) {
        return [textCols[0].name, numericCols[0].name, numericCols[1].name];
      }
      break;
      
    default:
      if (textCols.length > 0 && numericCols.length > 0) {
        return [textCols[0].name, numericCols[0].name];
      }
  }
  
  // Ultimate fallback
  return availableColumns.slice(0, Math.min(2, availableColumns.length));
}

export function analyzeDataQuality(data: ProcessedData): string {
  const totalCells = data.rows.length * data.columns.length;
  const emptyCells = data.rows.reduce((count, row) => {
    return count + data.columns.filter(col => 
      row[col.name] === null || row[col.name] === undefined || row[col.name] === ''
    ).length;
  }, 0);
  
  const completeness = ((totalCells - emptyCells) / totalCells * 100).toFixed(1);
  return `${completeness}% complete, ${data.rows.length} records, ${data.columns.length} attributes`;
}
