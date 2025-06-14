
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
You are an expert data visualization consultant for Lovable, an AI-powered dashboard creation platform. Analyze this dataset and provide intelligent chart recommendations.

=== ABOUT LOVABLE CHARTS ===
Lovable is a modern dashboard platform that creates beautiful, interactive charts. Users can:
- Drag and resize charts on a canvas
- Customize colors, titles, and styling
- Export dashboards as images or PDFs  
- Switch between different chart types instantly
- Edit data mappings and filters

=== AVAILABLE CHART TYPES ===
**Basic Charts:**
- bar: Vertical bars, great for category comparisons
- column: Horizontal bars, good for long category names
- line: Connected points, perfect for trends over time
- area: Filled line chart, shows volume and trends
- pie: Circular segments, ideal for part-to-whole relationships
- donut: Pie chart with center hole, modern alternative to pie

**Advanced Charts:**
- scatter: X/Y plots, excellent for correlations and outliers
- bubble: Scatter with size dimension, shows 3 variables
- combo: Mixed line + bar, compares different metrics
- stacked-bar: Segmented bars, shows composition over categories
- stacked-column: Horizontal stacked bars
- stacked-area: Layered areas, shows cumulative trends

**Business Intelligence:**
- card: Single metric display with formatting
- gauge: Speedometer style, shows progress to goal
- funnel: Conversion steps, perfect for sales/marketing funnels
- treemap: Hierarchical rectangles, shows proportional data
- waterfall: Shows positive/negative changes step by step

**Specialized:**
- radar: Multi-dimensional comparison
- heatmap: Color-coded matrix for patterns
- histogram: Distribution of continuous data
- boxplot: Statistical summary with quartiles
- table: Raw data display with sorting/filtering

=== USER CAPABILITIES ===
After generation, users can:
1. **Chart Type**: Switch any chart to a different type instantly
2. **Data Mapping**: Change which columns map to X/Y axes
3. **Styling**: Modify colors, fonts, backgrounds
4. **Titles**: Edit chart and axis titles
5. **Filters**: Add data filters and date ranges
6. **Layout**: Drag, resize, and reposition charts
7. **Export**: Save as PNG, PDF, or share online

=== DATASET TO ANALYZE ===
Columns: ${columns.map(col => `${col.name} (${col.type})`).join(', ')}

Sample Data (first 5 rows):
${JSON.stringify(sampleData, null, 2)}

=== YOUR TASK ===
Provide analysis in this EXACT JSON format:
{
  "dataInsights": "Brief description of what this data represents, key patterns, and business context",
  "chartSuggestions": [
    {
      "chartType": "exact_chart_type_from_list_above",
      "title": "Descriptive and engaging chart title",
      "description": "Why this specific chart type tells the data story best",
      "xAxis": "exact_column_name_for_x_axis",
      "yAxis": "exact_column_name_for_y_axis", 
      "reasoning": "Detailed explanation of visualization choice and business value",
      "priority": 1-10
    }
  ],
  "layoutRecommendations": "Suggestions for dashboard organization, which charts to place prominently, and how to tell a cohesive data story"
}

=== ANALYSIS GUIDELINES ===
1. **Context First**: Understand what business/domain this data represents
2. **Diverse Charts**: Suggest 4-8 different chart types that each tell a unique story
3. **Prioritize Value**: Rank charts by business impact and insight value
4. **Consider Users**: Think about what decisions this dashboard should enable
5. **Be Specific**: Use exact column names and chart types from our supported list
6. **Tell Stories**: Each chart should reveal a specific insight or pattern

**Chart Selection Strategy:**
- Start with most important business metrics (cards/gauges for KPIs)
- Add trend analysis (line/area charts for time series)
- Include comparisons (bar/column for categories)
- Show relationships (scatter/bubble for correlations)
- Reveal composition (pie/treemap for part-to-whole)
- Highlight processes (funnel/waterfall for flows)

**Column Mapping Rules:**
- Time/date columns → X-axis for temporal charts
- Categories → X-axis for comparison charts  
- Numeric measures → Y-axis values
- For cards/gauges → use single most important metric
- For scatter → use two related numeric columns

Return only valid JSON without any markdown formatting or code blocks.
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
