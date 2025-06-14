import { ChartType, ChartDataset } from "@/types";
import { DEFAULT_COLORS } from "./types";

export const DEFAULT_LABELS: Record<string, string[]> = {
  bar: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  column: ["Q1", "Q2", "Q3", "Q4"],
  "stacked-bar": ["Product A", "Product B", "Product C", "Product D"],
  "stacked-column": ["Q1", "Q2", "Q3", "Q4"],
  line: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  area: ["Week 1", "Week 2", "Week 3", "Week 4"],
  "stacked-area": ["Jan", "Feb", "Mar", "Apr", "May"],
  combo: ["Q1", "Q2", "Q3", "Q4"],
  pie: ["Desktop", "Mobile", "Tablet"],
  donut: ["Chrome", "Firefox", "Safari", "Edge"],
  scatter: ["Dataset"],
  bubble: ["Bubble Data"],
  radar: ["Speed", "Reliability", "Comfort", "Safety", "Efficiency"],
  treemap: ["Technology", "Healthcare", "Finance", "Education"],
  funnel: ["Awareness", "Interest", "Consideration", "Purchase"],
  gauge: ["Performance"],
  histogram: ["0-10", "10-20", "20-30", "30-40", "40-50"],
  boxplot: ["Data Distribution"],
  waterfall: ["Starting", "Increase", "Decrease", "Ending"],
  "decomposition-tree": ["Root", "Branch A", "Branch B", "Branch C"],
  card: ["Revenue"],
  "multi-row-card": ["Sales", "Users", "Revenue", "Growth"],
  kpi: ["Performance"],
  table: [],
  text: [],
  gantt: ["Task 1", "Task 2", "Task 3", "Task 4"],
  matrix: ["Row 1", "Row 2", "Row 3"],
  slicer: ["Option 1", "Option 2", "Option 3"],
  "filled-map": ["Region 1", "Region 2", "Region 3"],
  heatmap: ["Jan", "Feb", "Mar", "Apr"],
  "word-cloud": ["Innovation", "Technology", "Growth", "Success"],
  timeline: ["2020", "2021", "2022", "2023"],
};

