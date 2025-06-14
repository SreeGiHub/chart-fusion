
interface GeminiAnalysisRequest {
  data: any[];
  columns: Array<{
    name: string;
    type: 'number' | 'date' | 'text' | 'boolean';
    description?: string;
  }>;
  availableChartTypes: string[];
  datasetSize: number;
}

interface GeminiChartSuggestion {
  chartType: string;
  title: string;
  description: string;
  xAxis: string;
  yAxis: string;
  reasoning: string;
  priority: number;
  visualizationGoal: string;
}

interface GeminiAnalysisResponse {
  dataInsights: string;
  chartSuggestions: GeminiChartSuggestion[];
  layoutRecommendations: string;
  executiveSummary: string;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeDataForCharts(request: GeminiAnalysisRequest): Promise<GeminiAnalysisResponse> {
    const sampleData = request.data.slice(0, 10); // Send first 10 rows for better analysis
    
    const prompt = this.buildEnhancedAnalysisPrompt(request.columns, sampleData, request.availableChartTypes, request.datasetSize);
    
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
            temperature: 0.3,
            topP: 0.8,
            maxOutputTokens: 3000,
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

  private buildEnhancedAnalysisPrompt(columns: any[], sampleData: any[], availableChartTypes: string[], datasetSize: number): string {
    return `
You are an expert data visualization consultant analyzing business data to create an intelligent dashboard. Your goal is to recommend the most insightful charts that tell a compelling data story.

=== DATASET ANALYSIS ===
Total Records: ${datasetSize}
Columns with Rich Business Context:
${columns.map(col => `• ${col.name} (${col.type}): ${col.description || 'No description provided'}`).join('\n')}

Sample Data (showing patterns and relationships):
${JSON.stringify(sampleData, null, 2)}

=== AVAILABLE CHART TYPES ===
You can recommend from these chart types:
${availableChartTypes.map(type => `• ${type}`).join('\n')}

Chart Type Usage Guidelines:
- **bar/column**: Category comparisons, rankings, discrete data
- **line**: Time series, trends, continuous data over time
- **area**: Cumulative values, trend visualization with emphasis on volume
- **pie/donut**: Part-to-whole relationships, composition (max 7 categories)
- **scatter**: Correlation analysis, relationship between two continuous variables
- **card**: Key metrics, KPIs, single important values
- **gauge**: Progress toward goals, performance indicators (0-100% scales)
- **treemap**: Hierarchical data, nested categories with size relationships
- **funnel**: Process flow, conversion rates, sequential steps
- **radar**: Multi-dimensional comparison, skill assessments
- **table**: Detailed data exploration, when precision is needed

=== ANALYSIS REQUIREMENTS ===
Analyze the data and provide recommendations in this EXACT JSON format:

{
  "dataInsights": "Comprehensive analysis of what this data represents, key business patterns discovered, anomalies, trends, and relationships between variables",
  "executiveSummary": "High-level business summary of the most important insights and recommended actions",
  "chartSuggestions": [
    {
      "chartType": "exact_chart_type_from_available_list",
      "title": "Clear, business-focused title that indicates the insight",
      "description": "What specific business question this chart answers and what actions it enables",
      "xAxis": "exact_column_name_for_x_axis",
      "yAxis": "exact_column_name_for_y_axis_or_value",
      "reasoning": "Detailed explanation of why this chart type is optimal for this data relationship and business goal",
      "priority": 1-10,
      "visualizationGoal": "primary_business_objective (e.g., 'performance_tracking', 'trend_analysis', 'comparison', 'composition', 'correlation')"
    }
  ],
  "layoutRecommendations": "Strategic dashboard organization: which charts should be most prominent, suggested grid layout, information hierarchy for maximum business impact"
}

=== INTELLIGENT RECOMMENDATIONS CRITERIA ===

**📊 PRIORITY SCORING (1-10):**
- 10: Critical KPIs, main business drivers, executive-level metrics
- 8-9: Important trends, key comparisons, performance indicators  
- 6-7: Supporting analysis, departmental metrics, drill-down views
- 4-5: Detailed breakdowns, exploratory analysis
- 1-3: Nice-to-have views, experimental visualizations

**🎯 CHART SELECTION LOGIC:**
1. **Start with KPIs**: Identify 2-3 most important metrics as cards/gauges
2. **Show trends**: Use line/area charts for time-based data
3. **Enable comparisons**: Use bar/column for categorical analysis
4. **Reveal relationships**: Use scatter plots for correlations
5. **Display composition**: Use pie/treemap for part-to-whole
6. **Track processes**: Use funnel for sequential data

**📈 BUSINESS STORYTELLING:**
- Each chart must answer a specific business question
- Prioritize actionable insights over descriptive statistics
- Consider the decision-making hierarchy (executive → manager → analyst)
- Recommend charts that complement each other in telling a complete story

**🔍 DATA-DRIVEN DECISIONS:**
- Analyze actual data patterns, not just column types
- Look for outliers, trends, seasonality, correlations
- Consider the business domain based on column names and descriptions
- Recommend filters or drill-downs for deeper analysis

Return ONLY valid JSON without markdown formatting or code blocks.
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
        executiveSummary: parsed.executiveSummary || 'Business summary not provided',
        chartSuggestions: parsed.chartSuggestions.map((suggestion: any) => ({
          chartType: suggestion.chartType || 'bar',
          title: suggestion.title || 'Chart',
          description: suggestion.description || '',
          xAxis: suggestion.xAxis || '',
          yAxis: suggestion.yAxis || '',
          reasoning: suggestion.reasoning || '',
          priority: suggestion.priority || 5,
          visualizationGoal: suggestion.visualizationGoal || 'analysis'
        })),
        layoutRecommendations: parsed.layoutRecommendations || 'Standard grid layout'
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw content:', content);
      
      // Fallback response
      return {
        dataInsights: 'Unable to analyze data automatically. Using default analysis.',
        executiveSummary: 'Manual review required',
        chartSuggestions: [
          {
            chartType: 'bar',
            title: 'Data Overview',
            description: 'Basic visualization of your data',
            xAxis: '',
            yAxis: '',
            reasoning: 'Default visualization',
            priority: 5,
            visualizationGoal: 'overview'
          }
        ],
        layoutRecommendations: 'Standard grid layout'
      };
    }
  }
}

export const createGeminiService = (apiKey: string) => new GeminiService(apiKey);
