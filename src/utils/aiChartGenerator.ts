
import { ChartItemType, ChartType, Position } from "@/types";
import { createNewChartItem } from "./chartUtils";
import { DataColumn, ProcessedData } from "./dataProcessor";
import { prepareChartData } from "./chartDataPreparation";
import { v4 as uuidv4 } from "uuid";
import { GeminiService } from "@/services/geminiService";

export interface AIChartSuggestion {
  type: ChartType;
  title: string;
  description: string;
  columns: string[];
  priority: number;
  reasoning?: string;
}

export async function generateAIChartSuggestions(
  data: ProcessedData, 
  geminiApiKey?: string
): Promise<AIChartSuggestion[]> {
  console.log('=== AI CHART SUGGESTION GENERATION START ===');
  
  if (!geminiApiKey) {
    console.log('No Gemini API key provided, falling back to rule-based suggestions');
    return generateFallbackSuggestions(data);
  }

  try {
    const geminiService = new GeminiService(geminiApiKey);
    
    const analysisRequest = {
      data: data.rows,
      columns: data.columns.map(col => ({
        name: col.name,
        type: col.type
      }))
    };

    console.log('Sending data to Gemini for analysis...');
    const aiAnalysis = await geminiService.analyzeDataForCharts(analysisRequest);
    console.log('Gemini analysis received:', aiAnalysis);

    const aiSuggestions: AIChartSuggestion[] = aiAnalysis.chartSuggestions.map(suggestion => ({
      type: mapChartType(suggestion.chartType),
      title: suggestion.title,
      description: suggestion.description,
      columns: [suggestion.xAxis, suggestion.yAxis].filter(Boolean),
      priority: suggestion.priority,
      reasoning: suggestion.reasoning
    }));

    console.log('AI suggestions processed:', aiSuggestions);
    return aiSuggestions;

  } catch (error) {
    console.error('AI analysis failed, falling back to rule-based:', error);
    return generateFallbackSuggestions(data);
  }
}

function mapChartType(aiChartType: string): ChartType {
  const typeMap: Record<string, ChartType> = {
    'bar': 'bar',
    'column': 'column',
    'line': 'line',
    'area': 'area',
    'pie': 'pie',
    'donut': 'donut',
    'scatter': 'scatter',
    'bubble': 'bubble',
    'combo': 'combo',
    'card': 'card',
    'gauge': 'gauge',
    'funnel': 'funnel',
    'treemap': 'treemap',
    'radar': 'radar',
    'heatmap': 'heatmap',
    'waterfall': 'waterfall',
    'histogram': 'histogram',
    'boxplot': 'boxplot',
    'table': 'table',
    'matrix': 'matrix',
    'timeline': 'timeline',
    'gantt': 'gantt'
  };

  return typeMap[aiChartType.toLowerCase()] || 'bar';
}

function generateFallbackSuggestions(data: ProcessedData): AIChartSuggestion[] {
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const categoricalColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');

  const suggestions: AIChartSuggestion[] = [];

  // Time series charts if date columns exist
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'line',
      title: 'Trend Over Time',
      description: 'Shows trends in your data over time',
      columns: [dateColumns[0].name, numericColumns[0].name],
      priority: 9
    });
  }

  // Bar chart for categorical data
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'bar',
      title: 'Category Comparison',
      description: 'Compares values across categories',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 8
    });
  }

  // Pie chart for part-to-whole
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'pie',
      title: 'Distribution Breakdown',
      description: 'Shows the composition of your data',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 7
    });
  }

  // Scatter plot for correlation
  if (numericColumns.length >= 2) {
    suggestions.push({
      type: 'scatter',
      title: 'Correlation Analysis',
      description: 'Explores relationships between variables',
      columns: [numericColumns[0].name, numericColumns[1].name],
      priority: 6
    });
  }

  // KPI card for key metrics
  if (numericColumns.length > 0) {
    suggestions.push({
      type: 'card',
      title: 'Key Metric',
      description: 'Highlights important numbers',
      columns: [numericColumns[0].name],
      priority: 5
    });
  }

  return suggestions;
}

export function createAIChartsFromData(
  data: ProcessedData, 
  suggestions: AIChartSuggestion[], 
  startPosition: Position = { x: 20, y: 20 }
): ChartItemType[] {
  console.log('=== AI CHART CREATION START ===');
  
  const charts: ChartItemType[] = [];
  const gridCols = 4;
  const chartWidth = 380;
  const chartHeight = 280;
  const horizontalGap = 10;
  const verticalGap = 10;
  
  suggestions.slice(0, 12).forEach((suggestion, index) => {
    console.log(`Creating AI-suggested chart ${index + 1}: ${suggestion.type}`);
    
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    
    const position = {
      x: startPosition.x + (col * (chartWidth + horizontalGap)),
      y: startPosition.y + (row * (chartHeight + verticalGap))
    };
    
    try {
      const chartData = prepareChartData(data, {
        type: suggestion.type,
        title: suggestion.title,
        description: suggestion.description,
        columns: suggestion.columns,
        priority: suggestion.priority
      });
      
      const chart = createNewChartItem(suggestion.type, position);
      chart.size = { width: chartWidth, height: chartHeight };
      chart.title = suggestion.title;
      chart.data = chartData;
      chart.id = uuidv4();
      
      console.log(`Successfully created AI chart: ${chart.title}`);
      charts.push(chart);
    } catch (error) {
      console.error(`Error creating AI chart ${suggestion.type}:`, error);
    }
  });
  
  console.log(`Created ${charts.length} AI-enhanced charts`);
  return charts;
}
