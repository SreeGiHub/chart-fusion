
import { ChartType } from "@/types";

export interface ChartTemplate {
  id: string;
  chartType: ChartType;
  title: string;
  description: string;
  category: string;
  icon: string;
  dataMapping: {
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
    valueColumn?: string;
    labelColumn?: string;
  };
  calculation: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'none';
  priority: number;
}

export const CHART_TEMPLATES: ChartTemplate[] = [
  // Column & Bar Charts
  {
    id: 'bar-comparison',
    chartType: 'bar',
    title: 'Bar Chart',
    description: 'Compare values across categories',
    category: 'Column & Bar',
    icon: 'BarChart3',
    dataMapping: { xAxis: 'auto', yAxis: 'auto' },
    calculation: 'sum',
    priority: 1
  },
  {
    id: 'column-chart',
    chartType: 'column',
    title: 'Column Chart',
    description: 'Vertical bars for category comparison',
    category: 'Column & Bar',
    icon: 'BarChart3',
    dataMapping: { xAxis: 'auto', yAxis: 'auto' },
    calculation: 'sum',
    priority: 2
  },
  {
    id: 'stacked-bar',
    chartType: 'stacked-bar',
    title: 'Stacked Bar',
    description: 'Show part-to-whole relationships',
    category: 'Column & Bar',
    icon: 'Layers',
    dataMapping: { xAxis: 'auto', yAxis: 'auto', groupBy: 'auto' },
    calculation: 'sum',
    priority: 3
  },
  {
    id: 'stacked-column',
    chartType: 'stacked-column',
    title: 'Stacked Column',
    description: 'Vertical stacked comparison',
    category: 'Column & Bar',
    icon: 'Layers',
    dataMapping: { xAxis: 'auto', yAxis: 'auto', groupBy: 'auto' },
    calculation: 'sum',
    priority: 4
  },

  // Line & Area Charts
  {
    id: 'line-trend',
    chartType: 'line',
    title: 'Line Chart',
    description: 'Show trends and changes over time',
    category: 'Line & Area',
    icon: 'LineChart',
    dataMapping: { xAxis: 'auto', yAxis: 'auto' },
    calculation: 'none',
    priority: 5
  },
  {
    id: 'area-chart',
    chartType: 'area',
    title: 'Area Chart',
    description: 'Filled line chart showing volume',
    category: 'Line & Area',
    icon: 'AreaChart',
    dataMapping: { xAxis: 'auto', yAxis: 'auto' },
    calculation: 'sum',
    priority: 6
  },
  {
    id: 'stacked-area',
    chartType: 'stacked-area',
    title: 'Stacked Area',
    description: 'Multiple series stacked over time',
    category: 'Line & Area',
    icon: 'TrendingUp',
    dataMapping: { xAxis: 'auto', yAxis: 'auto', groupBy: 'auto' },
    calculation: 'sum',
    priority: 7
  },
  {
    id: 'combo-chart',
    chartType: 'combo',
    title: 'Combo Chart',
    description: 'Combine different chart types',
    category: 'Line & Area',
    icon: 'Activity',
    dataMapping: { xAxis: 'auto', yAxis: 'auto' },
    calculation: 'sum',
    priority: 8
  },

  // Pie & Donut Charts
  {
    id: 'pie-breakdown',
    chartType: 'pie',
    title: 'Pie Chart',
    description: 'Show proportions of a whole',
    category: 'Pie & Donut',
    icon: 'PieChart',
    dataMapping: { labelColumn: 'auto', valueColumn: 'auto' },
    calculation: 'sum',
    priority: 9
  },
  {
    id: 'donut-chart',
    chartType: 'donut',
    title: 'Donut Chart',
    description: 'Pie chart with center space',
    category: 'Pie & Donut',
    icon: 'Target',
    dataMapping: { labelColumn: 'auto', valueColumn: 'auto' },
    calculation: 'sum',
    priority: 10
  },
  {
    id: 'treemap-chart',
    chartType: 'treemap',
    title: 'Treemap',
    description: 'Hierarchical data visualization',
    category: 'Pie & Donut',
    icon: 'Layers',
    dataMapping: { labelColumn: 'auto', valueColumn: 'auto' },
    calculation: 'sum',
    priority: 11
  },
  {
    id: 'funnel-chart',
    chartType: 'funnel',
    title: 'Funnel Chart',
    description: 'Show conversion processes',
    category: 'Pie & Donut',
    icon: 'TrendingUp',
    dataMapping: { labelColumn: 'auto', valueColumn: 'auto' },
    calculation: 'sum',
    priority: 12
  },

  // Scatter & Bubble Charts
  {
    id: 'scatter-plot',
    chartType: 'scatter',
    title: 'Scatter Plot',
    description: 'Show relationships between variables',
    category: 'Scatter & Bubble',
    icon: 'ChartScatter',
    dataMapping: { xAxis: 'auto', yAxis: 'auto' },
    calculation: 'none',
    priority: 13
  },
  {
    id: 'bubble-chart',
    chartType: 'bubble',
    title: 'Bubble Chart',
    description: 'Three-dimensional data visualization',
    category: 'Scatter & Bubble',
    icon: 'ChartScatter',
    dataMapping: { xAxis: 'auto', yAxis: 'auto', valueColumn: 'auto' },
    calculation: 'none',
    priority: 14
  },
  {
    id: 'radar-chart',
    chartType: 'radar',
    title: 'Radar Chart',
    description: 'Multi-variable comparison',
    category: 'Scatter & Bubble',
    icon: 'Target',
    dataMapping: { labelColumn: 'auto', valueColumn: 'auto' },
    calculation: 'avg',
    priority: 15
  },
  {
    id: 'gauge-chart',
    chartType: 'gauge',
    title: 'Gauge Chart',
    description: 'Performance indicator',
    category: 'Scatter & Bubble',
    icon: 'Target',
    dataMapping: { valueColumn: 'auto' },
    calculation: 'avg',
    priority: 16
  },

  // Data & KPI Charts
  {
    id: 'data-table',
    chartType: 'table',
    title: 'Table',
    description: 'Detailed data view',
    category: 'Data & KPI',
    icon: 'Table',
    dataMapping: {},
    calculation: 'none',
    priority: 17
  },
  {
    id: 'kpi-card',
    chartType: 'card',
    title: 'KPI Card',
    description: 'Single metric display',
    category: 'Data & KPI',
    icon: 'FileText',
    dataMapping: { valueColumn: 'auto' },
    calculation: 'sum',
    priority: 18
  },
  {
    id: 'multi-row-card',
    chartType: 'multi-row-card',
    title: 'Multi-row Card',
    description: 'Multiple metrics display',
    category: 'Data & KPI',
    icon: 'Layers',
    dataMapping: { valueColumn: 'auto' },
    calculation: 'sum',
    priority: 19
  }
];

export const getTemplatesByCategory = () => {
  const categories: Record<string, ChartTemplate[]> = {};
  
  CHART_TEMPLATES.forEach(template => {
    if (!categories[template.category]) {
      categories[template.category] = [];
    }
    categories[template.category].push(template);
  });
  
  return categories;
};

export const getTemplateById = (id: string): ChartTemplate | undefined => {
  return CHART_TEMPLATES.find(template => template.id === id);
};
