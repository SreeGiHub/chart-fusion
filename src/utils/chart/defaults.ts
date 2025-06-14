import { ChartData, ChartDataPoint, ChartType, HeatmapDataPoint } from "@/types";
import { DEFAULT_COLORS } from "./types";

export const DEFAULT_DATASETS = {
  bar: {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56],
    backgroundColor: DEFAULT_COLORS,
  },
  line: {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56, 55, 40],
    borderColor: DEFAULT_COLORS[0],
    backgroundColor: `${DEFAULT_COLORS[0]}33`,
    borderWidth: 2,
    fill: true,
  },
  pie: {
    label: "Dataset 1",
    data: [300, 200, 150, 100, 50],
    backgroundColor: DEFAULT_COLORS,
    borderWidth: 1,
  },
  area: {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56, 55, 40],
    borderColor: DEFAULT_COLORS[0],
    backgroundColor: `${DEFAULT_COLORS[0]}33`,
    borderWidth: 2,
    fill: true,
  },
  scatter: {
    label: "Dataset 1",
    data: [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 60 },
      { x: 70, y: 80 },
      { x: 90, y: 100 },
    ] as ChartDataPoint[],
    backgroundColor: DEFAULT_COLORS[0],
  },
  donut: {
    label: "Dataset 1",
    data: [300, 200, 150, 100, 50],
    backgroundColor: DEFAULT_COLORS,
    borderWidth: 1,
  },
  bubble: {
    label: "Dataset 1",
    data: [
      { x: 10, y: 20, r: 15 },
      { x: 30, y: 40, r: 10 },
      { x: 50, y: 60, r: 20 },
      { x: 70, y: 80, r: 15 },
      { x: 90, y: 100, r: 25 },
    ] as ChartDataPoint[],
    backgroundColor: DEFAULT_COLORS[0],
  },
  gauge: {
    label: "Dataset 1",
    data: [75, 25],
    backgroundColor: [
      DEFAULT_COLORS[0],
      `${DEFAULT_COLORS[0]}33`,
    ],
    borderWidth: 0,
  },
  radar: {
    label: "Dataset 1",
    data: [65, 59, 90, 81, 56, 55, 40],
    backgroundColor: `${DEFAULT_COLORS[0]}33`,
    borderColor: DEFAULT_COLORS[0],
    borderWidth: 2,
    fill: true,
  },
  heatmap: {
    label: "Dataset 1",
    data: [
      { x: 'Q1', y: 'Product A', v: 65 },
      { x: 'Q2', y: 'Product A', v: 59 },
      { x: 'Q3', y: 'Product A', v: 80 },
      { x: 'Q4', y: 'Product A', v: 81 },
    ] as HeatmapDataPoint[],
    backgroundColor: DEFAULT_COLORS[0],
  },
  treemap: {
    label: "Dataset 1",
    data: [300, 200, 150, 100, 50],
    backgroundColor: DEFAULT_COLORS,
    borderWidth: 1,
  },
  "semi-circle": {
    label: "Dataset 1",
    data: [300, 200],
    backgroundColor: [DEFAULT_COLORS[0], DEFAULT_COLORS[1]],
    borderWidth: 1,
  },
  funnel: {
    label: "Dataset 1",
    data: [100, 80, 60, 40, 20],
    backgroundColor: DEFAULT_COLORS,
    borderWidth: 0,
  },
  boxplot: {
    label: "Dataset 1",
    data: [
      { x: 1, y: 50 },
      { x: 2, y: 45 },
      { x: 3, y: 50 },
    ] as ChartDataPoint[],
    backgroundColor: DEFAULT_COLORS[0],
  },
  sankey: {
    label: "Dataset 1",
    data: [50, 40, 30, 20, 10],
    backgroundColor: DEFAULT_COLORS,
    borderWidth: 0,
  },
  waterfall: {
    label: "Dataset 1",
    data: [100, -20, 30, -10, 15],
    backgroundColor: DEFAULT_COLORS,
    borderWidth: 0,
  },
  table: {
    label: "Dataset 1",
    data: [],
    tableColumns: [
      { id: 'col1', header: 'Column 1', accessor: 'col1', align: 'left' },
      { id: 'col2', header: 'Column 2', accessor: 'col2', align: 'left' },
      { id: 'col3', header: 'Column 3', accessor: 'col3', align: 'left' },
      { id: 'col4', header: 'Column 4', accessor: 'col4', align: 'left' }
    ],
    tableRows: Array(10).fill(null).map((_, rowIndex) => ({
      col1: '',
      col2: '',
      col3: '',
      col4: ''
    }))
  },
  column: {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56],
    backgroundColor: DEFAULT_COLORS,
  },
  "stacked-bar": {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56],
    backgroundColor: DEFAULT_COLORS,
  },
  "stacked-column": {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56],
    backgroundColor: DEFAULT_COLORS,
  },
  "stacked-area": {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56, 55, 40],
    borderColor: DEFAULT_COLORS[0],
    backgroundColor: `${DEFAULT_COLORS[0]}33`,
    borderWidth: 2,
    fill: true,
  },
  combo: {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56],
    backgroundColor: DEFAULT_COLORS[0],
  },
  histogram: {
    label: "Dataset 1",
    data: [10, 20, 15, 25, 30, 18, 12],
    backgroundColor: DEFAULT_COLORS[0],
  },
  matrix: {
    label: "Dataset 1",
    data: [],
    tableColumns: [
      { id: 'row', header: 'Row', accessor: 'row', align: 'left' },
      { id: 'col1', header: 'Q1', accessor: 'col1', align: 'right' },
      { id: 'col2', header: 'Q2', accessor: 'col2', align: 'right' },
      { id: 'col3', header: 'Q3', accessor: 'col3', align: 'right' },
      { id: 'col4', header: 'Q4', accessor: 'col4', align: 'right' }
    ],
    tableRows: [
      { row: 'Sales', col1: '100K', col2: '120K', col3: '110K', col4: '130K' },
      { row: 'Marketing', col1: '50K', col2: '60K', col3: '55K', col4: '65K' },
      { row: 'Support', col1: '30K', col2: '35K', col3: '32K', col4: '38K' }
    ]
  },
  "multi-row-card": {
    label: "Dataset 1",
    data: [{ title: "Revenue", value: "$1.2M", change: "+12%" }],
    backgroundColor: DEFAULT_COLORS[0],
  },
  kpi: {
    label: "Dataset 1",
    data: [85, 15],
    backgroundColor: [DEFAULT_COLORS[0], `${DEFAULT_COLORS[0]}33`],
    borderWidth: 0,
  },
  slicer: {
    label: "Dataset 1",
    data: ["Option 1", "Option 2", "Option 3", "Option 4"],
    backgroundColor: DEFAULT_COLORS[0],
  },
  "decomposition-tree": {
    label: "Dataset 1",
    data: [
      { name: "Total Sales", value: 1000, children: [
        { name: "Product A", value: 400 },
        { name: "Product B", value: 300 },
        { name: "Product C", value: 200 },
        { name: "Product D", value: 100 }
      ]}
    ],
    backgroundColor: DEFAULT_COLORS,
  },
  map: {
    label: "Dataset 1",
    data: [
      { location: "USA", value: 300 },
      { location: "Canada", value: 200 },
      { location: "Mexico", value: 150 }
    ],
    backgroundColor: DEFAULT_COLORS[0],
  },
  "filled-map": {
    label: "Dataset 1",
    data: [
      { region: "North", value: 300 },
      { region: "South", value: 200 },
      { region: "East", value: 250 },
      { region: "West", value: 180 }
    ],
    backgroundColor: DEFAULT_COLORS,
  },
  card: {
    label: "Dataset 1",
    data: [{ title: "Total Sales", value: "$1,234,567" }],
    backgroundColor: DEFAULT_COLORS[0],
  },
  "word-cloud": {
    label: "Dataset 1",
    data: [
      { text: "Sales", size: 50 },
      { text: "Marketing", size: 40 },
      { text: "Revenue", size: 35 },
      { text: "Growth", size: 30 },
      { text: "Customer", size: 25 }
    ],
    backgroundColor: DEFAULT_COLORS,
  },
  timeline: {
    label: "Dataset 1",
    data: [
      { date: "2024-01-01", event: "Project Start" },
      { date: "2024-02-15", event: "Milestone 1" },
      { date: "2024-04-01", event: "Milestone 2" },
      { date: "2024-06-01", event: "Project End" }
    ],
    backgroundColor: DEFAULT_COLORS[0],
  },
  gantt: {
    label: "Dataset 1",
    data: [
      { task: "Task 1", start: "2024-01-01", end: "2024-01-15", progress: 100 },
      { task: "Task 2", start: "2024-01-10", end: "2024-01-25", progress: 75 },
      { task: "Task 3", start: "2024-01-20", end: "2024-02-05", progress: 50 }
    ],
    backgroundColor: DEFAULT_COLORS,
  }
};

