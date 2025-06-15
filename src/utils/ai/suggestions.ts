
import { ProcessedData } from "@/utils/dataProcessor";
import { GeminiService } from "@/services/geminiService";
import { AIChartSuggestion, CHART_TYPE_MAP } from "./types";
import { generateFallbackSuggestions } from "./fallbackSuggestions";
import { ChartType } from "@/types";

// Available chart types that our system supports (expanded list)
const AVAILABLE_CHART_TYPES = [
  'bar', 'column', 'line', 'area', 'pie', 'donut', 'scatter', 'bubble',
  'card', 'gauge', 'treemap', 'funnel', 'radar', 'combo', 'table'
];

export async function generateAIChartSuggestions(
  data: ProcessedData, 
  geminiApiKey?: string
): Promise<AIChartSuggestion[]> {
  console.log('=== ADVANCED BUSINESS INTELLIGENCE CHART GENERATION ===');
  
  if (!geminiApiKey) {
    console.log('No Gemini API key provided, using enhanced business rule-based suggestions');
    return generateEnhancedFallbackSuggestions(data);
  }

  try {
    const geminiService = new GeminiService(geminiApiKey);
    
    // Prepare comprehensive business analysis request
    const analysisRequest = {
      data: data.rows.slice(0, 20), // Send more sample data
      columns: data.columns.map(col => ({
        name: col.name,
        type: col.type,
        description: col.description || `Business metric: ${col.name} (${col.type}) - analyze for strategic insights and patterns`
      })),
      availableChartTypes: AVAILABLE_CHART_TYPES,
      datasetSize: data.rows.length
    };

    console.log('Sending comprehensive business context to AI for strategic dashboard analysis...');
    
    const aiAnalysis = await geminiService.analyzeDataForCharts(analysisRequest);
    console.log('Strategic AI analysis received:', {
      chartCount: aiAnalysis.chartSuggestions.length,
      kpiCount: aiAnalysis.kpis?.length || 0
    });

    // Process AI suggestions with enhanced business context
    const aiSuggestions: AIChartSuggestion[] = aiAnalysis.chartSuggestions
      .filter(suggestion => isValidChartType(suggestion.chartType))
      .map(suggestion => ({
        type: mapChartType(suggestion.chartType),
        title: suggestion.title,
        description: suggestion.description,
        columns: getRelevantColumns(suggestion, data.columns),
        priority: suggestion.priority,
        reasoning: suggestion.reasoning,
        visualizationGoal: suggestion.visualizationGoal,
        businessInsight: suggestion.businessInsight
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);

    console.log('Generated strategic chart recommendations:', aiSuggestions.map(s => ({
      type: s.type,
      title: s.title,
      columns: s.columns,
      priority: s.priority
    })));

    return aiSuggestions;

  } catch (error) {
    console.error('Advanced business intelligence analysis failed, using enhanced fallback:', error);
    return generateEnhancedFallbackSuggestions(data);
  }
}

function generateEnhancedFallbackSuggestions(data: ProcessedData): AIChartSuggestion[] {
  console.log('Generating enhanced fallback suggestions with full chart type support');
  
  const suggestions: AIChartSuggestion[] = [];
  const numCols = data.columns.filter(col => col.type === 'number');
  const textCols = data.columns.filter(col => col.type === 'text');
  const dateCols = data.columns.filter(col => col.type === 'date');

  // KPI Cards for key metrics
  if (numCols.length > 0) {
    suggestions.push({
      type: 'card',
      title: `Total ${numCols[0].name}`,
      description: `Key performance indicator showing total ${numCols[0].name}`,
      columns: [numCols[0].name],
      priority: 9,
      visualizationGoal: 'kpi_tracking',
      businessInsight: `Monitor key business metric: ${numCols[0].name}`
    });
  }

  // Bubble chart for multi-dimensional analysis
  if (numCols.length >= 3) {
    suggestions.push({
      type: 'bubble',
      title: `${numCols[0].name} vs ${numCols[1].name} Analysis`,
      description: `Multi-dimensional analysis showing relationship between ${numCols[0].name}, ${numCols[1].name}, and ${numCols[2].name}`,
      columns: [numCols[0].name, numCols[1].name, numCols[2].name],
      priority: 8,
      visualizationGoal: 'correlation_analysis',
      businessInsight: `Identify patterns and correlations in your key business metrics`
    });
  }

  // Scatter plot for correlation analysis
  if (numCols.length >= 2) {
    suggestions.push({
      type: 'scatter',
      title: `${numCols[0].name} vs ${numCols[1].name} Correlation`,
      description: `Correlation analysis between ${numCols[0].name} and ${numCols[1].name}`,
      columns: [numCols[0].name, numCols[1].name],
      priority: 7,
      visualizationGoal: 'performance_optimization',
      businessInsight: `Understand the relationship between these critical business factors`
    });
  }

  // Pie chart for composition analysis
  if (textCols.length > 0 && numCols.length > 0) {
    suggestions.push({
      type: 'pie',
      title: `${textCols[0].name} Distribution`,
      description: `Market share and composition analysis by ${textCols[0].name}`,
      columns: [textCols[0].name, numCols[0].name],
      priority: 7,
      visualizationGoal: 'market_analysis',
      businessInsight: `Understand market composition and identify opportunities`
    });
  }

  // Line chart for trend analysis
  if (dateCols.length > 0 && numCols.length > 0) {
    suggestions.push({
      type: 'line',
      title: `${numCols[0].name} Trends Over Time`,
      description: `Time series analysis showing ${numCols[0].name} performance trends`,
      columns: [dateCols[0].name, numCols[0].name],
      priority: 8,
      visualizationGoal: 'trend_identification',
      businessInsight: `Track performance trends and identify growth patterns`
    });
  }

  // Bar chart for comparisons
  if (textCols.length > 0 && numCols.length > 0) {
    suggestions.push({
      type: 'bar',
      title: `${numCols[0].name} by ${textCols[0].name}`,
      description: `Comparative analysis of ${numCols[0].name} across different ${textCols[0].name}`,
      columns: [textCols[0].name, numCols[0].name],
      priority: 6,
      visualizationGoal: 'competitive_analysis',
      businessInsight: `Compare performance across categories to identify leaders`
    });
  }

  // Gauge for performance tracking
  if (numCols.length > 0) {
    suggestions.push({
      type: 'gauge',
      title: `${numCols[0].name} Performance`,
      description: `Performance gauge showing current ${numCols[0].name} metrics`,
      columns: [numCols[0].name],
      priority: 7,
      visualizationGoal: 'goal_tracking',
      businessInsight: `Track progress towards your business goals`
    });
  }

  console.log('Enhanced fallback suggestions generated:', suggestions.length);
  return suggestions.slice(0, 8);
}

function isValidChartType(chartType: string): boolean {
  return AVAILABLE_CHART_TYPES.includes(chartType.toLowerCase());
}

function mapChartType(aiChartType: string): ChartType {
  const normalizedType = aiChartType.toLowerCase();
  return CHART_TYPE_MAP[normalizedType] || 'bar';
}

function getRelevantColumns(suggestion: any, columns: any[]): string[] {
  const relevantColumns: string[] = [];
  
  // Add x-axis column if it exists and is valid
  if (suggestion.xAxis && columns.some(col => col.name === suggestion.xAxis)) {
    relevantColumns.push(suggestion.xAxis);
  }
  
  // Add y-axis column if it exists and is valid
  if (suggestion.yAxis && columns.some(col => col.name === suggestion.yAxis)) {
    relevantColumns.push(suggestion.yAxis);
  }
  
  // Smart fallback: if no valid columns found, use best available columns
  if (relevantColumns.length === 0) {
    const businessColumns = columns.filter(col => 
      col.description && (col.type === 'number' || col.type === 'text')
    );
    
    if (businessColumns.length >= 2) {
      relevantColumns.push(businessColumns[0].name, businessColumns[1].name);
    } else if (columns.length >= 2) {
      relevantColumns.push(columns[0].name, columns[1].name);
    }
  } else if (relevantColumns.length === 1 && columns.length >= 2) {
    const complementaryColumn = columns.find(col => 
      col.name !== relevantColumns[0] && 
      (col.type === 'number' || col.type === 'text') &&
      col.description
    );
    if (complementaryColumn) {
      relevantColumns.push(complementaryColumn.name);
    } else {
      const fallbackColumn = columns.find(col => col.name !== relevantColumns[0]);
      if (fallbackColumn) {
        relevantColumns.push(fallbackColumn.name);
      }
    }
  }
  
  return relevantColumns;
}
