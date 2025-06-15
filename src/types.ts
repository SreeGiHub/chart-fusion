import { ReactNode } from "react";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ComplexDataPoint {
  x: number;
  y: number;
  r?: number; // For bubble charts
}

export interface BoxPlotDataPoint {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export interface HeatmapDataPoint {
  x: string;
  y: string;
  v: number;
}

// Extended data point types for new chart types
export interface WordCloudDataPoint {
  text: string;
  size: number;
}

export interface TimelineDataPoint {
  date: string;
  event: string;
}

export interface GanttDataPoint {
  task: string;
  start: string;
  end: string;
  progress: number;
}

export interface MapDataPoint {
  location: string;
  value: number;
}

export interface TreeDataPoint {
  name: string;
  value: number;
  children?: TreeDataPoint[];
}

export interface CardDataPoint {
  title: string;
  value: string;
  change?: string;
}

export type ChartDataPoint = 
  | number 
  | string 
  | ComplexDataPoint 
  | BoxPlotDataPoint 
  | HeatmapDataPoint
  | WordCloudDataPoint
  | TimelineDataPoint
  | GanttDataPoint
  | MapDataPoint
  | TreeDataPoint
  | CardDataPoint
  | any; // Allow any for flexibility with complex chart types

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  hidden?: boolean;
  legendHidden?: boolean;
  labelColors?: string[]; // Add this property for per-label colors
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  tableColumns?: TableColumnConfig[];
  tableRows?: TableRowData[];
}

export type ChartType = 
  | "bar"
  | "line"
  | "pie"
  | "area"
  | "scatter"
  | "donut"
  | "card"
  | "bubble"
  | "gauge"
  | "semi-circle"
  | "radar"
  | "heatmap"
  | "treemap"
  | "funnel"
  | "sankey"
  | "boxplot"
  | "table"
  | "text"
  | "waterfall"
  | "column"
  | "stacked-bar"
  | "stacked-column"
  | "stacked-area"
  | "combo"
  | "histogram"
  | "matrix"
  | "multi-row-card"
  | "kpi"
  | "slicer"
  | "decomposition-tree"
  | "map"
  | "filled-map"
  | "word-cloud"
  | "timeline"
  | "gantt";

export interface ChartItemType {
  id: string;
  type: ChartType;
  title: string;
  position: Position;
  size: Size;
  data: ChartData;
  options?: Record<string, any>;
}

export interface TableColumnConfig {
  id: string;
  header: string;
  accessor: string;
  align?: 'left' | 'center' | 'right';
  visible?: boolean;
  width?: number;
  backgroundColor?: string;
}

export interface TableRowData {
  [key: string]: any;
  _rowColor?: string;
}

export interface DashboardHistoryState {
  title: string;
  items: ChartItemType[];
}

export interface DashboardState {
  title: string;
  items: ChartItemType[];
  selectedItemId: string | null;
  isGridVisible: boolean;
  gridSize: number;
  snapToGrid: boolean;
  editHistory: {
    past: DashboardHistoryState[];
    future: DashboardHistoryState[];
  };
  previewMode: boolean;
  canvasColor: string;
}

export type DashboardAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "ADD_ITEM"; payload: ChartItemType }
  | { type: "UPDATE_ITEM"; payload: { id: string; updates: Partial<ChartItemType> } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_ALL_ITEMS" }
  | { type: "SELECT_ITEM"; payload: string | null }
  | { type: "MOVE_ITEM"; payload: { id: string; position: Position } }
  | { type: "RESIZE_ITEM"; payload: { id: string; size: Size } }
  | { type: "TOGGLE_GRID"; payload?: boolean }
  | { type: "SET_GRID_SIZE"; payload: number }
  | { type: "TOGGLE_SNAP_TO_GRID"; payload?: boolean }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "TOGGLE_PREVIEW_MODE"; payload?: boolean }
  | { type: "SET_CANVAS_COLOR"; payload: string }
  | { type: "IMPORT_DASHBOARD"; payload: DashboardState };

export interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}
