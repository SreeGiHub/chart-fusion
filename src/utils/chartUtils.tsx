import { ChartItemType, ChartType, Position, Size, ChartData } from "@/types";

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const exportToJSON = (data: any): string => {
  return JSON.stringify(data, null, 2);
};

export const exportToPNG = async (canvasRef: React.RefObject<HTMLDivElement>) => {
  if (!canvasRef.current) return;

  const canvas = canvasRef.current;
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "dashboard.png";
  link.click();
};

export const exportToPDF = async (canvasRef: React.RefObject<HTMLDivElement>) => {
  if (!canvasRef.current) return;

  const { jsPDF } = await import("jspdf");
  const canvas = canvasRef.current;
  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdf = new jsPDF({
    orientation: "landscape",
  });
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
  pdf.save("dashboard.pdf");
};

export const createNewChartItem = (type: ChartType, position: Position): ChartItemType => {
  const id = `chart-${Date.now()}`;
  let title = "";
  let data: ChartData;
  let size: Size = { width: 400, height: 300 };

  switch (type) {
    case "bar":
      title = "Bar Chart";
      data = {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "Sales",
            data: [65, 59, 80, 81, 56],
            backgroundColor: ["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"],
          },
        ],
      };
      break;
    case "line":
      title = "Line Chart";
      data = {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "Temperature",
            data: [20, 22, 25, 23, 24],
            borderColor: "#4f46e5",
            backgroundColor: "#4f46e533",
            borderWidth: 2,
            fill: true,
          },
        ],
      };
      break;
    case "pie":
      title = "Pie Chart";
      data = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
        datasets: [
          {
            label: "Votes",
            data: [12, 19, 3, 5, 2],
            backgroundColor: ["#ef4444", "#3b82f6", "#f59e0b", "#16a34a", "#8b5cf6"],
          },
        ],
      };
      break;
    case "area":
      title = "Area Chart";
      data = {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "Revenue",
            data: [100, 120, 150, 130, 140],
            borderColor: "#4f46e5",
            backgroundColor: "#4f46e533",
            borderWidth: 2,
            fill: true,
          },
        ],
      };
      break;
    case "scatter":
      title = "Scatter Plot";
      data = {
        labels: ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
        datasets: [
          {
            label: "Data Points",
            data: [
              { x: 10, y: 20 },
              { x: 15, y: 25 },
              { x: 8, y: 15 },
              { x: 12, y: 22 },
              { x: 6, y: 18 },
            ],
            backgroundColor: "#4f46e5",
          },
        ],
      };
      break;
    case "donut":
      title = "Donut Chart";
      data = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
        datasets: [
          {
            label: "Votes",
            data: [12, 19, 3, 5, 2],
            backgroundColor: ["#ef4444", "#3b82f6", "#f59e0b", "#16a34a", "#8b5cf6"],
          },
        ],
      };
      break;
    case "text":
      title = "Text Label";
      data = {
        labels: [],
        datasets: [
          {
            label: "Enter your text here",
            data: [],
          },
        ],
      };
      size = { width: 200, height: 100 };
      break;
    case "card":
      title = "Card";
      data = {
        labels: [],
        datasets: [
          {
            label: "100",
            data: [],
          },
        ],
      };
      size = { width: 200, height: 150 };
      break;
    case "bubble":
      title = "Bubble Chart";
      data = {
        labels: ["Bubble 1", "Bubble 2", "Bubble 3"],
        datasets: [
          {
            label: "Data",
            data: [
              { x: 10, y: 20, r: 30 },
              { x: 15, y: 25, r: 20 },
              { x: 8, y: 15, r: 40 },
            ],
            backgroundColor: ["#4f46e5", "#3b82f6", "#0ea5e9"],
          },
        ],
      };
      break;
    case "gauge":
      title = "Gauge Chart";
      data = {
        labels: [],
        datasets: [
          {
            label: "Value",
            data: [75],
            backgroundColor: ["#4f46e5"],
          },
        ],
      };
      break;
    case "semi-circle":
      title = "Semi Circle Chart";
      data = {
        labels: ["Data 1", "Data 2"],
        datasets: [
          {
            label: "Values",
            data: [60, 40],
            backgroundColor: ["#4f46e5", "#3b82f6"],
          },
        ],
      };
      break;
    case "radar":
      title = "Radar Chart";
      data = {
        labels: ["A", "B", "C", "D", "E"],
        datasets: [
          {
            label: "Data",
            data: [70, 50, 90, 60, 80],
            backgroundColor: "#4f46e533",
            borderColor: "#4f46e5",
          },
        ],
      };
      break;
    case "heatmap":
      title = "Heatmap";
      data = {
        labels: ["A", "B", "C", "D", "E"],
        datasets: [
          {
            label: "Data",
            data: [10, 20, 30, 40, 50],
            backgroundColor: ["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"],
          },
        ],
      };
      break;
    case "treemap":
      title = "Treemap";
      data = {
        labels: ["A", "B", "C", "D", "E"],
        datasets: [
          {
            label: "Data",
            data: [10, 20, 30, 40, 50],
            backgroundColor: ["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"],
          },
        ],
      };
      break;
    case "funnel":
      title = "Funnel Chart";
      data = {
        labels: ["Step 1", "Step 2", "Step 3", "Step 4"],
        datasets: [
          {
            label: "Values",
            data: [100, 75, 50, 25],
            backgroundColor: ["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4"],
          },
        ],
      };
      break;
    case "sankey":
      title = "Sankey Chart";
      data = {
        labels: ["A", "B", "C", "D"],
        datasets: [
          {
            label: "Data",
            data: [10, 20, 30, 40],
            backgroundColor: ["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4"],
          },
        ],
      };
      break;
    case "boxplot":
      title = "Box Plot";
      data = {
        labels: ["Category 1", "Category 2"],
        datasets: [
          {
            label: "Values",
            data: [
              { x: 0, y: [10, 20, 30, 40, 50] },
              { x: 1, y: [15, 25, 35, 45, 55] },
            ],
            backgroundColor: ["#4f46e5", "#3b82f6"],
          },
        ],
      };
      break;
    case "table":
      title = "Data Table";
      data = {
        labels: [],
        datasets: [
          {
            label: "Table Data",
            data: [],
            backgroundColor: "#4f46e5",
          },
        ],
        tableColumns: [
          { id: 'name', header: 'Name', accessor: 'name', align: 'left' },
          { id: 'value', header: 'Value', accessor: 'value', align: 'right' },
          { id: 'category', header: 'Category', accessor: 'category', align: 'center' }
        ],
        tableRows: [
          { name: 'Product A', value: 120, category: 'Electronics' },
          { name: 'Product B', value: 85, category: 'Home' },
          { name: 'Product C', value: 340, category: 'Electronics' },
          { name: 'Product D', value: 261, category: 'Clothing' }
        ]
      };
      size = { width: 500, height: 300 };
      break;
    default:
      title = "Unknown Chart";
      data = {
        labels: [],
        datasets: [
          {
            label: "No Data",
            data: [],
          },
        ],
      };
      break;
  }

  return {
    id,
    type,
    position,
    size,
    title,
    data,
  };
};

export const createGenderComparisonChart = (position: Position): ChartItemType => {
  const id = `chart-${Date.now()}`;
  const title = "Gender Comparison";
  const type = "bar";
  const size: Size = { width: 400, height: 300 };
  const data: ChartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Number of People",
        data: [50, 50],
        backgroundColor: ["#3b82f6", "#f472b6"],
      },
    ],
  };

  return {
    id,
    type,
    position,
    size,
    title,
    data,
  };
};
