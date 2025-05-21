import { ChartData, ChartDataPoint, ChartItemType, ChartType, Position, Size } from "../types";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_CHART_SIZE: Size = {
  width: 400,
  height: 300,
};

export const DEFAULT_COLORS = [
  "#4F46E5", // blue
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#F97316", // orange
  "#0D9488", // teal
];

const DEFAULT_DATASETS = {
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
    data: [75],
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
    data: [15, 29, 40, 51, 66, 75, 20, 35, 45, 55, 65, 75, 30, 45, 55, 65],
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

const DEFAULT_LABELS = {
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
  table: []
};

export function createNewChartItem(
  type: ChartType,
  position: Position
): ChartItemType {
  let chartData: ChartData = {
    labels: DEFAULT_LABELS[type as keyof typeof DEFAULT_LABELS] || [],
    datasets: [DEFAULT_DATASETS[type as keyof typeof DEFAULT_DATASETS] || {
      label: "",
      data: [],
    }],
  };

  let size = DEFAULT_CHART_SIZE;
  let title = getDefaultTitle(type);

  if (type === "text") {
    chartData = {
      labels: [],
      datasets: [{
        label: "",
        data: [],
      }],
    };
  } else if (type === "table") {
    title = "Data Table";
    chartData = {
      labels: [],
      datasets: [],
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
    };
    size = { width: 600, height: 400 };
  }

  return {
    id: uuidv4(),
    type,
    position,
    size,
    title,
    data: chartData,
    options: getDefaultOptions(type),
  };
}

export function createGenderComparisonChart(position: Position): ChartItemType {
  return {
    id: uuidv4(),
    type: "bar",
    position,
    size: DEFAULT_CHART_SIZE,
    title: "Gender Comparison Chart",
    data: {
      labels: ["Mathematics", "Science", "Language", "History", "Sports"],
      datasets: [
        {
          label: "Girls",
          data: [78, 82, 85, 76, 70],
          backgroundColor: "#8B5CF6", // Purple for girls
        },
        {
          label: "Boys",
          data: [72, 70, 65, 68, 80],
          backgroundColor: "#4F46E5", // Blue for boys
        }
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Score'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Subjects'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Performance Comparison by Gender'
        }
      }
    }
  };
}

