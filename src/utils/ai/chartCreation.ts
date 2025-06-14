
import { ChartItemType, Position } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { ProcessedData } from "@/utils/dataProcessor";
import { prepareChartData } from "@/utils/chartDataPreparation";
import { v4 as uuidv4 } from "uuid";
import { AIChartSuggestion } from "./types";

export function createAIChartsFromData(
  data: ProcessedData, 
  suggestions: AIChartSuggestion[], 
  startPosition: Position = { x: 20, y: 20 }
): ChartItemType[] {
  console.log('=== STRATEGIC DASHBOARD CREATION WITH BUSINESS INTELLIGENCE ===');
  console.log('Creating intelligent dashboard from AI business analysis...');
  
  const charts: ChartItemType[] = [];
  
  // Strategic grid layout optimized for business decision-making
  const gridLayout = calculateBusinessIntelligentLayout(suggestions);
  
  // Create up to 8 high-value charts based on business priority
  suggestions.slice(0, 8).forEach((suggestion, index) => {
    console.log(`Creating strategic chart ${index + 1}:`, {
      type: suggestion.type,
      title: suggestion.title,
      priority: suggestion.priority,
      businessGoal: suggestion.visualizationGoal,
      insight: suggestion.businessInsight?.substring(0, 50) + '...'
    });
    
    const layout = gridLayout[index];
    const position = {
      x: startPosition.x + layout.x,
      y: startPosition.y + layout.y
    };
    
    try {
      const chartData = prepareChartData(data, {
        type: suggestion.type,
        title: suggestion.title,
        description: suggestion.description,
        columns: suggestion.columns,
        priority: suggestion.priority
      });
      
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
      
      console.log(`Successfully created strategic chart: ${chart.title}`, {
        priority: suggestion.priority,
        goal: suggestion.visualizationGoal,
        size: chart.size
      });
      charts.push(chart);
    } catch (error) {
      console.error(`Error creating strategic chart ${suggestion.type}:`, error);
    }
  });
  
  console.log(`Created ${charts.length} strategic business intelligence charts with optimized layout`);
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
    const isExecutiveLevel = suggestion.priority >= 9; // Executive-level insights
    const isStrategic = suggestion.priority >= 7; // Strategic insights
    const isKPI = suggestion.type === 'card' || suggestion.type === 'gauge';
    const isDetailedAnalysis = suggestion.type === 'table' || suggestion.type === 'scatter';
    
    let width = baseWidth;
    let height = baseHeight;
    
    // Strategic sizing based on business importance and chart type
    if (isKPI && isExecutiveLevel) {
      // Executive KPI cards - prominent but compact
      width = 320;
      height = 200;
    } else if (isExecutiveLevel) {
      // Executive-level charts - larger for impact
      width = 500;
      height = 350;
    } else if (isStrategic) {
      // Strategic charts - enhanced size
      width = 450;
      height = 320;
    } else if (isDetailedAnalysis) {
      // Detailed analysis - wider for data exploration
      width = 480;
      height = 320;
    } else if (isKPI) {
      // Standard KPI cards
      width = 300;
      height = 180;
    }
    
    // Calculate position in business-optimized grid
    // Place highest priority items in prime real estate (top-left)
    let col, row;
    
    if (i < 3) {
      // Top row for most critical insights
      col = i;
      row = 0;
    } else if (i < 6) {
      // Second row for supporting insights
      col = i - 3;
      row = 1;
    } else {
      // Third row for detailed analysis
      col = i - 6;
      row = 2;
    }
    
    layouts.push({
      x: col * (baseWidth + gap),
      y: row * (baseHeight + gap + 20), // Extra spacing for business context
      size: { width, height }
    });
  }
  
  return layouts;
}
