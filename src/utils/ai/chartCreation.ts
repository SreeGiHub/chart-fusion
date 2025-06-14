
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
  console.log('=== ENHANCED AI CHART CREATION ===');
  console.log('Creating charts from AI suggestions with business intelligence...');
  
  const charts: ChartItemType[] = [];
  
  // Smart grid layout based on chart priorities and types
  const gridLayout = calculateSmartGridLayout(suggestions);
  
  suggestions.slice(0, 8).forEach((suggestion, index) => {
    console.log(`Creating AI-suggested chart ${index + 1}:`, {
      type: suggestion.type,
      title: suggestion.title,
      priority: suggestion.priority,
      goal: suggestion.visualizationGoal
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
      
      console.log(`Successfully created AI chart: ${chart.title} (Priority: ${suggestion.priority})`);
      charts.push(chart);
    } catch (error) {
      console.error(`Error creating AI chart ${suggestion.type}:`, error);
    }
  });
  
  console.log(`Created ${charts.length} AI-enhanced charts with intelligent layout`);
  return charts;
}

function calculateSmartGridLayout(suggestions: AIChartSuggestion[]) {
  const layouts = [];
  const baseWidth = 400;
  const baseHeight = 300;
  const gap = 20;
  
  // Sort suggestions by priority to place most important charts prominently
  const sortedSuggestions = [...suggestions].sort((a, b) => b.priority - a.priority);
  
  for (let i = 0; i < Math.min(sortedSuggestions.length, 8); i++) {
    const suggestion = sortedSuggestions[i];
    const isHighPriority = suggestion.priority >= 8;
    const isKPI = suggestion.type === 'card' || suggestion.type === 'gauge';
    
    let width = baseWidth;
    let height = baseHeight;
    
    // Adjust size based on chart type and priority
    if (isKPI) {
      width = 280;
      height = 200;
    } else if (isHighPriority) {
      width = 450;
      height = 320;
    }
    
    // Calculate position in a smart grid
    const col = i % 3;
    const row = Math.floor(i / 3);
    
    layouts.push({
      x: col * (baseWidth + gap),
      y: row * (baseHeight + gap),
      size: { width, height }
    });
  }
  
  return layouts;
}
