
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
    console.log('⚠️ No API key provided, using enhanced fallback suggestions');
    return generateEnhancedFallbackSuggestions(data);
  }

  try {
    const suggestions = await callGeminiAPI(data, geminiApiKey);
    console.log('✅ AI suggestions generated:', suggestions.length);
    return suggestions;
  } catch (error) {
    console.error('❌ AI generation failed, using enhanced fallback:', error);
    return generateEnhancedFallbackSuggestions(data);
  }
}

function generateEnhancedFallbackSuggestions(data: ProcessedData): AIChartSuggestion[] {
  console.log('🎯 Generating enhanced fallback suggestions with diverse chart types');
  
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const categoricalColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');
  
  const suggestions: AIChartSuggestion[] = [];
  
  // 1. Table view for comprehensive data overview
  suggestions.push({
    type: 'table',
    title: 'Data Overview Table',
    description: 'Complete tabular view of your data',
    columns: data.columns.slice(0, 6).map(col => col.name),
    priority: 10
  });
  
  // 2. Multi-KPI dashboard for key metrics
  if (numericColumns.length >= 3) {
    suggestions.push({
      type: 'multi-row-card',
      title: 'Key Performance Indicators',
      description: 'Dashboard showing multiple key metrics',
      columns: numericColumns.slice(0, 4).map(col => col.name),
      priority: 9
    });
  }
  
  // 3. Stacked bar chart for multi-category analysis
  if (categoricalColumns.length >= 1 && numericColumns.length >= 2) {
    suggestions.push({
      type: 'stacked-bar',
      title: 'Stacked Analysis',
      description: 'Compare multiple metrics across categories',
      columns: [categoricalColumns[0].name, ...numericColumns.slice(0, 3).map(col => col.name)],
      priority: 8
    });
  }
  
  // 4. Funnel chart for process analysis
  if (categoricalColumns.length >= 1 && numericColumns.length >= 1) {
    suggestions.push({
      type: 'funnel',
      title: 'Process Flow Analysis',
      description: 'Visualize conversion or process steps',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 7
    });
  }
  
  // 5. Time series analysis if date columns exist
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'line',
      title: 'Trend Analysis',
      description: 'Track changes over time',
      columns: [dateColumns[0].name, numericColumns[0].name],
      priority: 8
    });
  }
  
  // 6. Distribution pie chart
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'pie',
      title: 'Distribution Breakdown',
      description: 'Part-to-whole relationship visualization',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 6
    });
  }
  
  // 7. Comparison bar chart
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'bar',
      title: 'Category Comparison',
      description: 'Compare values across different categories',
      columns: [categoricalColumns[0].name, numericColumns[0].name],
      priority: 7
    });
  }
  
  // 8. Correlation scatter plot
  if (numericColumns.length >= 2) {
    suggestions.push({
      type: 'scatter',
      title: 'Correlation Analysis',
      description: 'Explore relationships between variables',
      columns: [numericColumns[0].name, numericColumns[1].name],
      priority: 5
    });
  }
  
  console.log('📊 Generated diverse suggestions:', suggestions.map(s => ({
    type: s.type,
    title: s.title,
    priority: s.priority,
    columns: s.columns
  })));
  
  return suggestions;
}

async function callGeminiAPI(data: ProcessedData, apiKey: string): Promise<AIChartSuggestion[]> {
  console.log('🤖 Calling Gemini API for intelligent suggestions...');
  
  const dataDescription = {
    rowCount: data.rows.length,
    columns: data.columns.map(col => ({
      name: col.name,
      type: col.type,
      sampleValues: data.rows.slice(0, 3).map(row => row[col.name])
    })),
    sampleRows: data.rows.slice(0, 3)
  };

  const prompt = `
    Analyze this dataset and suggest 6-8 diverse chart types for creating a comprehensive business dashboard.
    
    Dataset: ${JSON.stringify(dataDescription, null, 2)}
    
    IMPORTANT: Include these specific chart types in your suggestions:
    - At least 1 table chart for data overview
    - At least 1 multi-row-card for KPI dashboard
    - At least 1 stacked-bar or stacked-column chart
    - At least 1 funnel chart
    - Other relevant charts (pie, line, bar, scatter, etc.)
    
    Return ONLY a JSON array with this exact structure:
    [
      {
        "type": "table|multi-row-card|stacked-bar|funnel|pie|bar|line|scatter|etc",
        "title": "Descriptive Chart Title",
        "description": "Brief description of insights",
        "columns": ["column1", "column2"],
        "priority": 1-10
      }
    ]
    
    Make sure each chart type provides unique business insights and uses appropriate columns from the dataset.
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
    
    // Validate and map suggestions
    const validSuggestions = suggestions
      .filter((s: any) => s.type && s.title && s.columns && Array.isArray(s.columns))
      .map((s: any) => ({
        type: CHART_TYPE_MAP[s.type] || 'bar',
        title: s.title,
        description: s.description || '',
        columns: s.columns,
        priority: s.priority || 5
      }));

    console.log('✅ Parsed AI suggestions:', validSuggestions);
    return validSuggestions;

  } catch (error) {
    console.error('❌ Gemini API call failed:', error);
    throw error;
  }
}
