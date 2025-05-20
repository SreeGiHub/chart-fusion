
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

export type ChartDataPoint = number | ComplexDataPoint | BoxPlotDataPoint;

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  hidden?: boolean;  // Add the hidden property
  legendHidden?: boolean;  // Add this to control legend visibility separately
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
  | "text";

export interface ChartItemType {
  id: string;
  type: ChartType;
  title: string;
  position: Position;
  size: Size;
  data: ChartData;
}

export interface TableColumnConfig {
  id: string;
  header: string;
  accessor: string;
  align?: 'left' | 'center' | 'right';
  visible?: boolean;
  width?: number;
}

export interface TableRowData {
  [key: string]: any;
}
