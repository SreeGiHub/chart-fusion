
import { ChartData, HeatmapDataPoint, ChartType } from "@/types";
import { ProcessedData } from "./dataProcessor";
import { ChartSuggestion } from "./autoChartGenerator";

export function prepareChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  console.log('Preparing chart data for:', suggestion.type, 'with data:', data);
  
  const relevantColumns = suggestion.columns;
  
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
  
  console.log('Using default chart data preparation for type:', suggestion.type);
  return prepareDefaultChartData(data, suggestion, relevantColumns);
}

function prepareDefaultChartData(data: ProcessedData, suggestion: ChartSuggestion, relevantColumns: string[]): ChartData {
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
  
  if (suggestion.type === 'line' || suggestion.type === 'area') {
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
      backgroundColor: suggestion.type === 'pie' || suggestion.type === 'donut' || suggestion.type === 'treemap'
        ? colors.slice(0, labels.length)
        : colors[0],
      borderColor: suggestion.type === 'line' ? colors[0] : undefined,
      borderWidth: suggestion.type === 'pie' || suggestion.type === 'donut' ? 2 : undefined
    }]
  };
}
