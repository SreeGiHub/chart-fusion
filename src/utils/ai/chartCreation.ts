
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
  console.log('=== AI CHART CREATION START ===');
  
  const charts: ChartItemType[] = [];
  const gridCols = 4;
  const chartWidth = 380;
  const chartHeight = 280;
  const horizontalGap = 10;
  const verticalGap = 10;
  
  suggestions.slice(0, 12).forEach((suggestion, index) => {
    console.log(`Creating AI-suggested chart ${index + 1}: ${suggestion.type}`);
    
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    
    const position = {
      x: startPosition.x + (col * (chartWidth + horizontalGap)),
      y: startPosition.y + (row * (chartHeight + verticalGap))
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
      chart.size = { width: chartWidth, height: chartHeight };
      chart.title = suggestion.title;
      chart.data = chartData;
      chart.id = uuidv4();
      
      console.log(`Successfully created AI chart: ${chart.title}`);
      charts.push(chart);
    } catch (error) {
      console.error(`Error creating AI chart ${suggestion.type}:`, error);
    }
  });
  
  console.log(`Created ${charts.length} AI-enhanced charts`);
  return charts;
}
