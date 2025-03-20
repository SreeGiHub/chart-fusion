import { ChartData, ChartItemType, ChartType, Position, Size } from "../types";
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
    ],
    backgroundColor: DEFAULT_COLORS[0],
  },
  donut: {
    label: "Dataset 1",
    data: [300, 200, 150, 100, 50],
    backgroundColor: DEFAULT_COLORS,
    borderWidth: 1,
  },
};

const DEFAULT_LABELS = {
  bar: ["January", "February", "March", "April", "May"],
  line: ["January", "February", "March", "April", "May", "June", "July"],
  pie: ["Red", "Blue", "Yellow", "Green", "Purple"],
  area: ["January", "February", "March", "April", "May", "June", "July"],
  scatter: ["A", "B", "C", "D", "E"],
  donut: ["Red", "Blue", "Yellow", "Green", "Purple"],
};

export function createNewChartItem(
  type: ChartType,
  position: Position
): ChartItemType {
  let chartData: ChartData = {
    labels: DEFAULT_LABELS[type as keyof typeof DEFAULT_LABELS] || [],
    datasets: [DEFAULT_DATASETS[type as keyof typeof DEFAULT_DATASETS] || {}],
  };

  if (type === "text") {
    chartData = {
      labels: [],
      datasets: [{
        label: "",
        data: [],
      }],
    };
  }

  return {
    id: uuidv4(),
    type,
    position,
    size: DEFAULT_CHART_SIZE,
    title: getDefaultTitle(type),
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

// New function to handle text-to-chart conversion
export function createTextToChartItem(chartType: string, description: string): ChartItemType {
  const position: Position = {
    x: 100,
    y: 100,
  };

  // Pre-defined chart templates based on the identification
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
      // Generic bar chart
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

// Fix TypeScript error with scatter data type
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
      // Fix the scatter data format
      return {
        labels: ["Group A", "Group B", "Group C"],
        datasets: [
          {
            label: "Dataset 1",
            data: [
              { x: 10, y: 20 },
              { x: 30, y: 40 },
              { x: 50, y: 60 },
            ],
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
