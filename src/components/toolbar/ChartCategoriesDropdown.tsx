
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "@/context/DashboardContext";
import { ChevronDown, Plus } from "lucide-react";
import { ChartData } from "@/types";

interface ChartCategoriesDropdownProps {
  onTextToChartOpen: () => void;
}

const ChartCategoriesDropdown: React.FC<ChartCategoriesDropdownProps> = ({ onTextToChartOpen }) => {
  const { dispatch } = useDashboard();

  const addChart = (type: string) => {
    let chartData: ChartData;

    if (type === "table") {
      chartData = {
        labels: [],
        datasets: [],
        tableColumns: [
          { id: "col1", header: "Column 1", accessor: "col1", align: "left" },
          { id: "col2", header: "Column 2", accessor: "col2", align: "left" },
          { id: "col3", header: "Column 3", accessor: "col3", align: "left" },
        ],
        tableRows: [
          { col1: "Row 1 Col 1", col2: "Row 1 Col 2", col3: "Row 1 Col 3" },
          { col1: "Row 2 Col 1", col2: "Row 2 Col 2", col3: "Row 2 Col 3" },
          { col1: "Row 3 Col 1", col2: "Row 3 Col 2", col3: "Row 3 Col 3" },
          { col1: "Row 4 Col 1", col2: "Row 4 Col 2", col3: "Row 4 Col 3" },
          { col1: "Row 5 Col 1", col2: "Row 5 Col 2", col3: "Row 5 Col 3" },
        ],
      };
    } else {
      chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: "Dataset 1",
            data: [65, 59, 80, 81, 56],
            backgroundColor: "#8884d8",
            borderColor: "#8884d8",
            borderWidth: 2,
          },
        ],
      };
    }

    const newItem = {
      id: `chart-${Date.now()}`,
      type: type as any,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      data: chartData,
    };

    dispatch({ type: "ADD_ITEM", payload: newItem });
  };

  const chartCategories = [
    {
      name: "Bar & Column",
      color: "bg-blue-100 border-blue-200 hover:bg-blue-150",
      charts: [
        { type: "bar", label: "Bar Chart" },
        { type: "column", label: "Column Chart" },
        { type: "stacked-bar", label: "Stacked Bar" },
        { type: "histogram", label: "Histogram" },
      ],
    },
    {
      name: "Line & Area",
      color: "bg-green-100 border-green-200 hover:bg-green-150",
      charts: [
        { type: "line", label: "Line Chart" },
        { type: "area", label: "Area Chart" },
        { type: "stacked-area", label: "Stacked Area" },
      ],
    },
    {
      name: "Pie & Distribution",
      color: "bg-purple-100 border-purple-200 hover:bg-purple-150",
      charts: [
        { type: "pie", label: "Pie Chart" },
        { type: "donut", label: "Donut Chart" },
        { type: "scatter", label: "Scatter Plot" },
        { type: "bubble", label: "Bubble Chart" },
      ],
    },
    {
      name: "Cards & Others",
      color: "bg-orange-100 border-orange-200 hover:bg-orange-150",
      charts: [
        { type: "card", label: "Card" },
        { type: "multi-row-card", label: "Multi-row Card" },
        { type: "radar", label: "Radar Chart" },
        { type: "treemap", label: "Treemap" },
        { type: "funnel", label: "Funnel Chart" },
        { type: "gauge", label: "Gauge" },
        { type: "semi-circle", label: "Semi-circle" },
        { type: "combo", label: "Combo Chart" },
        { type: "text", label: "Text" },
        { type: "table", label: "Table" },
      ],
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Chart
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4" align="start">
        <div className="grid grid-cols-2 gap-3">
          {chartCategories.map((category) => (
            <div
              key={category.name}
              className={`border rounded-lg p-3 ${category.color} transition-colors`}
            >
              <h3 className="font-medium text-sm mb-2 text-gray-700">
                {category.name}
              </h3>
              <div className="space-y-1">
                {category.charts.map((chart) => (
                  <button
                    key={chart.type}
                    onClick={() => addChart(chart.type)}
                    className="w-full text-left text-xs px-2 py-1 rounded hover:bg-white/50 transition-colors text-gray-600 hover:text-gray-800"
                  >
                    {chart.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChartCategoriesDropdown;
