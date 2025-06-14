import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "@/context/DashboardContext";
import { 
  ChevronDown, 
  Plus, 
  BarChart3, 
  LineChart, 
  PieChart, 
  AreaChart,
  ChartScatter,
  Target,
  Table,
  FileText,
  Activity,
  Layers,
  TrendingUp
} from "lucide-react";
import { ChartData } from "@/types";
import { useState } from "react";

interface ChartCategoriesDropdownProps {
  onTextToChartOpen: () => void;
}

const ChartCategoriesDropdown: React.FC<ChartCategoriesDropdownProps> = ({ onTextToChartOpen }) => {
  const { dispatch } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);

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
    
    // Keep dropdown open briefly to show the action, then close
    setTimeout(() => setIsOpen(false), 200);
  };

  const chartCategories = [
    {
      name: "Column & Bar",
      color: "bg-orange-100 border-orange-200",
      textColor: "text-orange-600",
      charts: [
        { type: "bar", label: "Bar Chart", icon: BarChart3 },
        { type: "column", label: "Column Chart", icon: BarChart3 },
        { type: "stacked-bar", label: "Stacked Bar", icon: Layers },
        { type: "histogram", label: "Stacked Column", icon: Layers },
      ]
    },
    {
      name: "Line & Area",
      color: "bg-blue-100 border-blue-200",
      textColor: "text-blue-600",
      charts: [
        { type: "line", label: "Line Chart", icon: LineChart },
        { type: "area", label: "Area Chart", icon: AreaChart },
        { type: "stacked-area", label: "Stacked Area", icon: TrendingUp },
        { type: "combo", label: "Combo Chart", icon: Activity },
      ]
    },
    {
      name: "Pie & Donut",
      color: "bg-purple-100 border-purple-200",
      textColor: "text-purple-600",
      charts: [
        { type: "pie", label: "Pie Chart", icon: PieChart },
        { type: "donut", label: "Donut Chart", icon: Target },
        { type: "treemap", label: "Treemap", icon: Layers },
        { type: "funnel", label: "Funnel Chart", icon: TrendingUp },
      ]
    },
    {
      name: "Scatter & Bubble",
      color: "bg-green-100 border-green-200",
      textColor: "text-green-600",
      charts: [
        { type: "scatter", label: "Scatter Plot", icon: ChartScatter },
        { type: "bubble", label: "Bubble Chart", icon: ChartScatter },
        { type: "radar", label: "Radar Chart", icon: Target },
        { type: "gauge", label: "Gauge", icon: Target },
      ]
    },
    {
      name: "Data & KPI",
      color: "bg-pink-100 border-pink-200",
      textColor: "text-pink-600",
      charts: [
        { type: "table", label: "Table", icon: Table },
        { type: "card", label: "Card", icon: FileText },
        { type: "multi-row-card", label: "Multi-row Card", icon: Layers },
        { type: "card", label: "KPI Visual", icon: Target },
      ]
    }
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-50 transition-colors">
          <Plus className="h-4 w-4" />
          Add Chart
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[700px] p-6" align="start">
        <div className="grid grid-cols-2 gap-4">
          {chartCategories.map((category) => (
            <div
              key={category.name}
              className={`rounded-xl border-2 p-5 ${category.color} hover:shadow-md transition-shadow`}
            >
              <h3 className={`font-semibold text-lg mb-4 ${category.textColor}`}>
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.charts.map((chart) => (
                  <button
                    key={chart.type}
                    onClick={() => addChart(chart.type)}
                    className="w-full text-left text-sm px-4 py-3 rounded-lg hover:bg-white/70 active:bg-white/90 transition-all duration-150 text-gray-700 hover:text-gray-900 flex items-center gap-3 hover:shadow-sm"
                  >
                    <chart.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{chart.label}</span>
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
