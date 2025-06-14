
import { ChartData, HeatmapDataPoint } from "@/types";
import { ProcessedData } from "../dataProcessor";
import { ChartSuggestion } from "../autoChartGenerator";

export function prepareEnhancedChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData | null {
  console.log('Preparing enhanced chart data for:', suggestion.type, 'with data:', data);
  
  // Enhanced gauge chart
  if (suggestion.type === 'gauge') {
    const column = data.columns.find(col => col.type === 'number');
    if (column) {
      const values = data.rows.map(row => row[column.name]).filter(val => typeof val === 'number');
      const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
      const percentage = Math.min(Math.max((avg / Math.max(...values)) * 100, 0), 100);
      
      return {
        labels: ['Progress'],
        datasets: [{
          label: 'KPI Score',
          data: [percentage, 100 - percentage],
          backgroundColor: ['#4F46E5', '#E5E7EB'],
          borderWidth: 0
        }]
      };
    }
  }
  
  // Enhanced radar chart
  if (suggestion.type === 'radar') {
    const numericCols = data.columns.filter(col => col.type === 'number').slice(0, 6);
    if (numericCols.length > 0) {
      const avgValues = numericCols.map(col => {
        const values = data.rows.map(row => row[col.name]).filter(val => typeof val === 'number');
        return values.reduce((acc, val) => acc + val, 0) / values.length;
      });
      
      return {
        labels: numericCols.map(col => col.name),
        datasets: [{
          label: 'Performance Metrics',
          data: avgValues,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: '#4F46E5',
          borderWidth: 2,
          fill: true
        }]
      };
    }
  }
  
  // Enhanced heatmap with proper typing
  if (suggestion.type === 'heatmap') {
    const sampleData: HeatmapDataPoint[] = [
      { x: 'Q1', y: 'Product A', v: 65 },
      { x: 'Q2', y: 'Product A', v: 59 },
      { x: 'Q3', y: 'Product A', v: 80 },
      { x: 'Q4', y: 'Product A', v: 81 },
      { x: 'Q1', y: 'Product B', v: 28 },
      { x: 'Q2', y: 'Product B', v: 48 },
      { x: 'Q3', y: 'Product B', v: 40 },
      { x: 'Q4', y: 'Product B', v: 19 }
    ];
    
    return {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Performance Heatmap',
        data: sampleData,
        backgroundColor: '#4F46E5'
      }]
    };
  }
  
  // Enhanced funnel chart
  if (suggestion.type === 'funnel') {
    return {
      labels: ['Prospects', 'Qualified Leads', 'Proposals', 'Negotiations', 'Closed Won'],
      datasets: [{
        label: 'Sales Funnel',
        data: [1000, 750, 500, 300, 200],
        backgroundColor: [
          '#4F46E5',
          '#8B5CF6', 
          '#EC4899',
          '#F97316',
          '#0D9488'
        ]
      }]
    };
  }
  
  // Enhanced treemap
  if (suggestion.type === 'treemap') {
    return {
      labels: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'],
      datasets: [{
        label: 'Market Segments',
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#4F46E5',
          '#8B5CF6', 
          '#EC4899',
          '#F97316',
          '#0D9488'
        ]
      }]
    };
  }
  
  // Enhanced table
  if (suggestion.type === 'table') {
    return {
      labels: [],
      datasets: [],
      tableColumns: data.columns.slice(0, 4).map(col => ({
        id: col.name,
        header: col.name,
        accessor: col.name,
        align: 'left' as const
      })),
      tableRows: data.rows.slice(0, 10).map(row => {
        const tableRow: any = {};
        data.columns.slice(0, 4).forEach(col => {
          tableRow[col.name] = row[col.name] || '';
        });
        return tableRow;
      })
    };
  }
  
  return null;
}
