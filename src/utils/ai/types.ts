
import { ChartType } from "@/types";

export interface AIChartSuggestion {
  type: ChartType;
  title: string;
  description: string;
  columns: string[];
  priority: number;
  reasoning?: string;
  visualizationGoal?: string;
}

export const CHART_TYPE_MAP: Record<string, ChartType> = {
  'bar': 'bar',
  'column': 'column',
  'line': 'line',
  'area': 'area',
  'pie': 'pie',
  'donut': 'donut',
  'scatter': 'scatter',
  'bubble': 'bubble',
  'combo': 'combo',
  'card': 'card',
  'gauge': 'gauge',
  'funnel': 'funnel',
  'treemap': 'treemap',
  'radar': 'radar',
  'heatmap': 'heatmap',
  'waterfall': 'waterfall',
  'histogram': 'histogram',
  'boxplot': 'boxplot',
  'table': 'table',
  'matrix': 'matrix',
  'timeline': 'timeline',
  'gantt': 'gantt'
};
