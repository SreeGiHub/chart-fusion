
import { ChartData, ChartDataPoint, ChartItemType, ChartType, Position } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_CHART_SIZE, DEFAULT_COLORS } from "./types";
import { DEFAULT_DATASETS, DEFAULT_LABELS, getDefaultTitle, getDefaultOptions } from "./defaults";

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
