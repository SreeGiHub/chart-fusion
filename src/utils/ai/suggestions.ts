
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
  console.log('=== ADVANCED BUSINESS INTELLIGENCE CHART GENERATION ===');
  
  if (!geminiApiKey) {
    console.log('No Gemini API key provided, using business rule-based suggestions');
    return generateFallbackSuggestions(data);
  }

  try {
    const geminiService = new GeminiService(geminiApiKey);
    
    // Prepare comprehensive business analysis request
    const analysisRequest = {
      data: data.rows,
      columns: data.columns.map(col => ({
        name: col.name,
        type: col.type,
        description: col.description || `Business metric: ${col.name} (${col.type}) - analyze for strategic insights and patterns`
      })),
      availableChartTypes: AVAILABLE_CHART_TYPES,
      datasetSize: data.rows.length
    };

    console.log('Sending comprehensive business context to AI for strategic dashboard analysis...');
    console.log('Dataset context:', {
      size: data.rows.length,
      columns: data.columns.length,
      richDescriptions: data.columns.filter(c => c.description).length
    });
    
    const aiAnalysis = await geminiService.analyzeDataForCharts(analysisRequest);
    console.log('Strategic AI analysis received with business insights:', {
      insights: aiAnalysis.dataInsights.substring(0, 100) + '...',
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
      .sort((a, b) => b.priority - a.priority) // Sort by business priority
      .slice(0, 8); // Focus on top 8 most valuable insights

    console.log('Generated strategic chart recommendations:', aiSuggestions.map(s => ({
      type: s.type,
      title: s.title,
      priority: s.priority,
      goal: s.visualizationGoal,
      insight: s.businessInsight?.substring(0, 50) + '...'
    })));
    
    // Log business intelligence summary
    console.log('Business Intelligence Summary:');
    console.log('- Executive Summary:', aiAnalysis.executiveSummary.substring(0, 100) + '...');
    console.log('- Key Insights:', aiAnalysis.dataInsights.substring(0, 100) + '...');
    console.log('- Layout Strategy:', aiAnalysis.layoutRecommendations.substring(0, 100) + '...');
    if (aiAnalysis.kpis?.length > 0) {
      console.log('- KPIs identified:', aiAnalysis.kpis.length);
    }

    return aiSuggestions;

  } catch (error) {
    console.error('Advanced business intelligence analysis failed, using fallback:', error);
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
    // Prefer columns with good business context
    const businessColumns = columns.filter(col => 
      col.description && (col.type === 'number' || col.type === 'text')
    );
    
    if (businessColumns.length >= 2) {
      relevantColumns.push(businessColumns[0].name, businessColumns[1].name);
    } else if (columns.length >= 2) {
      // Fall back to first available columns
      relevantColumns.push(columns[0].name, columns[1].name);
    }
  } else if (relevantColumns.length === 1 && columns.length >= 2) {
    // Find a complementary column
    const complementaryColumn = columns.find(col => 
      col.name !== relevantColumns[0] && 
      (col.type === 'number' || col.type === 'text') &&
      col.description
    );
    if (complementaryColumn) {
      relevantColumns.push(complementaryColumn.name);
    } else {
      // Generic fallback
      const fallbackColumn = columns.find(col => col.name !== relevantColumns[0]);
      if (fallbackColumn) {
        relevantColumns.push(fallbackColumn.name);
      }
    }
  }
  
  return relevantColumns;
}
