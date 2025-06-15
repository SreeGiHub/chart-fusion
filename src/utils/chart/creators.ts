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

  // Enhanced sample data for different chart types
  if (type === "stacked-bar" || type === "stacked-column") {
    title = "Sales Performance by Region";
    chartData = {
      labels: ["North", "South", "East", "West"],
      datasets: [
        {
          label: "Q1 Sales",
          data: [45000, 52000, 48000, 41000],
          backgroundColor: "#4F46E5",
        },
        {
          label: "Q2 Sales", 
          data: [48000, 58000, 52000, 44000],
          backgroundColor: "#8B5CF6",
        },
        {
          label: "Q3 Sales",
          data: [52000, 61000, 55000, 47000],
          backgroundColor: "#EC4899",
        }
      ]
    };
  } else if (type === "funnel") {
    title = "Sales Conversion Funnel";
    const labels = ["Leads", "Qualified", "Proposal", "Negotiation", "Closed"];
    const data = [1000, 750, 500, 300, 180];
    const colors = ["#4F46E5", "#6366F1", "#8B5CF6", "#A855F7", "#C084FC"];
    
    chartData = {
      labels,
      datasets: [{
        label: "Conversion Funnel",
        data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        labelColors: colors,
      }],
    };
    size = { width: 400, height: 350 };
  } else if (type === "multi-row-card") {
    title = "Business KPIs Dashboard";
    chartData = {
      labels: ["Revenue", "Customers", "Conversion Rate", "Growth"],
      datasets: [
        {
          label: "Current Values",
          data: [1250000, 8542, 12.5, 15.8],
          backgroundColor: "#4F46E5",
        },
        {
          label: "Change %",
          data: [8.7, -2.1, 3.2, 5.4],
          backgroundColor: "#10B981",
        }
      ],
    };
    size = { width: 350, height: 250 };
  } else if (type === "gauge") {
    title = "Performance Score";
    chartData = {
      labels: ["Performance"],
      datasets: [{
        label: "Score",
        data: [78, 22], // 78% performance, 22% remaining
        backgroundColor: ["#4F46E5", "#E5E7EB"],
        borderWidth: 0
      }],
    };
    size = { width: 300, height: 250 };
  } else if (type === "table") {
    title = "Sales Data Table";
    chartData = {
      labels: [],
      datasets: [],
      tableColumns: [
        { id: "product", header: "Product", accessor: "product", align: "left" },
        { id: "region", header: "Region", accessor: "region", align: "left" },
        { id: "sales", header: "Sales", accessor: "sales", align: "right" },
        { id: "growth", header: "Growth %", accessor: "growth", align: "right" }
      ],
      tableRows: [
        { product: "iPhone 15", region: "North", sales: "$125,000", growth: "+8.5%" },
        { product: "MacBook Pro", region: "South", sales: "$89,000", growth: "+12.3%" },
        { product: "iPad Air", region: "East", sales: "$67,000", growth: "+5.7%" },
        { product: "Apple Watch", region: "West", sales: "$45,000", growth: "+15.2%" },
        { product: "AirPods Pro", region: "North", sales: "$38,000", growth: "+9.8%" }
      ]
    };
    size = { width: 600, height: 350 };
  } else if (type === "card") {
    title = "Total Revenue";
    chartData = {
      labels: ["Revenue"],
      datasets: [{
        label: "Total Revenue",
        data: [1297280],
        backgroundColor: "#4F46E5"
      }]
    };
    size = { width: 300, height: 200 };
  } else if (type === "pie" || type === "donut") {
    title = "Market Share by Region";
    const labels = ["North", "South", "East", "West"];
    const data = [35, 28, 22, 15];
    const colors = ["#4F46E5", "#8B5CF6", "#EC4899", "#F97316"];
    
    chartData = {
      labels,
      datasets: [{
        label: "Market Share",
        data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2,
        labelColors: colors,
      }],
    };
  } else if (type === "bar" || type === "column") {
    title = "Revenue by Product Category";
    chartData = {
      labels: ["Electronics", "Clothing", "Books", "Home & Garden", "Sports"],
      datasets: [{
        label: "Revenue ($K)",
        data: [285, 259, 180, 210, 156],
        backgroundColor: "#4F46E5",
        borderColor: "#4F46E5",
        borderWidth: 1,
      }],
    };
  } else if (type === "line") {
    title = "Monthly Sales Trend";
    chartData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Sales ($K)",
        data: [65, 75, 80, 85, 92, 98],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        borderWidth: 2,
        fill: false,
      }],
    };
  } else if (type === "area") {
    title = "Website Traffic Growth";
    chartData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
      datasets: [{
        label: "Visitors",
        data: [1200, 1890, 2300, 2800, 3200],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderWidth: 2,
        fill: true,
      }],
    };
  } else if (type === "scatter") {
    title = "Sales vs Customer Rating";
    chartData = {
      labels: [],
      datasets: [{
        label: "Performance Data",
        data: [
          { x: 85, y: 120000 },
          { x: 78, y: 98000 },
          { x: 92, y: 145000 },
          { x: 88, y: 132000 },
          { x: 75, y: 89000 },
          { x: 95, y: 167000 }
        ],
        backgroundColor: "#4F46E5"
      }]
    };
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
              labelColors: DEFAULT_COLORS,
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
