
import { Position } from "@/types";

export interface GridLayoutConfig {
  columns: number;
  chartWidth: number;
  chartHeight: number;
  horizontalGap: number;
  verticalGap: number;
}

export const DEFAULT_GRID_CONFIG: GridLayoutConfig = {
  columns: 3,
  chartWidth: 420,
  chartHeight: 320,
  horizontalGap: 30,
  verticalGap: 40
};

export function calculateGridPosition(
  index: number, 
  startPosition: Position, 
  config: GridLayoutConfig = DEFAULT_GRID_CONFIG
): Position {
  const row = Math.floor(index / config.columns);
  const col = index % config.columns;
  
  return {
    x: startPosition.x + (col * (config.chartWidth + config.horizontalGap)),
    y: startPosition.y + (row * (config.chartHeight + config.verticalGap))
  };
}

export function calculateOptimalChartSize(chartType: string, priority: number): { width: number; height: number } {
  const baseSizes = {
    'multi-row-card': { width: 450, height: 280 },
    'table': { width: 500, height: 350 },
    'card': { width: 200, height: 150 },
    'gauge': { width: 250, height: 200 },
    'pie': { width: 350, height: 300 },
    'donut': { width: 350, height: 300 },
    'funnel': { width: 300, height: 250 },
    'default': { width: 420, height: 320 }
  };
  
  const size = baseSizes[chartType as keyof typeof baseSizes] || baseSizes.default;
  
  // Adjust size based on priority (higher priority = slightly larger)
  const priorityMultiplier = priority >= 8 ? 1.1 : priority >= 6 ? 1.0 : 0.9;
  
  return {
    width: Math.round(size.width * priorityMultiplier),
    height: Math.round(size.height * priorityMultiplier)
  };
}
