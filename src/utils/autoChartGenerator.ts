
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

// Analyze data and suggest appropriate charts
export function generateChartSuggestions(data: ProcessedData): ChartSuggestion[] {
  const suggestions: ChartSuggestion[] = [];
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const categoricalColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');
  
  // Time series charts (if we have dates and numbers)
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    numericColumns.slice(0, 2).forEach((numCol, index) => {
      suggestions.push({
        type: index === 0 ? 'line' : 'area',
        title: `${numCol.name} Over Time`,
        description: `${numCol.name} trends over ${dateColumns[0].name}`,
        columns: [dateColumns[0].name, numCol.name],
        priority: 10
      });
    });
  }
  
  // Category breakdowns (categorical + numeric)
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    const topCategorical = categoricalColumns.slice(0, 2);
    const topNumeric = numericColumns.slice(0, 2);
    
    topCategorical.forEach((catCol, catIndex) => {
      topNumeric.forEach((numCol, numIndex) => {
        const chartType = catIndex === 0 && numIndex === 0 ? 'bar' : 
                         catIndex === 0 && numIndex === 1 ? 'pie' :
                         'donut';
        
        suggestions.push({
          type: chartType,
          title: `${numCol.name} by ${catCol.name}`,
          description: `Distribution of ${numCol.name} across ${catCol.name}`,
          columns: [catCol.name, numCol.name],
          priority: 8
        });
      });
    });
  }
  
  // Correlation charts (two numeric columns)
  if (numericColumns.length >= 2) {
    for (let i = 0; i < Math.min(numericColumns.length - 1, 2); i++) {
      suggestions.push({
        type: 'scatter',
        title: `${numericColumns[i].name} vs ${numericColumns[i + 1].name}`,
        description: `Relationship between ${numericColumns[i].name} and ${numericColumns[i + 1].name}`,
        columns: [numericColumns[i].name, numericColumns[i + 1].name],
        priority: 6
      });
    }
  }
  
  // Summary cards for key metrics
  numericColumns.slice(0, 2).forEach(col => {
    suggestions.push({
      type: 'card',
      title: `Total ${col.name}`,
      description: `Sum of all ${col.name} values`,
      columns: [col.name],
      priority: 4
    });
  });
  
  // Multi-series comparisons
  if (numericColumns.length >= 3 && categoricalColumns.length >= 1) {
    suggestions.push({
      type: 'bar',
      title: 'Multi-Metric Comparison',
      description: `Compare ${numericColumns.slice(0, 3).map(c => c.name).join(', ')}`,
      columns: [categoricalColumns[0].name, ...numericColumns.slice(0, 3).map(c => c.name)],
      priority: 5
    });
  }
  
  // Sort by priority and limit to 8 suggestions
  return suggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 8);
}

// Convert data to chart format
export function createChartsFromData(
  data: ProcessedData, 
  suggestions: ChartSuggestion[], 
  startPosition: Position = { x: 50, y: 50 }
): ChartItemType[] {
  const charts: ChartItemType[] = [];
  const gridCols = 3;
  const chartSpacing = { x: 450, y: 350 };
  
  suggestions.forEach((suggestion, index) => {
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    const position = {
      x: startPosition.x + (col * chartSpacing.x),
      y: startPosition.y + (row * chartSpacing.y)
    };
    
    const chartData = prepareChartData(data, suggestion);
    const chart = createNewChartItem(suggestion.type, position);
    
    chart.title = suggestion.title;
    chart.data = chartData;
    chart.id = uuidv4();
    
    charts.push(chart);
  });
  
  return charts;
}

// Prepare data in chart format
function prepareChartData(data: ProcessedData, suggestion: ChartSuggestion) {
  const relevantColumns = suggestion.columns;
  
  if (suggestion.type === 'card') {
    // For card charts, calculate summary statistics
    const column = data.columns.find(col => col.name === relevantColumns[0]);
    if (column && column.type === 'number') {
      const values = data.rows.map(row => row[column.name]).filter(val => typeof val === 'number');
      const sum = values.reduce((acc, val) => acc + val, 0);
      
      return {
        labels: ['Total'],
        datasets: [{
          label: column.name,
          data: [sum],
          backgroundColor: '#4F46E5'
        }]
      };
    }
  }
  
  if (suggestion.type === 'scatter') {
    // For scatter plots
    const xCol = relevantColumns[0];
    const yCol = relevantColumns[1];
    
    const scatterData = data.rows
      .filter(row => typeof row[xCol] === 'number' && typeof row[yCol] === 'number')
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
    // For time series
    const dateCol = relevantColumns[0];
    const valueCol = relevantColumns[1];
    
    const timeData = data.rows
      .filter(row => row[dateCol] && typeof row[valueCol] === 'number')
      .sort((a, b) => new Date(a[dateCol]).getTime() - new Date(b[dateCol]).getTime());
    
    return {
      labels: timeData.map(row => {
        const date = new Date(row[dateCol]);
        return date.toLocaleDateString();
      }),
      datasets: [{
        label: valueCol,
        data: timeData.map(row => row[valueCol]),
        borderColor: '#4F46E5',
        backgroundColor: suggestion.type === 'area' ? '#4F46E533' : undefined,
        fill: suggestion.type === 'area'
      }]
    };
  }
  
  // For categorical charts (bar, pie, donut)
  const categoryCol = relevantColumns[0];
  const valueCol = relevantColumns[1];
  
  // Group by category and sum values
  const groupedData = new Map<string, number>();
  data.rows.forEach(row => {
    const category = String(row[categoryCol] || 'Unknown');
    const value = typeof row[valueCol] === 'number' ? row[valueCol] : 0;
    groupedData.set(category, (groupedData.get(category) || 0) + value);
  });
  
  const labels = Array.from(groupedData.keys());
  const values = Array.from(groupedData.values());
  
  return {
    labels,
    datasets: [{
      label: valueCol,
      data: values,
      backgroundColor: [
        '#4F46E5', '#8B5CF6', '#EC4899', '#F97316', '#0D9488', 
        '#DC2626', '#059669', '#7C3AED', '#DB2777'
      ].slice(0, labels.length)
    }]
  };
}
