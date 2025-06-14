
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
  console.log('=== CHART SUGGESTION GENERATION START ===');
  console.log('Input data:', data);
  console.log('Data columns:', data.columns);
  console.log('Data rows count:', data.rows.length);
  console.log('Sample rows:', data.rows.slice(0, 3));
  
  const suggestions: ChartSuggestion[] = [];
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const categoricalColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');
  
  console.log('Column analysis:', { 
    numericColumns: numericColumns.map(c => c.name), 
    categoricalColumns: categoricalColumns.map(c => c.name), 
    dateColumns: dateColumns.map(c => c.name) 
  });
  
  POWERBI_CHART_CONFIGS.forEach(config => {
    let columns: string[] = [];
    
    console.log(`Processing chart type: ${config.type}`);
    
    // Assign appropriate columns based on chart type
    if (config.type === 'line' || config.type === 'area') {
      if (dateColumns.length > 0 && numericColumns.length > 0) {
        columns = [dateColumns[0].name, numericColumns[0].name];
      } else if (categoricalColumns.length > 0 && numericColumns.length > 0) {
        columns = [categoricalColumns[0].name, numericColumns[0].name];
      } else {
        columns = ['Category', 'Value'];
      }
    } else if (config.type === 'scatter') {
      if (numericColumns.length >= 2) {
        columns = [numericColumns[0].name, numericColumns[1].name];
      } else if (numericColumns.length === 1) {
        columns = [numericColumns[0].name, numericColumns[0].name];
      } else {
        columns = ['X Value', 'Y Value'];
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
      // Default for bar, etc.
      if (categoricalColumns.length > 0 && numericColumns.length > 0) {
        columns = [categoricalColumns[0].name, numericColumns[0].name];
      } else if (data.columns.length >= 2) {
        columns = data.columns.slice(0, 2).map(c => c.name);
      } else {
        columns = ['Category', 'Value'];
      }
    }
    
    console.log(`Chart ${config.type} assigned columns:`, columns);
    
    const suggestion = {
      type: config.type,
      title: config.title,
      description: `Professional ${config.type} chart for data analysis`,
      columns,
      priority: config.priority
    };
    
    suggestions.push(suggestion);
    console.log(`Added suggestion:`, suggestion);
  });
  
  console.log('=== FINAL SUGGESTIONS ===');
  console.log('Total suggestions:', suggestions.length);
  suggestions.forEach((s, i) => console.log(`${i + 1}. ${s.type}: ${s.title} [${s.columns.join(', ')}]`));
  
  return suggestions.sort((a, b) => b.priority - a.priority);
}

// Create PowerBI-style dashboard layout
export function createChartsFromData(
  data: ProcessedData, 
  suggestions: ChartSuggestion[], 
  startPosition: Position = { x: 20, y: 20 }
): ChartItemType[] {
  console.log('=== CHART CREATION START ===');
  console.log('Input data:', data);
  console.log('Suggestions to process:', suggestions.length);
  console.log('Start position:', startPosition);
  
  const charts: ChartItemType[] = [];
  
  // PowerBI-style grid layout - 4 columns, tight spacing
  const gridCols = 4;
  const chartWidth = 380;
  const chartHeight = 280;
  const horizontalGap = 10;
  const verticalGap = 10;
  
  suggestions.slice(0, 12).forEach((suggestion, index) => {
    console.log(`=== Creating chart ${index + 1}: ${suggestion.type} ===`);
    
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    
    const position = {
      x: startPosition.x + (col * (chartWidth + horizontalGap)),
      y: startPosition.y + (row * (chartHeight + verticalGap))
    };
    
    console.log(`Chart position: col=${col}, row=${row}, position=`, position);
    
    try {
      console.log('Preparing chart data...');
      const chartData = prepareChartData(data, suggestion);
      console.log('Chart data prepared:', chartData);
      
      console.log('Creating new chart item...');
      const chart = createNewChartItem(suggestion.type, position);
      console.log('Base chart item created:', chart);
      
      // PowerBI-style sizing
      chart.size = { width: chartWidth, height: chartHeight };
      chart.title = suggestion.title;
      chart.data = chartData;
      chart.id = uuidv4();
      
      console.log(`Successfully created chart: ${chart.title} (${chart.id})`);
      console.log('Final chart object:', chart);
      charts.push(chart);
    } catch (error) {
      console.error(`Error creating chart ${suggestion.type}:`, error);
      console.error('Error details:', error.message, error.stack);
    }
  });
  
  console.log('=== CHART CREATION COMPLETE ===');
  console.log(`Created ${charts.length} charts total`);
  charts.forEach((chart, i) => {
    console.log(`Chart ${i + 1}: ${chart.type} - ${chart.title} at (${chart.position.x}, ${chart.position.y})`);
  });
  
  return charts;
}
