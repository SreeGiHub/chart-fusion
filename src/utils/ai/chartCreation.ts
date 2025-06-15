
import { ChartItemType, Position } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { ProcessedData } from "@/utils/dataProcessor";
import { prepareChartData } from "@/utils/chartData";
import { v4 as uuidv4 } from "uuid";
import { AIChartSuggestion } from "./types";
import { validateAndOptimizeColumns, analyzeDataQuality } from "./chart/validation";
import { calculateGridPosition, calculateOptimalChartSize, DEFAULT_GRID_CONFIG } from "./chart/layout";
import { createChartOptions } from "./chart/configuration";
import { createIntelligentFallback } from "./chart/fallback";

export function createAIChartsFromData(
  data: ProcessedData, 
  suggestions: AIChartSuggestion[], 
  startPosition: Position = { x: 50, y: 50 }
): ChartItemType[] {
  console.log('\n=== CREATING STORY-DRIVEN CHARTS FROM AI SUGGESTIONS ===');
  console.log('📊 Input data overview:', {
    rows: data.rows.length,
    columns: data.columns.map(col => `${col.name} (${col.type})`),
    suggestionsCount: suggestions.length,
    dataQuality: analyzeDataQuality(data)
  });
  
  console.log('🎯 AI suggestions for dashboard story:', suggestions.map(s => ({ 
    type: s.type, 
    title: s.title, 
    priority: s.priority,
    columns: s.columns,
    insight: s.businessInsight || s.description
  })));
  
  const charts: ChartItemType[] = [];
  
  // Sort suggestions by priority and business impact
  const sortedSuggestions = suggestions
    .sort((a, b) => (b.priority || 5) - (a.priority || 5))
    .slice(0, 9); // Limit to 9 charts for optimal layout
  
  console.log('📋 Creating charts in priority order:', sortedSuggestions.map(s => `${s.priority}: ${s.title}`));
  
  sortedSuggestions.forEach((suggestion, index) => {
    console.log(`\n📈 Creating chart ${index + 1}/${sortedSuggestions.length}:`, {
      type: suggestion.type,
      title: suggestion.title,
      priority: suggestion.priority,
      columns: suggestion.columns,
      businessContext: suggestion.businessInsight
    });
    
    // Calculate responsive grid position
    const position = calculateGridPosition(index, startPosition, DEFAULT_GRID_CONFIG);
    
    console.log(`📍 Chart position: row=${Math.floor(index / DEFAULT_GRID_CONFIG.columns)}, col=${index % DEFAULT_GRID_CONFIG.columns}, position=(${position.x}, ${position.y})`);
    
    try {
      console.log('🔄 Preparing enhanced chart data with business context...');
      
      // Validate columns exist and provide intelligent fallbacks
      const validatedColumns = validateAndOptimizeColumns(data, suggestion);
      console.log('✅ Validated columns:', validatedColumns);
      
      // Prepare chart data with validated columns
      const chartData = prepareChartData(data, {
        type: suggestion.type,
        title: suggestion.title,
        description: suggestion.description,
        columns: validatedColumns,
        priority: suggestion.priority || 5
      });
      
      console.log('✅ Chart data prepared:', {
        labels: chartData.labels?.slice(0, 3),
        datasetCount: chartData.datasets?.length,
        firstDatasetLength: chartData.datasets?.[0]?.data?.length,
        dataPreview: chartData.datasets?.[0]?.data?.slice(0, 3),
        tableData: chartData.tableRows ? `${chartData.tableRows.length} rows` : 'N/A'
      });
      
      // Create chart item with enhanced configuration
      const chart = createNewChartItem(suggestion.type, position);
      
      // Set dynamic sizing based on chart type and importance
      const chartSize = calculateOptimalChartSize(suggestion.type, suggestion.priority || 5);
      chart.size = chartSize;
      chart.title = suggestion.title;
      chart.data = chartData;
      chart.id = uuidv4();
      
      // Enhanced chart options for professional appearance
      chart.options = {
        ...chart.options,
        ...createChartOptions(suggestion.type, chart.title, validatedColumns)
      };
      
      console.log(`✅ Successfully created business chart: ${chart.title}`, {
        type: chart.type,
        priority: suggestion.priority,
        position: chart.position,
        size: chart.size,
        dataQuality: `${chart.data.datasets?.[0]?.data?.length || 0} data points`,
        businessInsight: suggestion.businessInsight || 'Strategic business visualization',
        actualColumns: validatedColumns
      });
      
      charts.push(chart);
    } catch (error) {
      console.error(`❌ Error creating business chart ${suggestion.type}:`, error);
      
      // Create intelligent fallback chart with business context
      try {
        const fallbackChart = createIntelligentFallback(suggestion, data, position, index);
        charts.push(fallbackChart);
        console.log('⚠️ Created intelligent fallback chart with business context');
      } catch (fallbackError) {
        console.error('❌ Failed to create intelligent fallback chart:', fallbackError);
      }
    }
  });
  
  console.log(`\n🎉 Created ${charts.length} business-focused charts with professional layout`);
  console.log('📊 Dashboard story summary:', {
    totalCharts: charts.length,
    chartTypes: [...new Set(charts.map(c => c.type))],
    positions: charts.map(chart => ({
      title: chart.title,
      position: chart.position,
      size: chart.size
    })),
    businessValue: 'Comprehensive dashboard telling data-driven business story'
  });
  
  return charts;
}
