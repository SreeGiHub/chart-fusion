
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
  table: []
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
    default:
      return common;
  }
}
