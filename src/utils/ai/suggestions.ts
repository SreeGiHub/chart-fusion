
import { ProcessedData } from "@/utils/dataProcessor";
import { GeminiService } from "@/services/geminiService";
import { AIChartSuggestion, CHART_TYPE_MAP } from "./types";
import { generateFallbackSuggestions } from "./fallbackSuggestions";
import { ChartType } from "@/types";

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
        type: col.type,
        description: col.description
      }))
    };

    console.log('Sending data with descriptions to Gemini for analysis...');
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
  return CHART_TYPE_MAP[aiChartType.toLowerCase()] || 'bar';
}
