
import { ChartItemType, Position } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { ProcessedData } from "@/utils/dataProcessor";
import { prepareChartData } from "@/utils/chartData";
import { v4 as uuidv4 } from "uuid";
import { AIChartSuggestion } from "./types";

export function createAIChartsFromData(
  data: ProcessedData, 
  suggestions: AIChartSuggestion[], 
  startPosition: Position = { x: 50, y: 50 }
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
  
  // Enhanced grid layout with better spacing and positioning
  const gridLayout = calculateOptimizedLayout(suggestions);
  
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
        columns: validColumns,
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
      
      // Enhanced chart options for better label visibility
      chart.options = {
        ...chart.options,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          ...chart.options?.plugins,
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 12,
                weight: 'normal'
              },
              padding: 15,
              usePointStyle: true,
              boxWidth: 12
            }
          },
          title: {
            display: true,
            text: chart.title,
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        },
        scales: suggestion.type !== 'pie' && suggestion.type !== 'donut' && suggestion.type !== 'funnel' ? {
          x: {
            display: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                size: 11
              },
              maxRotation: 45,
              minRotation: 0
            }
          },
          y: {
            display: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        } : undefined
      };
      
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

function calculateOptimizedLayout(suggestions: AIChartSuggestion[]) {
  const layouts = [];
  const gap = 40; // Increased gap between charts
  const baseWidth = 450; // Increased base width
  const baseHeight = 350; // Increased base height
  
  // Sort suggestions by business priority for optimal placement
  const prioritizedSuggestions = [...suggestions].sort((a, b) => b.priority - a.priority);
  
  for (let i = 0; i < Math.min(prioritizedSuggestions.length, 8); i++) {
    const suggestion = prioritizedSuggestions[i];
    const isExecutiveLevel = suggestion.priority >= 9;
    const isStrategic = suggestion.priority >= 7;
    const isKPI = suggestion.type === 'card' || suggestion.type === 'gauge' || suggestion.type === 'multi-row-card';
    const isDetailedAnalysis = suggestion.type === 'table' || suggestion.type === 'scatter' || suggestion.type === 'bubble';
    const isWideChart = suggestion.type === 'funnel' || suggestion.type === 'stacked-bar';
    
    let width = baseWidth;
    let height = baseHeight;
    
    // Strategic sizing based on business importance and chart type
    if (isKPI && isExecutiveLevel) {
      width = 380;
      height = 220;
    } else if (suggestion.type === 'table') {
      width = 600;
      height = 400;
    } else if (suggestion.type === 'multi-row-card') {
      width = 420;
      height = 280;
    } else if (isWideChart) {
      width = 500;
      height = 380;
    } else if (isExecutiveLevel) {
      width = 480;
      height = 360;
    } else if (isStrategic) {
      width = 450;
      height = 340;
    } else if (isDetailedAnalysis) {
      width = 500;
      height = 380;
    } else if (isKPI) {
      width = 350;
      height = 200;
    }
    
    // Calculate position in optimized grid with proper spacing
    let col, row;
    
    // Arrange in a 3-column grid with better spacing
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
    
    // Calculate actual positions with dynamic spacing based on chart sizes
    const xSpacing = Math.max(baseWidth, width) + gap;
    const ySpacing = Math.max(baseHeight, height) + gap + 30; // Extra space for titles
    
    layouts.push({
      x: col * xSpacing,
      y: row * ySpacing,
      size: { width, height }
    });
  }
  
  return layouts;
}
