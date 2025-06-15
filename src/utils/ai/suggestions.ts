import { ProcessedData } from "@/utils/dataProcessor";
import { GeminiService } from "@/services/geminiService";
import { AIChartSuggestion, CHART_TYPE_MAP } from "./types";
import { generateFallbackSuggestions } from "./fallbackSuggestions";
import { ChartType } from "@/types";

// Available chart types that our system supports (expanded list)
const AVAILABLE_CHART_TYPES = [
  'bar', 'column', 'line', 'area', 'pie', 'donut', 'scatter', 'bubble',
  'card', 'gauge', 'treemap', 'funnel', 'radar', 'combo', 'table'
];

export async function generateAIChartSuggestions(
  data: ProcessedData, 
  geminiApiKey?: string
): Promise<AIChartSuggestion[]> {
  console.log('\n🎯 === ENHANCED AI CHART GENERATION STARTED ===');
  console.log('📊 Dataset Analysis:', {
    totalRows: data.rows.length,
    totalColumns: data.columns.length,
    columnBreakdown: {
      numeric: data.columns.filter(col => col.type === 'number').length,
      text: data.columns.filter(col => col.type === 'text').length,
      date: data.columns.filter(col => col.type === 'date').length,
    },
    sampleDataQuality: data.rows.slice(0, 3).map(row => 
      Object.keys(row).reduce((acc, key) => {
        acc[key] = row[key] !== null && row[key] !== undefined && row[key] !== '';
        return acc;
      }, {})
    )
  });
  
  if (!geminiApiKey) {
    console.log('🔄 No Gemini API key - using enhanced rule-based intelligence');
    return generateEnhancedBusinessIntelligence(data);
  }

  try {
    const geminiService = new GeminiService(geminiApiKey);
    
    // Prepare enhanced business analysis with data insights
    const dataInsights = analyzeDataPatterns(data);
    console.log('📈 Data Patterns Identified:', dataInsights);
    
    const analysisRequest = {
      data: data.rows.slice(0, 15), // Optimized sample size
      columns: data.columns.map(col => ({
        name: col.name,
        type: col.type,
        description: generateSmartColumnDescription(col, data)
      })),
      availableChartTypes: AVAILABLE_CHART_TYPES,
      datasetSize: data.rows.length,
      dataInsights // Add our analysis
    };

    console.log('🤖 Sending enhanced request to AI:', {
      sampleSize: analysisRequest.data.length,
      columnsWithDescriptions: analysisRequest.columns.length,
      insights: dataInsights
    });
    
    const aiAnalysis = await geminiService.analyzeDataForCharts(analysisRequest);
    console.log('✅ AI Analysis received:', {
      suggestionsCount: aiAnalysis.chartSuggestions.length,
      kpisDetected: aiAnalysis.kpis?.length || 0,
      hasExecutiveSummary: !!aiAnalysis.executiveSummary
    });

    // Process and enhance AI suggestions
    const enhancedSuggestions: AIChartSuggestion[] = aiAnalysis.chartSuggestions
      .filter(suggestion => isValidChartType(suggestion.chartType))
      .map(suggestion => enhanceAISuggestion(suggestion, data, dataInsights))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);

    console.log('🎨 Enhanced AI suggestions ready:', enhancedSuggestions.map(s => ({
      type: s.type,
      title: s.title,
      columns: s.columns,
      priority: s.priority,
      hasValidColumns: s.columns.every(col => data.columns.some(dataCol => dataCol.name === col))
    })));

    return enhancedSuggestions;

  } catch (error) {
    console.error('❌ AI analysis failed, using enhanced fallback:', error);
    return generateEnhancedBusinessIntelligence(data);
  }
}

function analyzeDataPatterns(data: ProcessedData) {
  const patterns = {
    hasTimeData: data.columns.some(col => col.type === 'date'),
    hasGeographicData: data.columns.some(col => 
      col.name.toLowerCase().includes('region') || 
      col.name.toLowerCase().includes('location') ||
      col.name.toLowerCase().includes('country') ||
      col.name.toLowerCase().includes('state')
    ),
    hasProductData: data.columns.some(col => 
      col.name.toLowerCase().includes('product') ||
      col.name.toLowerCase().includes('category') ||
      col.name.toLowerCase().includes('item')
    ),
    hasFinancialData: data.columns.some(col => 
      col.name.toLowerCase().includes('revenue') ||
      col.name.toLowerCase().includes('sales') ||
      col.name.toLowerCase().includes('price') ||
      col.name.toLowerCase().includes('cost')
    ),
    hasRatingData: data.columns.some(col => 
      col.name.toLowerCase().includes('rating') ||
      col.name.toLowerCase().includes('score') ||
      col.name.toLowerCase().includes('satisfaction')
    ),
    numericColumns: data.columns.filter(col => col.type === 'number'),
    categoricalColumns: data.columns.filter(col => col.type === 'text'),
    dateColumns: data.columns.filter(col => col.type === 'date')
  };
  
  return patterns;
}