export const DEFAULT_LABELS = {
  bar: ["January", "February", "March", "April", "May"],
  line: ["January", "February", "March", "April", "May", "June", "July"],
  pie: ["Red", "Blue", "Yellow", "Green", "Purple"],
  area: ["January", "February", "March", "April", "May", "June", "July"],
  scatter: ["A", "B", "C", "D", "E"],
  donut: ["Red", "Blue", "Yellow", "Green", "Purple"],
  bubble: ["A", "B", "C", "D", "E"],
  gauge: ["Progress"],
  radar: ["Strength", "Agility", "Intelligence", "Charisma", "Stamina", "Speed", "Luck"],
  heatmap: ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"],
  treemap: ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"],
  "semi-circle": ["Complete", "Incomplete"],
  funnel: ["Prospects", "Leads", "Opportunities", "Proposals", "Customers"],
  boxplot: ["Group 1", "Group 2", "Group 3"],
  sankey: ["Source 1", "Source 2", "Source 3", "Source 4", "Source 5"],
  waterfall: ["Start", "Increase", "Decrease", "Net", "End"],
  table: [],
  column: ["Q1", "Q2", "Q3", "Q4", "Q5"],
  "stacked-bar": ["Category A", "Category B", "Category C", "Category D", "Category E"],
  "stacked-column": ["Q1", "Q2", "Q3", "Q4", "Q5"],
  "stacked-area": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  combo: ["Q1", "Q2", "Q3", "Q4", "Q5"],
  histogram: ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60+"],
  matrix: [],
  "multi-row-card": [],
  kpi: ["Target"],
  slicer: [],
  "decomposition-tree": [],
  map: [],
  "filled-map": [],
  card: [],
  "word-cloud": [],
  timeline: [],
  gantt: []
};

