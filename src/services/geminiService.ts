
interface GeminiAnalysisRequest {
  data: any[];
  columns: Array<{
    name: string;
    type: 'number' | 'date' | 'text' | 'boolean';
  }>;
}

interface GeminiChartSuggestion {
  chartType: string;
  title: string;
  description: string;
  xAxis: string;
  yAxis: string;
  reasoning: string;
  priority: number;
}

interface GeminiAnalysisResponse {
  dataInsights: string;
  chartSuggestions: GeminiChartSuggestion[];
  layoutRecommendations: string;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeDataForCharts(request: GeminiAnalysisRequest): Promise<GeminiAnalysisResponse> {
    const sampleData = request.data.slice(0, 5); // Send first 5 rows for analysis
    
    const prompt = this.buildAnalysisPrompt(request.columns, sampleData);
    
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        throw new Error('No content received from Gemini API');
      }

      return this.parseGeminiResponse(content);
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  private buildAnalysisPrompt(columns: any[], sampleData: any[]): string {
    return `
You are a data visualization expert. Analyze this dataset and provide intelligent chart recommendations.

DATASET STRUCTURE:
Columns: ${columns.map(col => `${col.name} (${col.type})`).join(', ')}

SAMPLE DATA (first 5 rows):
${JSON.stringify(sampleData, null, 2)}

Please provide your analysis in this EXACT JSON format:
{
  "dataInsights": "Brief description of what this data represents and key patterns",
  "chartSuggestions": [
    {
      "chartType": "bar|line|pie|scatter|area|combo|card|gauge|funnel|treemap",
      "title": "Descriptive chart title",
      "description": "Why this chart is recommended",
      "xAxis": "column_name_for_x_axis",
      "yAxis": "column_name_for_y_axis", 
      "reasoning": "Explanation of why this visualization works",
      "priority": 1-10
    }
  ],
  "layoutRecommendations": "Suggestions for dashboard layout and chart positioning"
}

GUIDELINES:
- Suggest 3-6 diverse chart types
- Prioritize charts that best tell the data story
- Consider business context and common visualization patterns
- For time-series data, prioritize line/area charts
- For categorical comparisons, suggest bar/column charts
- For part-to-whole relationships, suggest pie/donut charts
- For correlations, suggest scatter plots
- Include KPI cards for key metrics
- Ensure chart types match available options: bar, column, line, area, pie, donut, scatter, bubble, combo, card, gauge, funnel, treemap, radar, heatmap, waterfall, histogram, boxplot, table, matrix, timeline, gantt

Return only valid JSON without any markdown formatting.
`;
  }

  private parseGeminiResponse(content: string): GeminiAnalysisResponse {
    try {
      // Clean the response - remove markdown formatting if present
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
      
      const parsed = JSON.parse(cleanContent);
      
      // Validate the response structure
      if (!parsed.dataInsights || !parsed.chartSuggestions || !Array.isArray(parsed.chartSuggestions)) {
        throw new Error('Invalid response structure from Gemini');
      }

      return {
        dataInsights: parsed.dataInsights,
        chartSuggestions: parsed.chartSuggestions.map((suggestion: any) => ({
          chartType: suggestion.chartType || 'bar',
          title: suggestion.title || 'Chart',
          description: suggestion.description || '',
          xAxis: suggestion.xAxis || '',
          yAxis: suggestion.yAxis || '',
          reasoning: suggestion.reasoning || '',
          priority: suggestion.priority || 5
        })),
        layoutRecommendations: parsed.layoutRecommendations || ''
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw content:', content);
      
      // Fallback response
      return {
        dataInsights: 'Unable to analyze data automatically. Using default analysis.',
        chartSuggestions: [
          {
            chartType: 'bar',
            title: 'Data Overview',
            description: 'Basic visualization of your data',
            xAxis: '',
            yAxis: '',
            reasoning: 'Default visualization',
            priority: 5
          }
        ],
        layoutRecommendations: 'Standard grid layout'
      };
    }
  }
}

export const createGeminiService = (apiKey: string) => new GeminiService(apiKey);