function generateSmartColumnDescription(col: any, data: ProcessedData): string {
  const colName = col.name.toLowerCase();
  const sampleValues = data.rows.slice(0, 10).map(row => row[col.name]).filter(val => val !== null && val !== undefined);
  
  // Smart descriptions based on column patterns
  if (colName.includes('revenue') || colName.includes('sales')) {
    return `Financial metric: ${col.name} - Key revenue/sales data for business performance analysis`;
  } else if (colName.includes('date') || col.type === 'date') {
    return `Temporal dimension: ${col.name} - Time-based data for trend analysis and forecasting`;
  } else if (colName.includes('region') || colName.includes('location')) {
    return `Geographic dimension: ${col.name} - Location-based data for regional performance analysis`;
  } else if (colName.includes('product') || colName.includes('category')) {
    return `Product dimension: ${col.name} - Product categorization for portfolio analysis`;
  } else if (colName.includes('rating') || colName.includes('score')) {
    return `Quality metric: ${col.name} - Performance rating for quality assessment`;
  } else if (col.type === 'number') {
    const avgValue = sampleValues.length > 0 ? sampleValues.reduce((a, b) => a + parseFloat(b), 0) / sampleValues.length : 0;
    return `Quantitative metric: ${col.name} - Numerical data (avg: ${avgValue.toFixed(1)}) for analytical insights`;
  } else {
    const uniqueValues = [...new Set(sampleValues)].length;
    return `Categorical dimension: ${col.name} - Text-based grouping variable (${uniqueValues} categories) for segmentation analysis`;
  }
}

function enhanceAISuggestion(suggestion: any, data: ProcessedData, insights: any): AIChartSuggestion {
  const validColumns = validateAndFixColumns(suggestion, data);
  
  return {
    type: mapChartType(suggestion.chartType),
    title: suggestion.title,
    description: suggestion.description || `Analysis of ${validColumns.join(' vs ')}`,
    columns: validColumns,
    priority: suggestion.priority || 5,
    reasoning: suggestion.reasoning,
    visualizationGoal: suggestion.visualizationGoal,
    businessInsight: suggestion.businessInsight
  };
}

function validateAndFixColumns(suggestion: any, data: ProcessedData): string[] {
  const validColumns: string[] = [];
  const availableColumns = data.columns.map(col => col.name);
  
  // Check xAxis column
  if (suggestion.xAxis && availableColumns.includes(suggestion.xAxis)) {
    validColumns.push(suggestion.xAxis);
  }
  
  // Check yAxis column
  if (suggestion.yAxis && availableColumns.includes(suggestion.yAxis)) {
    validColumns.push(suggestion.yAxis);
  }
  
  // If we don't have valid columns, use smart fallback
  if (validColumns.length === 0) {
    const chartType = suggestion.chartType.toLowerCase();
    
    if (['card', 'gauge'].includes(chartType)) {
      const numericCol = data.columns.find(col => col.type === 'number');
      if (numericCol) validColumns.push(numericCol.name);
    } else if (['pie', 'donut'].includes(chartType)) {
      const textCol = data.columns.find(col => col.type === 'text');
      const numCol = data.columns.find(col => col.type === 'number');
      if (textCol) validColumns.push(textCol.name);
      if (numCol) validColumns.push(numCol.name);
    } else if (['line', 'area'].includes(chartType)) {
      const dateCol = data.columns.find(col => col.type === 'date');
      const numCol = data.columns.find(col => col.type === 'number');
      if (dateCol && numCol) {
        validColumns.push(dateCol.name, numCol.name);
      } else if (data.columns.length >= 2) {
        validColumns.push(data.columns[0].name, data.columns[1].name);
      }
    } else {
      // Default: use first two available columns
      if (data.columns.length >= 2) {
        validColumns.push(data.columns[0].name, data.columns[1].name);
      } else if (data.columns.length === 1) {
        validColumns.push(data.columns[0].name);
      }
    }
  }
  
  console.log(`📋 Column validation for ${suggestion.chartType}:`, {
    originalXAxis: suggestion.xAxis,
    originalYAxis: suggestion.yAxis,
    validatedColumns: validColumns,
    availableColumns: availableColumns.slice(0, 5)
  });
  
  return validColumns;
}

