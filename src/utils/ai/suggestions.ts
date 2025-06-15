
import { ProcessedData } from "@/utils/dataProcessor";
import { AIChartSuggestion, CHART_TYPE_MAP } from "./types";
import { generateFallbackSuggestions } from "./fallbackSuggestions";

export async function generateAIChartSuggestions(
  data: ProcessedData,
  geminiApiKey: string
): Promise<AIChartSuggestion[]> {
  console.log('\n=== GENERATING AI CHART SUGGESTIONS ===');
  console.log('🔍 Analyzing data structure:', {
    rows: data.rows.length,
    columns: data.columns.length,
    columnTypes: data.columns.map(col => `${col.name} (${col.type})`),
    sampleData: data.rows.slice(0, 2)
  });

  if (!geminiApiKey) {
    console.log('⚠️ No API key provided, using intelligent fallback suggestions');
    return generateIntelligentFallbackSuggestions(data);
  }

  try {
    const suggestions = await callGeminiAPI(data, geminiApiKey);
    console.log('✅ AI suggestions generated:', suggestions.length);
    return suggestions;
  } catch (error) {
    console.error('❌ AI generation failed, using intelligent fallback:', error);
    return generateIntelligentFallbackSuggestions(data);
  }
}

function generateIntelligentFallbackSuggestions(data: ProcessedData): AIChartSuggestion[] {
  console.log('🎯 Generating intelligent fallback suggestions based on data analysis');
  
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const categoricalColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');
  
  console.log('📊 Column analysis:', {
    numeric: numericColumns.map(c => c.name),
    categorical: categoricalColumns.map(c => c.name),
    date: dateColumns.map(c => c.name)
  });
  
  const suggestions: AIChartSuggestion[] = [];
  
  // 1. Executive Summary KPI Cards - Always include key metrics
  if (numericColumns.length >= 3) {
    suggestions.push({
      type: 'multi-row-card',
      title: 'Executive Dashboard',
      description: 'Key business metrics at a glance',
      columns: numericColumns.slice(0, 4).map(col => col.name),
      priority: 10
    });
  }
  
  // 2. Primary Performance Analysis - Main story
  if (categoricalColumns.length >= 1 && numericColumns.length >= 1) {
    const primaryCategory = categoricalColumns[0].name;
    const primaryMetric = numericColumns[0].name;
    
    suggestions.push({
      type: 'bar',
      title: `${primaryMetric} Performance by ${primaryCategory}`,
      description: `Analysis of ${primaryMetric} across different ${primaryCategory.toLowerCase()}s`,
      columns: [primaryCategory, primaryMetric],
      priority: 9
    });
    
    // 3. Distribution Analysis - Understanding composition
    suggestions.push({
      type: 'pie',
      title: `${primaryCategory} Distribution`,
      description: `Market share and composition by ${primaryCategory.toLowerCase()}`,
      columns: [primaryCategory, primaryMetric],
      priority: 8
    });
  }
  
  // 4. Trend Analysis - Time-based insights
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'line',
      title: 'Performance Trends Over Time',
      description: 'Track changes and identify patterns over time',
      columns: [dateColumns[0].name, numericColumns[0].name],
      priority: 9
    });
  } else if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    // Use categorical data as pseudo-time series
    suggestions.push({
      type: 'line',
      title: 'Performance Progression',
      description: 'Track performance across categories',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 7
    });
  }
  
  // 5. Comparative Analysis - Multi-metric comparison
  if (categoricalColumns.length >= 1 && numericColumns.length >= 2) {
    suggestions.push({
      type: 'stacked-bar',
      title: 'Multi-Metric Comparison',
      description: 'Compare multiple performance indicators side by side',
      columns: [categoricalColumns[0].name, ...numericColumns.slice(0, 2).map(col => col.name)],
      priority: 8
    });
  }
  
  // 6. Correlation Insights - Relationship analysis
  if (numericColumns.length >= 2) {
    suggestions.push({
      type: 'scatter',
      title: `${numericColumns[0].name} vs ${numericColumns[1].name}`,
      description: 'Explore relationships and correlations between key metrics',
      columns: [numericColumns[0].name, numericColumns[1].name],
      priority: 7
    });
  }
  
  // 7. Process Flow Analysis - Business process visualization
  if (categoricalColumns.length >= 1 && numericColumns.length >= 1) {
    suggestions.push({
      type: 'funnel',
      title: 'Process Flow Analysis',
      description: 'Visualize conversion rates and process efficiency',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 6
    });
  }
  
  // 8. Detailed Data Table - Comprehensive view
  suggestions.push({
    type: 'table',
    title: 'Detailed Data Analysis',
    description: 'Complete data breakdown for detailed analysis',
    columns: data.columns.slice(0, 6).map(col => col.name),
    priority: 5
  });
  
  console.log('📊 Generated intelligent suggestions:', suggestions.map(s => ({
    type: s.type,
    title: s.title,
    priority: s.priority,
    columns: s.columns,
    insight: s.description
  })));
  
  return suggestions;
}

