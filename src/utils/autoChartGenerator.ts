
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
  console.log('Generating chart suggestions for data:', data);
  
  const suggestions: ChartSuggestion[] = [];
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const categoricalColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');
  
  console.log('Column analysis:', { numericColumns, categoricalColumns, dateColumns });
  
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
  
  console.log('Generated suggestions:', suggestions);
  return suggestions.sort((a, b) => b.priority - a.priority);
}

// Create PowerBI-style dashboard layout
export function createChartsFromData(
  data: ProcessedData, 
  suggestions: ChartSuggestion[], 
  startPosition: Position = { x: 20, y: 20 }
): ChartItemType[] {
  console.log('Creating charts from data with suggestions:', suggestions);
  
  const charts: ChartItemType[] = [];
  
  // PowerBI-style grid layout - 4 columns, tight spacing
  const gridCols = 4;
  const chartWidth = 380;
  const chartHeight = 280;
  const horizontalGap = 10;
  const verticalGap = 10;
  
  suggestions.slice(0, 12).forEach((suggestion, index) => {
    console.log(`Creating chart ${index + 1}: ${suggestion.type}`);
    
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    
    const position = {
      x: startPosition.x + (col * (chartWidth + horizontalGap)),
      y: startPosition.y + (row * (chartHeight + verticalGap))
    };
    
    try {
      const chartData = prepareChartData(data, suggestion);
      const chart = createNewChartItem(suggestion.type, position);
      
      // PowerBI-style sizing
      chart.size = { width: chartWidth, height: chartHeight };
      chart.title = suggestion.title;
      chart.data = chartData;
      chart.id = uuidv4();
      
      console.log(`Successfully created chart: ${chart.title}`);
      charts.push(chart);
    } catch (error) {
      console.error(`Error creating chart ${suggestion.type}:`, error);
    }
  });
  
  console.log(`Created ${charts.length} charts total`);
  return charts;
}
