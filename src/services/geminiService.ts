
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
    const sampleData = request.data.slice(0, 10); // More focused sample
    
    const prompt = this.buildEnhancedPromptWithExamples(request.columns, sampleData, request.availableChartTypes, request.datasetSize);
    
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
            temperature: 0.1, // Lower temperature for more consistent output
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

      return this.parseAndValidateGeminiResponse(content, request.columns);
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  private buildEnhancedPromptWithExamples(columns: any[], sampleData: any[], availableChartTypes: string[], datasetSize: number): string {
    return `
You are a business intelligence expert. Create exactly 8 diverse chart recommendations from this data.

=== SUPPORTED CHART TYPES ===
${availableChartTypes.join(', ')}

=== EXAMPLE INPUT & OUTPUT ===

Example Columns:
- Date (date): Transaction date
- Revenue (number): Sales revenue in USD
- Region (text): Sales region
- Customer_Count (number): Number of customers

Example Output (EXACT FORMAT REQUIRED):
{
  "dataInsights": "Sales data shows seasonal patterns with Q4 peaks and regional variations",
  "executiveSummary": "Revenue trends indicate strong Q4 performance with North region leading",
  "kpis": [
    {"metric": "Total Revenue", "value": "$2.4M"},
    {"metric": "Average Transaction", "value": "$156"}
  ],
  "chartSuggestions": [
    {
      "chartType": "card",
      "title": "Total Revenue",
      "description": "Key revenue metric for executive dashboard",
      "xAxis": "Revenue",
      "yAxis": "",
      "reasoning": "Essential KPI for quick performance overview",
      "priority": 10,
      "visualizationGoal": "kpi_tracking",
      "businessInsight": "Critical financial metric for decision making"
    },
    {
      "chartType": "line",
      "title": "Revenue Trends Over Time",
      "description": "Time series showing revenue patterns",
      "xAxis": "Date",
      "yAxis": "Revenue",
      "reasoning": "Shows temporal patterns and growth trends",
      "priority": 9,
      "visualizationGoal": "trend_analysis",
      "businessInsight": "Identifies seasonal patterns and growth trajectory"
    },
    {
      "chartType": "bar",
      "title": "Revenue by Region",
      "description": "Regional performance comparison",
      "xAxis": "Region",
      "yAxis": "Revenue",
      "reasoning": "Compares regional performance for resource allocation",
      "priority": 8,
      "visualizationGoal": "comparative_analysis",
      "businessInsight": "Identifies top-performing regions and opportunities"
    },
    {
      "chartType": "scatter",
      "title": "Revenue vs Customer Count",
      "description": "Correlation between customers and revenue",
      "xAxis": "Customer_Count",
      "yAxis": "Revenue",
      "reasoning": "Shows relationship between customer base and revenue",
      "priority": 7,
      "visualizationGoal": "correlation_analysis",
      "businessInsight": "Validates customer acquisition impact on revenue"
    },
    {
      "chartType": "pie",
      "title": "Revenue Distribution by Region",
      "description": "Market share visualization",
      "xAxis": "Region",
      "yAxis": "Revenue",
      "reasoning": "Shows market composition and regional dominance",
      "priority": 6,
      "visualizationGoal": "composition_analysis",
      "businessInsight": "Reveals market share and concentration risks"
    },
    {
      "chartType": "gauge",
      "title": "Customer Growth Rate",
      "description": "Performance gauge for customer metrics",
      "xAxis": "Customer_Count",
      "yAxis": "",
      "reasoning": "Tracks progress toward customer acquisition goals",
      "priority": 6,
      "visualizationGoal": "goal_tracking",
      "businessInsight": "Monitors customer growth performance"
    },
    {
      "chartType": "area",
      "title": "Cumulative Revenue Growth",
      "description": "Cumulative revenue visualization",
      "xAxis": "Date",
      "yAxis": "Revenue",
      "reasoning": "Shows cumulative business growth over time",
      "priority": 5,
      "visualizationGoal": "growth_tracking",
      "businessInsight": "Visualizes total business growth trajectory"
    },
    {
      "chartType": "table",
      "title": "Detailed Performance Metrics",
      "description": "Comprehensive data breakdown",
      "xAxis": "Region",
      "yAxis": "Revenue",
      "reasoning": "Provides detailed data for deep analysis",
      "priority": 4,
      "visualizationGoal": "detailed_analysis",
      "businessInsight": "Enables drill-down analysis and data verification"
    }
  ],
  "layoutRecommendations": "Place KPI cards at top, trends in center, detailed analysis at bottom"
}

=== YOUR DATA ===
Total Records: ${datasetSize}
Columns:
${columns.map(col => `- ${col.name} (${col.type}): ${col.description || 'Business metric for analysis'}`).join('\n')}

Sample Data:
${JSON.stringify(sampleData, null, 2)}

=== REQUIREMENTS ===
1. Return ONLY valid JSON (no markdown, no extra text)
2. Create exactly 8 diverse charts using different chart types
3. Use only chart types from the supported list above
4. Ensure xAxis and yAxis use exact column names from the data
5. Prioritize charts 1-10 (10 = most important)
6. Make titles business-focused and actionable

RETURN ONLY THE JSON OBJECT:`;
  }

  private parseAndValidateGeminiResponse(content: string, columns: any[]): GeminiAnalysisResponse {
    try {
      // Strict JSON extraction using regex
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const cleanJson = jsonMatch[0]
        .replace(/```json\s*|\s*```/g, '')
        .replace(/^\s*[\w\s]*\s*/, '')
        .trim();
      
      console.log('Extracted JSON:', cleanJson);
      
      const parsed = JSON.parse(cleanJson);
      
      // Schema validation
      this.validateResponseStructure(parsed);
      
      // Validate chart suggestions
      const validChartSuggestions = this.validateChartSuggestions(parsed.chartSuggestions, columns);
      
      return {
        dataInsights: parsed.dataInsights || 'Data analysis completed',
        executiveSummary: parsed.executiveSummary || 'Executive summary generated',
        kpis: Array.isArray(parsed.kpis) ? parsed.kpis : [],
        chartSuggestions: validChartSuggestions,
        layoutRecommendations: parsed.layoutRecommendations || 'Standard dashboard layout'
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw response:', content);
      
      // Enhanced fallback with error context
      throw new Error(`Failed to parse AI response: ${error.message}. Raw response logged for debugging.`);
    }
  }

  private validateResponseStructure(parsed: any): void {
    const requiredFields = ['dataInsights', 'chartSuggestions'];
    
    for (const field of requiredFields) {
      if (!parsed[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    if (!Array.isArray(parsed.chartSuggestions)) {
      throw new Error('chartSuggestions must be an array');
    }
    
    if (parsed.chartSuggestions.length === 0) {
      throw new Error('No chart suggestions provided');
    }
  }

  private validateChartSuggestions(suggestions: any[], columns: any[]): GeminiChartSuggestion[] {
    const supportedTypes = ['bar', 'column', 'line', 'area', 'pie', 'donut', 'scatter', 'bubble', 'card', 'gauge', 'treemap', 'funnel', 'radar', 'combo', 'table'];
    const columnNames = columns.map(col => col.name);
    
    const validSuggestions = suggestions
      .filter(suggestion => {
        // Validate chart type
        if (!supportedTypes.includes(suggestion.chartType?.toLowerCase())) {
          console.warn(`Unsupported chart type: ${suggestion.chartType}`);
          return false;
        }
        
        // Validate required fields
        if (!suggestion.title || !suggestion.chartType) {
          console.warn('Missing required fields in suggestion:', suggestion);
          return false;
        }
        
        // Validate column references
        if (suggestion.xAxis && !columnNames.includes(suggestion.xAxis)) {
          console.warn(`Invalid xAxis column: ${suggestion.xAxis}`);
          // Don't reject, just clear the invalid column
          suggestion.xAxis = '';
        }
        
        if (suggestion.yAxis && !columnNames.includes(suggestion.yAxis)) {
          console.warn(`Invalid yAxis column: ${suggestion.yAxis}`);
          suggestion.yAxis = '';
        }
        
        return true;
      })
      .map(suggestion => ({
        chartType: suggestion.chartType.toLowerCase(),
        title: suggestion.title,
        description: suggestion.description || '',
        xAxis: suggestion.xAxis || '',
        yAxis: suggestion.yAxis || '',
        reasoning: suggestion.reasoning || '',
        priority: typeof suggestion.priority === 'number' ? suggestion.priority : 5,
        visualizationGoal: suggestion.visualizationGoal || 'analysis',
        businessInsight: suggestion.businessInsight || 'Business insight'
      }));
    
    console.log(`Validated ${validSuggestions.length} out of ${suggestions.length} chart suggestions`);
    
    if (validSuggestions.length === 0) {
      throw new Error('No valid chart suggestions after validation');
    }
    
    return validSuggestions;
  }
}

export const createGeminiService = (apiKey: string) => new GeminiService(apiKey);
