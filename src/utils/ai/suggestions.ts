
import { ProcessedData } from "@/utils/dataProcessor";
import { GeminiService } from "@/services/geminiService";
import { AIChartSuggestion, CHART_TYPE_MAP } from "./types";
import { generateFallbackSuggestions } from "./fallbackSuggestions";
import { ChartType } from "@/types";

// Available chart types that our system supports
const AVAILABLE_CHART_TYPES = [
  'bar', 'column', 'line', 'area', 'pie', 'donut', 'scatter', 'bubble',
  'card', 'gauge', 'treemap', 'funnel', 'radar', 'combo', 'table'
];

export async function generateAIChartSuggestions(
  data: ProcessedData, 
  geminiApiKey?: string
): Promise<AIChartSuggestion[]> {
  console.log('=== ENHANCED AI CHART SUGGESTION GENERATION ===');
  
  if (!geminiApiKey) {
    console.log('No Gemini API key provided, falling back to rule-based suggestions');
    return generateFallbackSuggestions(data);
  }

  try {
    const geminiService = new GeminiService(geminiApiKey);
    
    // Prepare enhanced analysis request
    const analysisRequest = {
      data: data.rows,
      columns: data.columns.map(col => ({
        name: col.name,
        type: col.type,
        description: col.description || ''
      })),
      availableChartTypes: AVAILABLE_CHART_TYPES,
      datasetSize: data.rows.length
    };

    console.log('Sending comprehensive data context to Gemini for intelligent analysis...');
    console.log('Dataset size:', data.rows.length);
    console.log('Columns with descriptions:', data.columns.map(c => ({ name: c.name, desc: c.description })));
    
    const aiAnalysis = await geminiService.analyzeDataForCharts(analysisRequest);
    console.log('Enhanced Gemini analysis received:', aiAnalysis);

    // Process AI suggestions with better mapping
    const aiSuggestions: AIChartSuggestion[] = aiAnalysis.chartSuggestions
      .filter(suggestion => isValidChartType(suggestion.chartType))
      .map(suggestion => ({
        type: mapChartType(suggestion.chartType),
        title: suggestion.title,
        description: suggestion.description,
        columns: getRelevantColumns(suggestion, data.columns),
        priority: suggestion.priority,
        reasoning: suggestion.reasoning,
        visualizationGoal: suggestion.visualizationGoal
      }))
      .sort((a, b) => b.priority - a.priority) // Sort by priority (highest first)
      .slice(0, 8); // Limit to top 8 suggestions

    console.log('Processed AI suggestions with priority ranking:', aiSuggestions);
    
    // Add executive summary to console for debugging
    console.log('Executive Summary:', aiAnalysis.executiveSummary);
    console.log('Layout Recommendations:', aiAnalysis.layoutRecommendations);

    return aiSuggestions;

  } catch (error) {
    console.error('Enhanced AI analysis failed, falling back to rule-based:', error);
    return generateFallbackSuggestions(data);
  }
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
  
  // Add x-axis column if it exists
  if (suggestion.xAxis && columns.some(col => col.name === suggestion.xAxis)) {
    relevantColumns.push(suggestion.xAxis);
  }
  
  // Add y-axis column if it exists
  if (suggestion.yAxis && columns.some(col => col.name === suggestion.yAxis)) {
    relevantColumns.push(suggestion.yAxis);
  }
  
  // If no valid columns found, use first two columns as fallback
  if (relevantColumns.length === 0 && columns.length >= 2) {
    relevantColumns.push(columns[0].name, columns[1].name);
  } else if (relevantColumns.length === 1 && columns.length >= 2) {
    // Find a good second column
    const otherColumn = columns.find(col => 
      col.name !== relevantColumns[0] && 
      (col.type === 'number' || col.type === 'text')
    );
    if (otherColumn) {
      relevantColumns.push(otherColumn.name);
    }
  }
  
  return relevantColumns;
}