export const DEFAULT_DATASETS: Record<string, ChartDataset> = {
  bar: {
    label: "Sales",
    data: [65, 59, 80, 81, 56, 55],
    backgroundColor: DEFAULT_COLORS[0],
  },
  column: {
    label: "Revenue",
    data: [120, 150, 180, 200],
    backgroundColor: DEFAULT_COLORS[1],
  },
  "stacked-bar": {
    label: "Region 1",
    data: [30, 40, 35, 50],
    backgroundColor: DEFAULT_COLORS[0],
  },
  "stacked-column": {
    label: "Sales",
    data: [65, 80, 95, 110],
    backgroundColor: DEFAULT_COLORS[0],
  },
  line: {
    label: "Revenue",
    data: [65, 59, 80, 81, 56, 55],
    borderColor: DEFAULT_COLORS[0],
    backgroundColor: `${DEFAULT_COLORS[0]}33`,
    borderWidth: 2,
  },
  area: {
    label: "Users",
    data: [40, 55, 45, 60],
    borderColor: DEFAULT_COLORS[1],
    backgroundColor: `${DEFAULT_COLORS[1]}33`,
    borderWidth: 2,
    fill: true,
  },
  "stacked-area": {
    label: "Desktop",
    data: [30, 40, 45, 50, 55],
    borderColor: DEFAULT_COLORS[0],
    backgroundColor: `${DEFAULT_COLORS[0]}33`,
    borderWidth: 2,
    fill: true,
  },
  combo: {
    label: "Sales",
    data: [65, 80, 95, 110],
    backgroundColor: DEFAULT_COLORS[0],
  },
  pie: {
    label: "Usage",
    data: [60, 30, 10],
    backgroundColor: DEFAULT_COLORS,
  },
  donut: {
    label: "Browser Share",
    data: [45, 25, 20, 10],
    backgroundColor: DEFAULT_COLORS,
  },
  scatter: {
    label: "Data Points",
    data: [
      { x: 10, y: 20 },
      { x: 15, y: 25 },
      { x: 20, y: 30 },
      { x: 25, y: 28 },
      { x: 30, y: 35 }
    ],
    backgroundColor: DEFAULT_COLORS[0],
  },
  bubble: {
    label: "Bubble Data",
    data: [
      { x: 10, y: 20, r: 5 },
      { x: 15, y: 25, r: 8 },
      { x: 20, y: 30, r: 12 },
      { x: 25, y: 28, r: 6 },
      { x: 30, y: 35, r: 10 }
    ],
    backgroundColor: DEFAULT_COLORS[1],
  },
  radar: {
    label: "Performance",
    data: [80, 75, 90, 85, 70],
    borderColor: DEFAULT_COLORS[0],
    backgroundColor: `${DEFAULT_COLORS[0]}33`,
    borderWidth: 2,
  },
  treemap: {
    label: "Market Share",
    data: [45, 25, 20, 10],
    backgroundColor: DEFAULT_COLORS,
  },
  funnel: {
    label: "Conversion",
    data: [1000, 800, 600, 400],
    backgroundColor: DEFAULT_COLORS,
  },
  gauge: {
    label: "Score",
    data: [75],
    backgroundColor: DEFAULT_COLORS[0],
  },
  histogram: {
    label: "Frequency",
    data: [5, 12, 18, 15, 8],
    backgroundColor: DEFAULT_COLORS[0],
  },
  boxplot: {
    label: "Distribution",
    data: [10, 25, 50, 75, 90],
    backgroundColor: DEFAULT_COLORS[0],
  },
  waterfall: {
    label: "Value",
    data: [100, 20, -15, 105],
    backgroundColor: DEFAULT_COLORS,
  },
  "decomposition-tree": {
    label: "Value",
    data: [100, 40, 35, 25],
    backgroundColor: DEFAULT_COLORS,
  },
  card: {
    label: "Total Revenue",
    data: [125000, 12.5],
    backgroundColor: DEFAULT_COLORS[0],
  },
  "multi-row-card": {
    label: "Values",
    data: [125000, 8542, 95000, 15.2],
    backgroundColor: DEFAULT_COLORS[0],
  },
  kpi: {
    label: "Performance",
    data: [85, 100],
    backgroundColor: DEFAULT_COLORS[0],
  },
  table: {
    label: "",
    data: [],
  },
  text: {
    label: "Click to edit text",
    data: [],
  },
  gantt: {
    label: "Tasks",
    data: [
      { task: "Planning", start: "2024-01-01", end: "2024-01-15", progress: 100 },
      { task: "Development", start: "2024-01-10", end: "2024-02-28", progress: 75 },
      { task: "Testing", start: "2024-02-15", end: "2024-03-15", progress: 50 },
      { task: "Deployment", start: "2024-03-01", end: "2024-03-31", progress: 25 }
    ],
    backgroundColor: DEFAULT_COLORS[0],
  },
  matrix: {
    label: "Matrix Data",
    data: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    backgroundColor: DEFAULT_COLORS,
  },
  slicer: {
    label: "Filter Options",
    data: ["All", "Category A", "Category B", "Category C"],
    backgroundColor: DEFAULT_COLORS[0],
  },
  "filled-map": {
    label: "Regional Data",
    data: [
      { region: "North", value: 45 },
      { region: "South", value: 32 },
      { region: "East", value: 28 },
      { region: "West", value: 38 }
    ],
    backgroundColor: DEFAULT_COLORS,
  },
  heatmap: {
    label: "Heat Data",
    data: [
      { x: "Jan", y: "Product A", v: 20 },
      { x: "Feb", y: "Product A", v: 35 },
      { x: "Mar", y: "Product A", v: 15 },
      { x: "Jan", y: "Product B", v: 25 },
      { x: "Feb", y: "Product B", v: 40 },
      { x: "Mar", y: "Product B", v: 30 }
    ],
    backgroundColor: DEFAULT_COLORS[0],
  },
  "word-cloud": {
    label: "Words",
    data: [
      { text: "Innovation", size: 40 },
      { text: "Technology", size: 35 },
      { text: "Growth", size: 30 },
      { text: "Success", size: 25 },
      { text: "Future", size: 20 }
    ],
    backgroundColor: DEFAULT_COLORS,
  },
  timeline: {
    label: "Events",
    data: [
      { date: "2020", event: "Project Started" },
      { date: "2021", event: "First Milestone" },
      { date: "2022", event: "Major Release" },
      { date: "2023", event: "Market Launch" }
    ],
    backgroundColor: DEFAULT_COLORS[0],
  },
};

export function getDefaultTitle(type: ChartType): string {
  const titles: Record<ChartType, string> = {
    bar: "Bar Chart",
    column: "Column Chart", 
    "stacked-bar": "Stacked Bar Chart",
    "stacked-column": "Stacked Column Chart",
    line: "Line Chart",
    area: "Area Chart",
    "stacked-area": "Stacked Area Chart",
    combo: "Combo Chart",
    pie: "Pie Chart",
    donut: "Donut Chart",
    scatter: "Scatter Plot",
    bubble: "Bubble Chart",
    radar: "Radar Chart",
    treemap: "Treemap",
    funnel: "Funnel Chart",
    gauge: "Gauge Chart",
    histogram: "Histogram",
    boxplot: "Box Plot",
    waterfall: "Waterfall Chart",
    "decomposition-tree": "Decomposition Tree",
    card: "Card",
    "multi-row-card": "Multi-row Card",
    kpi: "KPI Visual",
    table: "Data Table",
    text: "Text Label",
    heatmap: "Heatmap",
    sankey: "Sankey Diagram",
    matrix: "Matrix",
    slicer: "Slicer",
    map: "Map",
    "filled-map": "Filled Map",
    "word-cloud": "Word Cloud",
    timeline: "Timeline",
    gantt: "Gantt Chart",
    "semi-circle": "Semi-circle Chart",
  };

  return titles[type] || "Chart";
}

export function getDefaultOptions(type: ChartType): Record<string, any> {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  const typeSpecificOptions: Record<string, any> = {
    bar: {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    column: {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    "stacked-bar": {
      ...baseOptions,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
    },
    "stacked-column": {
      ...baseOptions,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
    },
    "stacked-area": {
      ...baseOptions,
      scales: {
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
    },
    combo: {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    histogram: {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frequency'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Bins'
          }
        }
      },
    },
    waterfall: {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  };

  return typeSpecificOptions[type] || baseOptions;
}
