export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type ChartType =
  | "bar"
  | "column"
  | "line"
  | "area"
  | "pie"
  | "donut"
  | "scatter"
  | "bubble"
  | "combo"
  | "card"
  | "gauge"
  | "funnel"
  | "treemap"
  | "radar"
  | "heatmap"
  | "waterfall"
  | "histogram"
  | "boxplot"
  | "table"
  | "matrix"
  | "timeline"
  | "gantt"
  | "stacked-bar"
  | "stacked-column"
  | "stacked-area"
  | "multi-row-card"
  | "text"
  | "image";

export interface ChartItemType {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  position: Position;
  size: Size;
  data: ChartData;
  style?: any;
  isLocked?: boolean;
  isResizable?: boolean;
  isDraggable?: boolean;
  imageUrl?: string;
  text?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: any[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
}

export interface DashboardState {
  title: string;
  items: ChartItemType[];
  selectedItemId: string | null;
  isGridVisible: boolean;
  gridSize: number;
  isSnapToGrid: boolean;
  history: DashboardState[];
  historyIndex: number;
  isPreviewMode: boolean;
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
  | { type: "TOGGLE_GRID" }
  | { type: "SET_GRID_SIZE"; payload: number }
  | { type: "TOGGLE_SNAP_TO_GRID" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "TOGGLE_PREVIEW_MODE" }
  | { type: "SET_CANVAS_COLOR"; payload: string }
  | { type: "IMPORT_DASHBOARD"; payload: DashboardState };

export interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}
