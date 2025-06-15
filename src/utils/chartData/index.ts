
import { ChartData } from "@/types";
import { ProcessedData } from "../dataProcessor";
import { ChartSuggestion } from "../autoChartGenerator";
import { prepareEnhancedChartData } from "./enhanced";
import { prepareDefaultChartData } from "./defaultCharts";

export function prepareChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  console.log('\n=== CHART DATA PREPARATION ===');
  console.log('📊 Chart type:', suggestion.type);
  console.log('📋 Columns:', suggestion.columns);
  console.log('🗂️ Data:', {
    rows: data.rows.length,
    columns: data.columns.length,
    availableColumns: data.columns.map(col => col.name)
  });
  
  const relevantColumns = suggestion.columns;
  
  // Special handling for table charts
  if (suggestion.type === 'table') {
    console.log('🔧 Preparing table chart data...');
    const tableColumns = data.columns.slice(0, 6).map((col, index) => ({
      id: col.name.toLowerCase().replace(/\s+/g, '_'),
      header: col.name,
      accessor: col.name.toLowerCase().replace(/\s+/g, '_'),
      align: col.type === 'number' ? 'right' as const : 'left' as const
    }));

    const tableRows = data.rows.slice(0, 10).map(row => {
      const processedRow: Record<string, any> = {};
      data.columns.slice(0, 6).forEach(col => {
        const key = col.name.toLowerCase().replace(/\s+/g, '_');
        let value = row[col.name];
        
        // Format based on column type
        if (col.type === 'number' && typeof value === 'number') {
          value = value.toLocaleString();
        } else if (value === null || value === undefined) {
          value = '-';
        }
        
        processedRow[key] = value;
      });
      return processedRow;
    });

    console.log('✅ Table data prepared:', { columns: tableColumns.length, rows: tableRows.length });

    return {
      labels: [],
      datasets: [],
      tableColumns,
      tableRows
    };
  }

  // Special handling for multi-row cards
  if (suggestion.type === 'multi-row-card') {
    console.log('🔧 Preparing multi-row card data...');
    const numericColumns = data.columns.filter(col => col.type === 'number');
    const selectedColumns = numericColumns.slice(0, 4);
    
    const labels = selectedColumns.map(col => col.name);
    const values = selectedColumns.map(col => {
      const columnValues = data.rows
        .map(row => parseFloat(String(row[col.name])))
        .filter(val => !isNaN(val));
      
      return columnValues.length > 0 
        ? columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length
        : 0;
    });

    const changes = values.map(() => (Math.random() - 0.5) * 20); // Random change percentages

    return {
      labels,
      datasets: [
        {
          label: "Values",
          data: values,
          backgroundColor: "#4F46E5",
        },
        {
          label: "Changes",
          data: changes,
          backgroundColor: "#10B981",
        }
      ]
    };
  }
  
  // Try enhanced charts first
  const enhancedData = prepareEnhancedChartData(data, suggestion);
  if (enhancedData) {
    console.log('✅ Using enhanced chart data preparation');
    return enhancedData;
  }
  
  // Fall back to default chart data preparation
  console.log('📊 Using default chart data preparation for type:', suggestion.type);
  return prepareDefaultChartData(data, suggestion, relevantColumns);
}
