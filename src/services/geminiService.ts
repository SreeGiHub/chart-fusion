
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
  businessInsight: string;
}

interface GeminiAnalysisResponse {
  dataInsights: string;
  chartSuggestions: GeminiChartSuggestion[];
  layoutRecommendations: string;
  executiveSummary: string;
  kpis: Array<{
    metric: string;
    value: string;
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeDataForCharts(request: GeminiAnalysisRequest): Promise<GeminiAnalysisResponse> {
    const sampleData = request.data.slice(0, 15); // Send more sample data for better analysis
    
    const prompt = this.buildAdvancedBusinessAnalysisPrompt(request.columns, sampleData, request.availableChartTypes, request.datasetSize);
    
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
            topP: 0.9,
            maxOutputTokens: 4000,
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

      return this.parseAdvancedGeminiResponse(content);
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  private buildAdvancedBusinessAnalysisPrompt(columns: any[], sampleData: any[], availableChartTypes: string[], datasetSize: number): string {
    return `
You are an expert business intelligence consultant and data visualization specialist. Your task is to analyze business data and create a sophisticated dashboard that tells a compelling data story with actionable insights.

=== BUSINESS DATA CONTEXT ===
Total Records: ${datasetSize}
Data Structure & Business Context:
${columns.map(col => `• ${col.name} (${col.type}): ${col.description || 'Business metric - analyze for patterns and insights'}`).join('\n')}

Representative Sample Data (showing actual business patterns):
${JSON.stringify(sampleData, null, 2)}

=== AVAILABLE VISUALIZATION TYPES ===
Chart types available in our system:
${availableChartTypes.map(type => `• ${type}`).join('\n')}

Chart Type Selection Guidelines:
- **bar/column**: Comparisons, rankings, performance by category
- **line**: Time trends, performance over time, growth patterns  
- **area**: Cumulative trends, volume emphasis, stacked performance
- **pie/donut**: Market share, composition, percentage breakdowns (max 8 segments)
- **scatter**: Correlations, relationship analysis, performance matrices
- **bubble**: Multi-dimensional analysis (3+ variables simultaneously)
- **card**: KPIs, key metrics, executive summary numbers
- **gauge**: Goal tracking, performance indicators, progress metrics
- **treemap**: Hierarchical data, nested comparisons with size relationships
- **funnel**: Process flows, conversion analysis, sequential steps
- **radar**: Multi-criteria evaluation, skill assessments, balanced scorecards
- **table**: Detailed breakdowns, when precision and specifics are needed

=== ANALYSIS REQUIREMENTS ===

You must analyze this data like a senior business analyst and provide strategic dashboard recommendations in this EXACT JSON format:

{
  "dataInsights": "Deep business analysis: What this data represents, key patterns discovered, trends, correlations, anomalies, and strategic implications for the business",
  "executiveSummary": "Executive-level summary of the most critical business insights and recommended strategic actions based on the data analysis",
  "kpis": [
    {
      "metric": "descriptive_name_of_key_metric",
      "value": "calculated_value_with_units"
    }
  ],
  "chartSuggestions": [
    {
      "chartType": "exact_chart_type_from_available_list",
      "title": "Strategic business-focused title that highlights the key insight",
      "description": "What critical business question this chart answers and what strategic decisions it enables",
      "xAxis": "exact_column_name_for_x_axis",
      "yAxis": "exact_column_name_for_y_axis_or_metric",
      "reasoning": "Detailed business rationale for why this specific chart type and data combination provides maximum strategic value",
      "priority": 1-10,
      "visualizationGoal": "specific_business_objective (e.g., 'performance_optimization', 'trend_identification', 'competitive_analysis', 'efficiency_measurement', 'risk_assessment')",
      "businessInsight": "The key business insight or strategic finding this chart reveals that drives decision-making"
    }
  ],
  "layoutRecommendations": "Strategic dashboard organization: executive summary placement, chart hierarchy for maximum business impact, suggested grid layout that guides decision-makers through the data story"
}

=== STRATEGIC DASHBOARD DESIGN PRINCIPLES ===

**📊 PRIORITY FRAMEWORK (1-10):**
- 10: Mission-critical KPIs, executive decision drivers, business-critical metrics
- 8-9: Strategic performance indicators, key trend analysis, competitive insights
- 6-7: Operational metrics, departmental performance, efficiency measures  
- 4-5: Supporting analysis, detailed breakdowns, drill-down capabilities
- 1-3: Exploratory views, nice-to-have insights, supplementary data

**🎯 BUSINESS-FIRST CHART STRATEGY:**
1. **Lead with Impact**: Start with 2-3 most business-critical metrics as cards/gauges
2. **Show Performance**: Use trend charts for performance over time
3. **Enable Comparisons**: Use bar/column charts for competitive analysis
4. **Reveal Relationships**: Use scatter/bubble for correlation insights
5. **Display Market Position**: Use pie/treemap for market share/composition
6. **Track Processes**: Use funnel for conversion/process analysis
7. **Support Decisions**: Ensure every chart answers "So what?" and "What action should we take?"

**📈 BUSINESS STORYTELLING REQUIREMENTS:**
- Each chart must reveal a specific business insight that drives action
- Prioritize insights that impact revenue, efficiency, customer satisfaction, or competitive position
- Consider the business context: Is this sales data? Operations? Marketing? Financial?
- Think about the decision-maker hierarchy: What does a CEO need vs. a manager vs. an analyst?
- Identify trends, outliers, correlations, and strategic opportunities
- Recommend charts that build a coherent narrative together

**🔍 DATA-DRIVEN BUSINESS INTELLIGENCE:**
- Analyze actual data patterns, not just column names
- Look for business drivers: What drives performance? What predicts success?
- Identify optimization opportunities: Where can the business improve?
- Spot risks and opportunities: What should leadership pay attention to?
- Consider seasonality, trends, and business cycles in your analysis
- Make recommendations for deeper analysis or data collection

**CRITICAL**: Every chart recommendation must be justified by actual business value and strategic importance. Focus on insights that drive decisions, optimize performance, or reveal competitive advantages.

Return ONLY valid JSON without markdown formatting or code blocks.
`;
  }

  private parseAdvancedGeminiResponse(content: string): GeminiAnalysisResponse {
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
        executiveSummary: parsed.executiveSummary || 'Executive summary not provided',
        kpis: parsed.kpis || [],
        chartSuggestions: parsed.chartSuggestions.map((suggestion: any) => ({
          chartType: suggestion.chartType || 'bar',
          title: suggestion.title || 'Chart',
          description: suggestion.description || '',
          xAxis: suggestion.xAxis || '',
          yAxis: suggestion.yAxis || '',
          reasoning: suggestion.reasoning || '',
          priority: suggestion.priority || 5,
          visualizationGoal: suggestion.visualizationGoal || 'analysis',
          businessInsight: suggestion.businessInsight || 'Business insight not provided'
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
        kpis: [],
        chartSuggestions: [
          {
            chartType: 'bar',
            title: 'Data Overview',
            description: 'Basic visualization of your data',
            xAxis: '',
            yAxis: '',
            reasoning: 'Default visualization',
            priority: 5,
            visualizationGoal: 'overview',
            businessInsight: 'Basic data overview'
          }
        ],
        layoutRecommendations: 'Standard grid layout'
      };
    }
  }
}

export const createGeminiService = (apiKey: string) => new GeminiService(apiKey);