export function getDefaultTitle(type: ChartType): string {
  switch (type) {
    case "bar":
      return "Bar Chart";
    case "line":
      return "Line Chart";
    case "pie":
      return "Pie Chart";
    case "area":
      return "Area Chart";
    case "scatter":
      return "Scatter Plot";
    case "donut":
      return "Donut Chart";
    case "text":
      return "Text Label";
    case "bubble":
      return "Bubble Chart";
    case "gauge":
      return "Gauge Chart";
    case "radar":
      return "Radar Chart";
    case "heatmap":
      return "Heatmap";
    case "treemap":
      return "Treemap";
    case "semi-circle":
      return "Semi Circle Chart";
    case "funnel":
      return "Funnel Chart";
    case "boxplot":
      return "Box Plot";
    case "sankey":
      return "Sankey Diagram";
    case "waterfall":
      return "Waterfall Chart";
    case "table":
      return "Data Table";
    case "column":
      return "Column Chart";
    case "stacked-bar":
      return "Stacked Bar Chart";
    case "stacked-column":
      return "Stacked Column Chart";
    case "stacked-area":
      return "Stacked Area Chart";
    case "combo":
      return "Combo Chart";
    case "histogram":
      return "Histogram";
    case "matrix":
      return "Matrix";
    case "multi-row-card":
      return "Multi-row Card";
    case "kpi":
      return "KPI Visual";
    case "slicer":
      return "Slicer";
    case "decomposition-tree":
      return "Decomposition Tree";
    case "map":
      return "Map";
    case "filled-map":
      return "Filled Map";
    case "card":
      return "Card";
    case "word-cloud":
      return "Word Cloud";
    case "timeline":
      return "Timeline";
    case "gantt":
      return "Gantt Chart";
    default:
      return "New Chart";
  }
}

