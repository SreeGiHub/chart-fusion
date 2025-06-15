import { ChartItemType, Position } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { ProcessedData } from "@/utils/dataProcessor";
import { prepareChartData } from "@/utils/chartData";
import { v4 as uuidv4 } from "uuid";
import { AIChartSuggestion } from "./types";

export function createAIChartsFromData(
  data: ProcessedData, 
  suggestions: AIChartSuggestion[], 
  startPosition: Position = { x: 20, y: 20 }
): ChartItemType[] {
  console.log('\n=== CREATING CHARTS FROM AI SUGGESTIONS ===');
  console.log('📊 Input data overview:', {
    rows: data.rows.length,
    columns: data.columns.map(col => `${col.name} (${col.type})`),
    suggestionsCount: suggestions.length,
    sampleData: data.rows.slice(0, 2)
  });
  
  console.log('🤖 AI suggestions received:', suggestions.map(s => ({ 
    type: s.type, 
    title: s.title, 
    priority: s.priority,
    columns: s.columns 
  })));
  
  const charts: ChartItemType[] = [];
  
  // Strategic grid layout optimized for business decision-making
  const gridLayout = calculateBusinessIntelligentLayout(suggestions);
  
  // Create charts based on AI suggestions with proper mapping
  suggestions.slice(0, 8).forEach((suggestion, index) => {
    console.log(`\n📈 Creating chart ${index + 1}/${suggestions.length}:`, {
      type: suggestion.type,
      title: suggestion.title,
      priority: suggestion.priority,
      columns: suggestion.columns
    });
    
    const layout = gridLayout[index];
    const position = {
      x: startPosition.x + layout.x,
      y: startPosition.y + layout.y
    };
    
    try {
      console.log('🔄 Preparing chart data with actual user data...');
      
      // Validate that columns exist in the data
      const validColumns = suggestion.columns.filter(colName => 
        data.columns.some(col => col.name === colName)
      );
      
      if (validColumns.length === 0) {
        console.warn('⚠️ No valid columns found, using first available columns');
        const firstTextCol = data.columns.find(col => col.type === 'text');
        const firstNumCol = data.columns.find(col => col.type === 'number');
        
        if (firstTextCol && firstNumCol) {
          validColumns.push(firstTextCol.name, firstNumCol.name);
        } else if (data.columns.length >= 1) {
          validColumns.push(data.columns[0].name);
          if (data.columns.length >= 2) {
            validColumns.push(data.columns[1].name);
          }
        }
      }
      
      console.log('✅ Using columns for chart:', validColumns);
      
      // Prepare chart data using the enhanced data preparation with validated columns
      const chartData = prepareChartData(data, {
        type: suggestion.type,
        title: suggestion.title,
        description: suggestion.description,
        columns: validColumns, // Use validated columns
        priority: suggestion.priority
      });
      
      console.log('✅ Chart data prepared:', {
        labels: chartData.labels?.slice(0, 3),
        datasetCount: chartData.datasets?.length,
        firstDatasetLength: chartData.datasets?.[0]?.data?.length,
        dataPreview: chartData.datasets?.[0]?.data?.slice(0, 3)
      });
      
      // Create chart item with proper type mapping
      const chart = createNewChartItem(suggestion.type, position);
      chart.size = layout.size;
      chart.title = suggestion.title;
      chart.data = chartData;
      chart.id = uuidv4();
      
      // Add business context to chart options if available
      if (suggestion.businessInsight || suggestion.reasoning) {
        chart.options = {
          ...chart.options,
          businessInsight: suggestion.businessInsight,
          reasoning: suggestion.reasoning,
          visualizationGoal: suggestion.visualizationGoal
        };
      }
      
      console.log(`✅ Successfully created chart: ${chart.title}`, {
        type: chart.type,
        priority: suggestion.priority,
        dataLength: chart.data.datasets?.[0]?.data?.length,
        actualColumns: validColumns,
        hasRealData: chart.data.datasets?.[0]?.data?.length > 0
      });
      charts.push(chart);
    } catch (error) {
      console.error(`❌ Error creating chart ${suggestion.type}:`, error);
      // Create fallback chart instead of failing completely
      try {
        const fallbackChart = createNewChartItem('bar', position);
        fallbackChart.title = suggestion.title || 'Data Overview';
        fallbackChart.size = layout.size;
        fallbackChart.id = uuidv4();
        
        // Create simple fallback data using actual column names
        const firstCol = data.columns[0]?.name || 'Category';
        const secondCol = data.columns[1]?.name || 'Value';
        
        fallbackChart.data = {
          labels: [firstCol],
          datasets: [{
            label: secondCol,
            data: [data.rows.length],
            backgroundColor: '#4F46E5'
          }]
        };
        
        charts.push(fallbackChart);
        console.log('⚠️ Created fallback chart for failed suggestion');
      } catch (fallbackError) {
        console.error('❌ Failed to create fallback chart:', fallbackError);
      }
    }
  });
  
  console.log(`\n🎉 Created ${charts.length} charts total with real user data`);
  return charts;
}

function calculateBusinessIntelligentLayout(suggestions: AIChartSuggestion[]) {
  const layouts = [];
  const baseWidth = 400;
  const baseHeight = 300;
  const gap = 30;
  
  // Sort suggestions by business priority for optimal placement
  const prioritizedSuggestions = [...suggestions].sort((a, b) => b.priority - a.priority);
  
  for (let i = 0; i < Math.min(prioritizedSuggestions.length, 8); i++) {
    const suggestion = prioritizedSuggestions[i];
    const isExecutiveLevel = suggestion.priority >= 9;
    const isStrategic = suggestion.priority >= 7;
    const isKPI = suggestion.type === 'card' || suggestion.type === 'gauge';
    const isDetailedAnalysis = suggestion.type === 'table' || suggestion.type === 'scatter' || suggestion.type === 'bubble';
    
    let width = baseWidth;
    let height = baseHeight;
    
    // Strategic sizing based on business importance and chart type
    if (isKPI && isExecutiveLevel) {
      width = 320;
      height = 200;
    } else if (isExecutiveLevel) {
      width = 500;
      height = 350;
    } else if (isStrategic) {
      width = 450;
      height = 320;
    } else if (isDetailedAnalysis) {
      width = 480;
      height = 320;
    } else if (isKPI) {
      width = 300;
      height = 180;
    }
    
    // Calculate position in business-optimized grid
    let col, row;
    
    if (i < 3) {
      col = i;
      row = 0;
    } else if (i < 6) {
      col = i - 3;
      row = 1;
    } else {
      col = i - 6;
      row = 2;
    }
    
    layouts.push({
      x: col * (baseWidth + gap),
      y: row * (baseHeight + gap + 20),
      size: { width, height }
    });
  }
  
  return layouts;
}