async function callGeminiAPI(data: ProcessedData, apiKey: string): Promise<AIChartSuggestion[]> {
  console.log('🤖 Calling Gemini API for data-driven insights...');
  
  const dataDescription = {
    rowCount: data.rows.length,
    columns: data.columns.map(col => ({
      name: col.name,
      type: col.type,
      sampleValues: data.rows.slice(0, 5).map(row => row[col.name]).filter(val => val !== null && val !== undefined),
      uniqueValues: col.type === 'text' ? [...new Set(data.rows.map(row => row[col.name]).filter(val => val !== null && val !== undefined))].slice(0, 10) : null,
      statistics: col.type === 'number' ? calculateColumnStatistics(data.rows, col.name) : null
    })),
    businessContext: detectBusinessContext(data.columns, data.rows),
    sampleRows: data.rows.slice(0, 5)
  };

  const prompt = `
    Analyze this business dataset and create 8 insightful chart recommendations that tell a compelling data story.
    
    Dataset Analysis: ${JSON.stringify(dataDescription, null, 2)}
    
    BUSINESS CONTEXT: ${dataDescription.businessContext}
    
    Create charts that provide:
    1. Executive-level KPIs and summary metrics
    2. Performance analysis and comparisons
    3. Trend identification and patterns
    4. Distribution and composition insights
    5. Correlation and relationship analysis
    6. Process flow and efficiency metrics
    7. Detailed data exploration
    8. Actionable business insights
    
    REQUIREMENTS:
    - Use EXACT column names from the dataset
    - Create meaningful, business-focused titles
    - Ensure each chart tells part of a cohesive story
    - Prioritize charts by business impact (1-10)
    - Include diverse chart types for comprehensive analysis
    
    Return ONLY a JSON array with this structure:
    [
      {
        "type": "multi-row-card|table|stacked-bar|funnel|pie|bar|line|scatter|gauge|area",
        "title": "Business-Focused Chart Title",
        "description": "Clear business insight this chart provides",
        "columns": ["exact_column_name1", "exact_column_name2"],
        "priority": 1-10,
        "reasoning": "Why this chart is important for business decisions",
        "businessInsight": "Key insight this visualization reveals"
      }
    ]
    
    Focus on creating a dashboard that tells the complete story of this data with actionable insights.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    console.log('🤖 Raw Gemini response:', text);

    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }

    const suggestions = JSON.parse(jsonMatch[0]);
    
    // Validate and map suggestions with strict column validation
    const validSuggestions = suggestions
      .filter((s: any) => {
        // Validate chart type
        if (!s.type || !CHART_TYPE_MAP[s.type]) {
          console.warn(`❌ Invalid chart type: ${s.type}`);
          return false;
        }
        
        // Validate required fields
        if (!s.title || !s.columns || !Array.isArray(s.columns)) {
          console.warn('❌ Missing required fields in suggestion:', s);
          return false;
        }
        
        // Strict column validation - ensure all columns exist in dataset
        const validColumns = s.columns.filter((colName: string) => 
          data.columns.some(col => col.name === colName)
        );
        
        if (validColumns.length === 0) {
          console.warn(`❌ No valid columns found for suggestion: ${s.title}`);
          return false;
        }
        
        // Update with only valid columns
        s.columns = validColumns;
        return true;
      })
      .map((s: any) => ({
        type: CHART_TYPE_MAP[s.type] || 'bar',
        title: s.title,
        description: s.description || '',
        columns: s.columns,
        priority: s.priority || 5,
        reasoning: s.reasoning || '',
        businessInsight: s.businessInsight || ''
      }));

    console.log('✅ Parsed and validated AI suggestions:', validSuggestions);
    return validSuggestions;

  } catch (error) {
    console.error('❌ Gemini API call failed:', error);
    throw error;
  }
}

function calculateColumnStatistics(rows: any[], columnName: string) {
  const numericValues = rows
    .map(row => {
      const val = row[columnName];
      return typeof val === 'number' ? val : parseFloat(String(val));
    })
    .filter(val => !isNaN(val) && isFinite(val));
    
  if (numericValues.length === 0) return null;
  
  const sum = numericValues.reduce((a, b) => a + b, 0);
  const avg = sum / numericValues.length;
  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  
  return {
    count: numericValues.length,
    sum: Math.round(sum * 100) / 100,
    average: Math.round(avg * 100) / 100,
    min,
    max,
    range: max - min
  };
}

function detectBusinessContext(columns: any[], rows: any[]): string {
  const columnNames = columns.map(col => col.name.toLowerCase());
  
  // Business domain detection based on column names
  if (columnNames.some(name => ['sales', 'revenue', 'profit', 'income'].some(term => name.includes(term)))) {
    return 'Sales & Financial Performance Data - Focus on revenue analysis, profitability, and sales performance metrics';
  }
  
  if (columnNames.some(name => ['customer', 'client', 'user', 'account'].some(term => name.includes(term)))) {
    return 'Customer Analytics Data - Focus on customer behavior, segmentation, and relationship metrics';
  }
  
  if (columnNames.some(name => ['employee', 'staff', 'hr', 'department', 'salary'].some(term => name.includes(term)))) {
    return 'Human Resources Data - Focus on workforce analytics, performance, and organizational metrics';
  }
  
  if (columnNames.some(name => ['product', 'inventory', 'stock', 'item'].some(term => name.includes(term)))) {
    return 'Product & Inventory Data - Focus on product performance, inventory management, and catalog analytics';
  }
  
  if (columnNames.some(name => ['marketing', 'campaign', 'lead', 'conversion'].some(term => name.includes(term)))) {
    return 'Marketing Analytics Data - Focus on campaign performance, lead generation, and conversion metrics';
  }
  
  return 'General Business Analytics Data - Focus on operational performance, efficiency, and key business indicators';
}
