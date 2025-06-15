
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
  
  // Fixed grid layout - 3 columns with proper spacing
  const GRID_COLUMNS = 3;
  const CHART_WIDTH = 400;
  const CHART_HEIGHT = 300;
  const HORIZONTAL_GAP = 50;
  const VERTICAL_GAP = 50;
  
  // Create charts based on AI suggestions with proper grid positioning
  suggestions.slice(0, 9).forEach((suggestion, index) => {
    console.log(`\n📈 Creating chart ${index + 1}/${Math.min(suggestions.length, 9)}:`, {
      type: suggestion.type,
      title: suggestion.title,
      priority: suggestion.priority,
      columns: suggestion.columns
    });
    
    // Calculate grid position
    const row = Math.floor(index / GRID_COLUMNS);
    const col = index % GRID_COLUMNS;
    
    const position = {
      x: startPosition.x + (col * (CHART_WIDTH + HORIZONTAL_GAP)),
      y: startPosition.y + (row * (CHART_HEIGHT + VERTICAL_GAP))
    };
    
    console.log(`📍 Chart position: row=${row}, col=${col}, position=(${position.x}, ${position.y})`);
    
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
      
      // Create chart item with proper sizing
      const chart = createNewChartItem(suggestion.type, position);
      
      // Set consistent size for all charts
      chart.size = { width: CHART_WIDTH, height: CHART_HEIGHT };
      chart.title = suggestion.title;
      chart.data = chartData;
      chart.id = uuidv4();
      
      // Enhanced chart options for better visibility
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
              padding: 10,
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
              bottom: 15
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
                size: 10
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
                size: 10
              }
            }
          }
        } : undefined
      };
      
      console.log(`✅ Successfully created chart: ${chart.title}`, {
        type: chart.type,
        priority: suggestion.priority,
        position: chart.position,
        size: chart.size,
        dataLength: chart.data.datasets?.[0]?.data?.length,
        actualColumns: validColumns
      });
      charts.push(chart);
    } catch (error) {
      console.error(`❌ Error creating chart ${suggestion.type}:`, error);
      // Create fallback chart instead of failing completely
      try {
        const fallbackChart = createNewChartItem('bar', position);
        fallbackChart.title = suggestion.title || 'Data Overview';
        fallbackChart.size = { width: CHART_WIDTH, height: CHART_HEIGHT };
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
  
  console.log(`\n🎉 Created ${charts.length} charts total with proper grid layout`);
  console.log('📋 Chart positions:', charts.map(chart => ({
    title: chart.title,
    position: chart.position,
    size: chart.size
  })));
  
  return charts;
}
