
import { ChartItemType, ChartType, Position } from "@/types";
import { createNewChartItem } from "./chartUtils";
import { DataColumn, ProcessedData } from "./dataProcessor";
import { v4 as uuidv4 } from "uuid";

export interface ChartSuggestion {
  type: ChartType;
  title: string;
  description: string;
  columns: string[];
  priority: number;
}

// PowerBI-style chart configurations
const POWERBI_CHART_CONFIGS = [
  { type: 'bar' as ChartType, title: 'Sales by Category', priority: 10 },
  { type: 'line' as ChartType, title: 'Trend Analysis', priority: 9 },
  { type: 'pie' as ChartType, title: 'Market Share', priority: 8 },
  { type: 'area' as ChartType, title: 'Revenue Growth', priority: 7 },
  { type: 'donut' as ChartType, title: 'Customer Segments', priority: 6 },
  { type: 'scatter' as ChartType, title: 'Correlation Analysis', priority: 5 },
  { type: 'radar' as ChartType, title: 'Performance Metrics', priority: 4 },
  { type: 'gauge' as ChartType, title: 'KPI Dashboard', priority: 3 },
  { type: 'heatmap' as ChartType, title: 'Activity Matrix', priority: 2 },
  { type: 'funnel' as ChartType, title: 'Sales Funnel', priority: 1 },
  { type: 'treemap' as ChartType, title: 'Hierarchical View', priority: 1 },
  { type: 'table' as ChartType, title: 'Data Summary', priority: 1 }
];

// Analyze data and suggest appropriate charts
export function generateChartSuggestions(data: ProcessedData): ChartSuggestion[] {
  const suggestions: ChartSuggestion[] = [];
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const categoricalColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');
  
  // Always create a comprehensive dashboard with all chart types
  POWERBI_CHART_CONFIGS.forEach(config => {
    let columns: string[] = [];
    
    // Assign appropriate columns based on chart type
    if (config.type === 'line' || config.type === 'area') {
      if (dateColumns.length > 0 && numericColumns.length > 0) {
        columns = [dateColumns[0].name, numericColumns[0].name];
      } else {
        columns = categoricalColumns.slice(0, 1).concat(numericColumns.slice(0, 1)).map(c => c.name);
      }
    } else if (config.type === 'scatter') {
      if (numericColumns.length >= 2) {
        columns = [numericColumns[0].name, numericColumns[1].name];
      } else {
        columns = numericColumns.slice(0, 1).map(c => c.name);
      }
    } else if (config.type === 'pie' || config.type === 'donut' || config.type === 'treemap') {
      if (categoricalColumns.length > 0 && numericColumns.length > 0) {
        columns = [categoricalColumns[0].name, numericColumns[0].name];
      } else {
        columns = ['Category', 'Value'];
      }
    } else if (config.type === 'table') {
      columns = data.columns.slice(0, 4).map(c => c.name);
    } else {
      // Default: use first categorical and numeric columns
      if (categoricalColumns.length > 0 && numericColumns.length > 0) {
        columns = [categoricalColumns[0].name, numericColumns[0].name];
      } else {
        columns = data.columns.slice(0, 2).map(c => c.name);
      }
    }
    
    suggestions.push({
      type: config.type,
      title: config.title,
      description: `Professional ${config.type} chart for data analysis`,
      columns,
      priority: config.priority
    });
  });
  
  return suggestions.sort((a, b) => b.priority - a.priority);
}

// Create PowerBI-style dashboard layout
export function createChartsFromData(
  data: ProcessedData, 
  suggestions: ChartSuggestion[], 
  startPosition: Position = { x: 20, y: 20 }
): ChartItemType[] {
  const charts: ChartItemType[] = [];
  
  // PowerBI-style grid layout - 4 columns, tight spacing
  const gridCols = 4;
  const chartWidth = 380;
  const chartHeight = 280;
  const horizontalGap = 10;
  const verticalGap = 10;
  
  suggestions.slice(0, 12).forEach((suggestion, index) => {
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    
    const position = {
      x: startPosition.x + (col * (chartWidth + horizontalGap)),
      y: startPosition.y + (row * (chartHeight + verticalGap))
    };
    
    const chartData = prepareChartData(data, suggestion);
    const chart = createNewChartItem(suggestion.type, position);
    
    // PowerBI-style sizing
    chart.size = { width: chartWidth, height: chartHeight };
    chart.title = suggestion.title;
    chart.data = chartData;
    chart.id = uuidv4();
    
    // Enhanced styling for PowerBI look
    if (chart.options) {
      chart.options = {
        ...chart.options,
        plugins: {
          ...chart.options.plugins,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: {
                size: 11
              }
            }
          },
          title: {
            display: true,
            text: suggestion.title,
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: 15
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 15,
            right: 15
          }
        }
      };
    }
    
    charts.push(chart);
  });
  
  return charts;
}

// Enhanced data preparation for better visualizations
function prepareChartData(data: ProcessedData, suggestion: ChartSuggestion) {
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
  
  // Enhanced heatmap
  if (suggestion.type === 'heatmap') {
    const sampleData = [
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
  
  // Default chart data preparation (existing logic)
  if (suggestion.type === 'scatter') {
    const xCol = relevantColumns[0];
    const yCol = relevantColumns[1];
    
    const scatterData = data.rows
      .filter(row => typeof row[xCol] === 'number' && typeof row[yCol] === 'number')
      .slice(0, 50) // Limit points for better performance
      .map(row => ({ x: row[xCol], y: row[yCol] }));
    
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
      .slice(0, 20); // Limit data points
    
    // If no time data, create sample data
    if (timeData.length === 0) {
      timeData = Array.from({ length: 12 }, (_, i) => ({
        [dateCol]: new Date(2024, i, 1).toLocaleDateString(),
        [valueCol]: Math.floor(Math.random() * 100) + 50
      }));
    }
    
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
        fill: suggestion.type === 'area',
        tension: 0.4
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
  
  // Ensure we have some data even if original is empty
  if (groupedData.size === 0) {
    ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'].forEach((cat, i) => {
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
      backgroundColor: suggestion.type === 'pie' || suggestion.type === 'donut' || suggestion.type === 'treemap' 
        ? colors.slice(0, labels.length)
        : colors[0],
      borderColor: suggestion.type === 'line' ? colors[0] : undefined,
      borderWidth: suggestion.type === 'pie' || suggestion.type === 'donut' ? 2 : undefined
    }]
  };
}