export function createTextToChartItem(chartType: string, description: string): ChartItemType {
  const position: Position = {
    x: 100,
    y: 100,
  };

  switch (chartType) {
    case "gender comparison":
      return {
        ...createGenderComparisonChart(position),
        title: description.length > 30 ? `${description.substring(0, 30)}...` : description,
      };
    
    case "sales overview":
      return {
        id: uuidv4(),
        type: "line",
        position,
        size: DEFAULT_CHART_SIZE,
        title: description.length > 30 ? `${description.substring(0, 30)}...` : description,
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "2022",
              data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
              borderColor: "#4F46E5",
              backgroundColor: `${DEFAULT_COLORS[0]}33`,
              borderWidth: 2,
              fill: true,
            },
            {
              label: "2023",
              data: [70, 65, 85, 89, 60, 65, 48, 50, 70, 80, 90, 95],
              borderColor: "#EC4899",
              backgroundColor: `${DEFAULT_COLORS[2]}33`,
              borderWidth: 2,
              fill: true,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Revenue ($K)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Annual Sales Overview'
            }
          }
        }
      };
    
    case "age distribution":
      return {
        id: uuidv4(),
        type: "bar",
        position,
        size: DEFAULT_CHART_SIZE,
        title: description.length > 30 ? `${description.substring(0, 30)}...` : description,
        data: {
          labels: ["0-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
          datasets: [
            {
              label: "Age Distribution",
              data: [15, 23, 28, 22, 19, 12, 8],
              backgroundColor: DEFAULT_COLORS,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Percentage (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Age Group'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Population Age Distribution'
            }
          }
        }
      };
    
    case "temperature trend":
      return {
        id: uuidv4(),
        type: "area",
        position,
        size: DEFAULT_CHART_SIZE,
        title: description.length > 30 ? `${description.substring(0, 30)}...` : description,
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Temperature (°C)",
              data: [22, 24, 27, 23, 20, 18, 21],
              borderColor: "#F97316",
              backgroundColor: `${DEFAULT_COLORS[3]}33`,
              borderWidth: 2,
              fill: true,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Temperature (°C)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Day'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Weekly Temperature Trends'
            }
          }
        }
      };
    
    case "market share":
      return {
        id: uuidv4(),
        type: "pie",
        position,
        size: DEFAULT_CHART_SIZE,
        title: description.length > 30 ? `${description.substring(0, 30)}...` : description,
        data: {
          labels: ["Product A", "Product B", "Product C", "Product D", "Others"],
          datasets: [
            {
              label: "Market Share",
              data: [35, 25, 20, 15, 5],
              backgroundColor: DEFAULT_COLORS,
              borderWidth: 1,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'right',
            },
            title: {
              display: true,
              text: 'Market Share Distribution'
            }
          }
        }
      };
    
    default:
      return {
        id: uuidv4(),
        type: "bar",
        position,
        size: DEFAULT_CHART_SIZE,
        title: description.length > 30 ? `${description.substring(0, 30)}...` : description,
        data: {
          labels: ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"],
          datasets: [
            {
              label: "Values",
              data: [65, 59, 80, 81, 56],
              backgroundColor: DEFAULT_COLORS,
            }
          ],
        },
        options: getDefaultOptions("bar")
      };
  }
}

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
      },
      title: {
        display: false,
      },
    },
  };

  switch (type) {
    case "bar":
      return {
        ...common,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    case "line":
      return {
        ...common,
        tension: 0.3,
      };
    case "pie":
      return {
        ...common,
      };
    case "area":
      return {
        ...common,
        tension: 0.3,
      };
    case "scatter":
      return {
        ...common,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
          },
        },
      };
    case "donut":
      return {
        ...common,
        cutout: "70%",
      };
    case "bubble":
      return {
        ...common,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
          },
          y: {
            type: "linear",
            position: "left",
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
        },
      };
    case "radar":
      return {
        ...common,
      };
    case "heatmap":
      return {
        ...common,
        scales: {
          x: {
            type: "category",
          },
          y: {
            type: "category", 
          },
        },
      };
    case "treemap":
      return {
        ...common,
      };
    case "semi-circle":
      return {
        ...common,
        circumference: 180,
        rotation: -90,
      };
    case "funnel":
      return {
        ...common,
        indexAxis: 'y',
      };
    case "boxplot":
      return {
        ...common,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    case "sankey":
      return {
        ...common,
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

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function exportToJSON(state: any): string {
  return JSON.stringify({
    title: state.title,
    items: state.items,
  });
}

export function exportToPNG(canvasRef: React.RefObject<HTMLDivElement>): void {
  if (!canvasRef.current) return;

  import("html-to-image").then((htmlToImage) => {
    htmlToImage
      .toPng(canvasRef.current!, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${document.title || "dashboard"}.png`;
        link.href = dataUrl;
        link.click();
      });
  });
}

export async function exportToPDF(canvasRef: React.RefObject<HTMLDivElement>): Promise<void> {
  if (!canvasRef.current) return;

  try {
    const [htmlToImage, jsPDF] = await Promise.all([
      import("html-to-image"),
      import("jspdf"),
    ]);

    const canvas = canvasRef.current;
    const dataUrl = await htmlToImage.toPng(canvas, { quality: 0.95 });

    const pdf = new jsPDF.default({
      orientation: "landscape",
      unit: "px",
    });
    
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${document.title || "dashboard"}.pdf`);
  } catch (error) {
    console.error("Failed to export to PDF:", error);
  }
}

export function getRandomData(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 100));
}

export function generateExampleData(type: ChartType): ChartData {
  switch (type) {
    case "bar":
    case "line":
    case "area":
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Dataset 1",
            data: getRandomData(6),
            backgroundColor: DEFAULT_COLORS[0],
            borderColor: DEFAULT_COLORS[0],
          },
        ],
      };
    case "pie":
    case "donut":
      return {
        labels: ["Category 1", "Category 2", "Category 3", "Category 4"],
        datasets: [
          {
            label: "Dataset 1",
            data: getRandomData(4),
            backgroundColor: DEFAULT_COLORS.slice(0, 4),
          },
        ],
      };
    case "scatter":
      return {
        labels: ["Group A", "Group B", "Group C"],
        datasets: [
          {
            label: "Dataset 1",
            data: [
              { x: 10, y: 20 },
              { x: 30, y: 40 },
              { x: 50, y: 60 },
            ] as ChartDataPoint[],
            backgroundColor: DEFAULT_COLORS[0],
          },
        ],
      };
    default:
      return {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
          },
        ],
      };
  }
}