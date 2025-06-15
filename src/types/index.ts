import { ReactNode } from "react";

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type ChartType = 
  | "bar" 
  | "line" 
  | "pie" 
  | "area" 
  | "scatter" 
  | "donut" 
  | "text"
  | "card"
  | "bubble"
  | "gauge"
  | "semi-circle"
  | "radar"
  | "treemap"
  | "funnel"
  | "boxplot"
  | "table"
  | "column"
  | "stacked-bar"
  | "stacked-area"
  | "combo"
  | "histogram"
  | "multi-row-card";

// Defining more specific data point types
export type SimpleDataPoint = number;
export type ComplexDataPoint = {
  x: number;
  y: number;
  r?: number;
  z?: number; // Adding z for bubble chart
};
export type BoxPlotDataPoint = {
  x: number;
  y: number[];
};

// Union type for all possible data point types
export type ChartDataPoint = SimpleDataPoint | ComplexDataPoint | BoxPlotDataPoint;

// Table data structure
export type TableColumnConfig = {
  id: string;
  header: string;
  accessor: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  visible?: boolean;
};

export type TableRowData = Record<string, string | number>;

export type ChartDataset = {
  label: string;
  data: ChartDataPoint[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  visible?: boolean;
  labelColors?: string[]; // Add this property for per-label colors
};

export type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
  tableColumns?: TableColumnConfig[];
  tableRows?: TableRowData[];
};

export type ChartItemType = {
  id: string;
  type: ChartType;
  position: Position;
  size: Size;
  title: string;
  data: ChartData;
  options?: Record<string, any>;
};

export type DashboardState = {
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
  canvasColor?: string;
};

export type DashboardHistoryState = {
  title: string;
  items: ChartItemType[];
};

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

export type DashboardContextType = {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
};
