
import { ChartItemType, ChartType, Position } from "@/types";
import { createNewChartItem } from "./chartUtils";
import { DataColumn, ProcessedData } from "./dataProcessor";
import { prepareChartData } from "./chartDataPreparation";
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