export function getDefaultOptions(type: ChartType): Record<string, any> {
  const common = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type !== "text",
        position: 'bottom',
        labels: {
          padding: 10,
          usePointStyle: true,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: false,
      },
    },
    layout: {
      padding: {
        top: 5,
        bottom: 5,
        left: 10,
        right: 10
      }
    }
  };

  switch (type) {
    case "bar":
      return {
        ...common,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
      };
    case "line":
      return {
        ...common,
        tension: 0.4,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      };
    case "pie":
      return {
        ...common,
        plugins: {
          ...common.plugins,
          legend: {
            ...common.plugins.legend,
            position: 'right'
          }
        }
      };
    case "area":
      return {
        ...common,
        tension: 0.4,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      };
    case "scatter":
      return {
        ...common,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          y: {
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        },
      };
    case "donut":
      return {
        ...common,
        cutout: "60%",
        plugins: {
          ...common.plugins,
          legend: {
            ...common.plugins.legend,
            position: 'right'
          }
        }
      };
    case "bubble":
      return {
        ...common,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          y: {
            type: "linear",
            position: "left",
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
        },
      };
    case "gauge":
      return {
        ...common,
        circumference: 180,
        rotation: -90,
        cutout: "70%",
        plugins: {
          ...common.plugins,
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false
          }
        },
      };
    case "radar":
      return {
        ...common,
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      };
    case "heatmap":
      return {
        ...common,
        scales: {
          x: {
            type: "category",
            grid: {
              display: false
            }
          },
          y: {
            type: "category",
            grid: {
              display: false
            }
          },
        },
      };
    case "treemap":
      return {
        ...common,
        plugins: {
          ...common.plugins,
          legend: {
            display: false
          }
        }
      };
    case "semi-circle":
      return {
        ...common,
        circumference: 180,
        rotation: -90,
        plugins: {
          ...common.plugins,
          legend: {
            ...common.plugins.legend,
            position: 'bottom'
          }
        }
      };
    case "funnel":
      return {
        ...common,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      };
    case "boxplot":
      return {
        ...common,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
      };
    case "sankey":
      return {
        ...common,
        plugins: {
          ...common.plugins,
          legend: {
            display: false
          }
        }
      };
    case "waterfall":
      return {
        ...common,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      };
    case "table":
      return {
        ...common,
        plugins: {
          legend: {
            display: false,
          },
        },
      };
    case "text":
      return {
        ...common,
        plugins: {
          legend: {
            display: false,
          },
        },
      };
    case "column":
      return {
        ...common,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
      };
    case "stacked-bar":
      return {
        ...common,
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          y: {
            stacked: true,
            grid: {
              display: false
            }
          }
        }
      };
    case "stacked-column":
      return {
        ...common,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      };
    case "stacked-area":
      return {
        ...common,
        tension: 0.4,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      };
    case "combo":
      return {
        ...common,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      };
    case "histogram":
      return {
        ...common,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency'
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Value Range'
            },
            grid: {
              display: false
            }
          }
        }
      };
    case "matrix":
    case "multi-row-card":
    case "kpi":
    case "slicer":
    case "decomposition-tree":
    case "map":
    case "filled-map":
    case "card":
    case "word-cloud":
    case "timeline":
    case "gantt":
      return {
        ...common,
        plugins: {
          legend: {
            display: false,
          },
        },
      };
    default:
      return common;
  }
}