function generateEnhancedBusinessIntelligence(data: ProcessedData): AIChartSuggestion[] {
  console.log('🧠 Generating enhanced business intelligence suggestions');
  
  const suggestions: AIChartSuggestion[] = [];
  const insights = analyzeDataPatterns(data);
  
  console.log('📊 Business patterns detected:', insights);

  // KPI Cards - Always start with key metrics
  if (insights.numericColumns.length > 0) {
    const revenueCol = insights.numericColumns.find(col => 
      col.name.toLowerCase().includes('revenue') || col.name.toLowerCase().includes('sales')
    ) || insights.numericColumns[0];
    
    suggestions.push({
      type: 'card',
      title: `Total ${revenueCol.name}`,
      description: `Key performance indicator for ${revenueCol.name}`,
      columns: [revenueCol.name],
      priority: 10,
      visualizationGoal: 'kpi_tracking',
      businessInsight: `Critical business metric showing total ${revenueCol.name}`
    });
  }

  // Time-based trends
  if (insights.hasTimeData && insights.numericColumns.length > 0) {
    const dateCol = insights.dateColumns[0];
    const valueCol = insights.numericColumns.find(col => 
      col.name.toLowerCase().includes('revenue') || col.name.toLowerCase().includes('sales')
    ) || insights.numericColumns[0];
    
    suggestions.push({
      type: 'line',
      title: `${valueCol.name} Trend Over Time`,
      description: `Time series analysis of ${valueCol.name} performance`,
      columns: [dateCol.name, valueCol.name],
      priority: 9,
      visualizationGoal: 'trend_analysis',
      businessInsight: `Track ${valueCol.name} performance over time to identify patterns`
    });
  }

  // Geographic analysis
  if (insights.hasGeographicData && insights.numericColumns.length > 0) {
    const geoCol = insights.categoricalColumns.find(col => 
      col.name.toLowerCase().includes('region') || col.name.toLowerCase().includes('location')
    );
    const valueCol = insights.numericColumns[0];
    
    if (geoCol) {
      suggestions.push({
        type: 'bar',
        title: `${valueCol.name} by ${geoCol.name}`,
        description: `Geographic distribution of ${valueCol.name}`,
        columns: [geoCol.name, valueCol.name],
        priority: 8,
        visualizationGoal: 'geographic_analysis',
        businessInsight: `Compare ${valueCol.name} across different ${geoCol.name.toLowerCase()}s`
      });
    }
  }

  // Product analysis
  if (insights.hasProductData && insights.numericColumns.length > 0) {
    const productCol = insights.categoricalColumns.find(col => 
      col.name.toLowerCase().includes('product') || col.name.toLowerCase().includes('category')
    );
    const valueCol = insights.numericColumns[0];
    
    if (productCol) {
      suggestions.push({
        type: 'pie',
        title: `${valueCol.name} Distribution by ${productCol.name}`,
        description: `Market share analysis by ${productCol.name}`,
        columns: [productCol.name, valueCol.name],
        priority: 7,
        visualizationGoal: 'composition_analysis',
        businessInsight: `Understand ${valueCol.name} composition across ${productCol.name.toLowerCase()}s`
      });
    }
  }

  // Correlation analysis
  if (insights.numericColumns.length >= 2) {
    const col1 = insights.numericColumns[0];
    const col2 = insights.numericColumns[1];
    
    suggestions.push({
      type: 'scatter',
      title: `${col1.name} vs ${col2.name} Analysis`,
      description: `Correlation analysis between ${col1.name} and ${col2.name}`,
      columns: [col1.name, col2.name],
      priority: 6,
      visualizationGoal: 'correlation_analysis',
      businessInsight: `Identify relationships between ${col1.name} and ${col2.name}`
    });
  }

  // Performance gauge
  if (insights.hasRatingData || insights.numericColumns.length > 0) {
    const performanceCol = insights.numericColumns.find(col => 
      col.name.toLowerCase().includes('rating') || col.name.toLowerCase().includes('score')
    ) || insights.numericColumns[0];
    
    suggestions.push({
      type: 'gauge',
      title: `${performanceCol.name} Performance`,
      description: `Performance indicator for ${performanceCol.name}`,
      columns: [performanceCol.name],
      priority: 6,
      visualizationGoal: 'performance_tracking',
      businessInsight: `Monitor ${performanceCol.name} performance levels`
    });
  }

  console.log(`✅ Generated ${suggestions.length} enhanced business intelligence suggestions`);
  return suggestions.slice(0, 8);
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
    const businessColumns = columns.filter(col => 
      col.description && (col.type === 'number' || col.type === 'text')
    );
    
    if (businessColumns.length >= 2) {
      relevantColumns.push(businessColumns[0].name, businessColumns[1].name);
    } else if (columns.length >= 2) {
      relevantColumns.push(columns[0].name, columns[1].name);
    }
  } else if (relevantColumns.length === 1 && columns.length >= 2) {
    const complementaryColumn = columns.find(col => 
      col.name !== relevantColumns[0] && 
      (col.type === 'number' || col.type === 'text') &&
      col.description
    );
    if (complementaryColumn) {
      relevantColumns.push(complementaryColumn.name);
    } else {
      const fallbackColumn = columns.find(col => col.name !== relevantColumns[0]);
      if (fallbackColumn) {
        relevantColumns.push(fallbackColumn.name);
      }
    }
  }
  
  return relevantColumns;
}
