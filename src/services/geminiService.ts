
interface GeminiAnalysisRequest {
  data: any[];
  columns: Array<{
    name: string;
    type: 'number' | 'date' | 'text' | 'boolean';
    description?: string;
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

=== COMPREHENSIVE CHART TYPES & USE CASES ===

**📊 COMPARISON CHARTS:**
- bar: Vertical bars - Compare categories, sales by product, scores by team
- column: Horizontal bars - Long category names, survey responses, rankings
- stacked-bar: Segmented vertical bars - Revenue breakdown by category over time
- stacked-column: Segmented horizontal bars - Survey responses by demographics

**📈 TREND & TIME SERIES:**
- line: Connected points - Stock prices, website traffic, temperature over time
- area: Filled line chart - Revenue growth, user acquisition, cumulative metrics
- stacked-area: Layered areas - Market share evolution, budget allocation over time
- combo: Line + Bar mix - Revenue (bars) vs profit margin (line)

**🥧 COMPOSITION & PARTS:**
- pie: Circular segments - Market share, budget allocation, survey results
- donut: Pie with center hole - Same as pie but more modern, can show total in center
- treemap: Hierarchical rectangles - File sizes, revenue by product hierarchy
- funnel: Conversion steps - Sales pipeline, website conversion, process flow

**📍 CORRELATION & DISTRIBUTION:**
- scatter: X/Y plots - Height vs weight, price vs quality, performance correlation
- bubble: Scatter + size - Sales (x) vs profit (y) with market size (bubble)
- heatmap: Color matrix - Website clicks, correlation matrix, geographic data
- histogram: Distribution bars - Age distribution, salary ranges, test scores
- boxplot: Statistical summary - Performance quartiles, salary ranges by role

**🎯 BUSINESS INTELLIGENCE:**
- card: Single metric KPI - Total revenue, conversion rate, active users
- gauge: Progress meter - Goal completion, satisfaction score, performance rating
- waterfall: Step changes - Budget vs actual, profit/loss breakdown
- radar: Multi-dimension - Employee skills, product features comparison

**📋 DATA DISPLAY:**
- table: Raw data grid - Customer lists, transaction details, inventory
- matrix: Cross-tabulation - Sales by region/product, survey crosstab

**🎨 VISUAL IMPACT:**
- Timeline charts show progression and milestones
- Geographic maps show location-based data
- Sankey diagrams show flow between categories

=== USER CAPABILITIES AFTER GENERATION ===
Users can modify charts in real-time:
1. **Chart Type Switching**: Instantly change any chart to different type
2. **Data Mapping**: Reassign columns to X/Y axes, categories, values
3. **Visual Styling**: Colors, fonts, backgrounds, themes
4. **Interactive Features**: Filters, drill-downs, tooltips
5. **Layout Control**: Drag, resize, reposition on canvas
6. **Export Options**: PNG, PDF, online sharing

=== DATASET TO ANALYZE ===
Columns with descriptions:
${columns.map(col => `${col.name} (${col.type})${col.description ? `: ${col.description}` : ''}`).join('\n')}

Sample Data (first 5 rows showing actual patterns):
${JSON.stringify(sampleData, null, 2)}

=== INTELLIGENT ANALYSIS REQUIREMENTS ===
Provide analysis in this EXACT JSON format:
{
  "dataInsights": "Detailed business context: What domain is this? What decisions can be made? Key patterns and relationships discovered.",
  "chartSuggestions": [
    {
      "chartType": "exact_chart_type_from_list_above",
      "title": "Business-focused title that tells a story",
      "description": "Why this chart type reveals specific insights and drives decisions",
      "xAxis": "exact_column_name_for_x_axis",
      "yAxis": "exact_column_name_for_y_axis", 
      "reasoning": "Detailed business rationale: What insight does this reveal? What actions can users take?",
      "priority": 1-10
    }
  ],
  "layoutRecommendations": "Strategic dashboard organization: Which charts should be prominent? How to create a narrative flow? What story should the dashboard tell?"
}

=== ADVANCED ANALYSIS GUIDELINES ===

**🎯 STRATEGIC CHART SELECTION:**
1. **Executive Summary**: Start with 2-3 KPI cards showing most critical metrics
2. **Trend Analysis**: Include time-series charts for performance tracking
3. **Comparative Analysis**: Bar/column charts for category comparisons
4. **Relationship Discovery**: Scatter plots for correlation insights
5. **Composition Breakdown**: Pie/treemap for part-to-whole understanding
6. **Process Flow**: Funnel/waterfall for step-by-step analysis

**📊 SMART COLUMN MAPPING:**
- **Temporal Data**: Date/time columns → X-axis for trend charts
- **Categories**: Text columns → X-axis for comparison charts, pie slices
- **Metrics**: Numeric columns → Y-axis values, card displays, gauge targets
- **Identifiers**: ID columns → Filters, not primary visualization axes
- **Hierarchical**: Parent-child relationships → Treemap, funnel stages

**🚀 BUSINESS VALUE PRIORITIZATION:**
- Priority 9-10: Critical KPIs, main trends, primary comparisons
- Priority 7-8: Supporting analysis, secondary metrics, correlations
- Priority 5-6: Detailed breakdowns, niche insights, exploratory views
- Priority 1-4: Nice-to-have views, experimental visualizations

**📈 INSIGHT-DRIVEN RECOMMENDATIONS:**
- Each chart must answer a specific business question
- Titles should indicate the insight, not just the data
- Consider seasonality, outliers, and business cycles
- Suggest alerts for anomalies or threshold breaches
- Recommend drill-down capabilities for deeper analysis

**🎨 DASHBOARD STORYTELLING:**
- Top row: Most important KPIs and trends
- Middle section: Comparative and correlation analysis  
- Bottom section: Detailed breakdowns and supporting data
- Left-to-right flow: Problem → Analysis → Solution
- Use consistent color schemes across related charts

Return only valid JSON without markdown formatting or code blocks.
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
