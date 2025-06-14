
import { useDashboard } from "@/context/DashboardContext";
import { ChartType } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { toast } from "sonner";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Activity, 
  Type, 
  MessageSquareText,
  Sparkles,
  BarChart3,
  TrendingUp,
  Layers,
  Target,
  Hash,
  ScatterChart,
  Gauge,
  LayoutGrid,
  CircleDot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChartCategoriesDropdownProps {
  onTextToChartOpen: () => void;
}

const ChartCategoriesDropdown: React.FC<ChartCategoriesDropdownProps> = ({ onTextToChartOpen }) => {
  const { dispatch } = useDashboard();

  const handleAddItem = (type: ChartType) => {
    const canvasElement = document.getElementById("dashboard-canvas");
    if (!canvasElement) return;

    const canvasRect = canvasElement.getBoundingClientRect();
    const centerX = canvasRect.width / 2 - 200;
    const centerY = canvasRect.height / 2 - 150;

    const newItem = createNewChartItem(type, {
      x: Math.max(0, centerX),
      y: Math.max(0, centerY),
    });

    dispatch({ type: "ADD_ITEM", payload: newItem });
    toast.success(`Added new ${type} chart`);
  };

  const chartCategories = [
    {
      title: "Bar & Column Charts",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      titleColor: "text-orange-600",
      count: "4 charts",
      charts: [
        { type: "bar", icon: BarChart, label: "Bar Chart" },
        { type: "column", icon: BarChart3, label: "Column Chart" },
        { type: "stacked-bar", icon: BarChart, label: "Stacked Bar" },
        { type: "histogram", icon: BarChart, label: "Histogram" },
      ]
    },
    {
      title: "Line & Area Charts", 
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      titleColor: "text-blue-600",
      count: "4 charts",
      charts: [
        { type: "line", icon: LineChart, label: "Line Chart" },
        { type: "area", icon: Activity, label: "Area Chart" },
        { type: "stacked-area", icon: Layers, label: "Stacked Area" },
        { type: "combo", icon: TrendingUp, label: "Combo Chart" },
      ]
    },
    {
      title: "Pie & Distribution",
      bgColor: "bg-purple-50", 
      borderColor: "border-purple-200",
      titleColor: "text-purple-600",
      count: "5 charts",
      charts: [
        { type: "pie", icon: PieChart, label: "Pie Chart" },
        { type: "donut", icon: CircleDot, label: "Donut Chart" },
        { type: "scatter", icon: ScatterChart, label: "Scatter Plot" },
        { type: "bubble", icon: CircleDot, label: "Bubble Chart" },
        { type: "boxplot", icon: Activity, label: "Box Plot" },
      ]
    },
    {
      title: "Cards & Others",
      bgColor: "bg-green-50",
      borderColor: "border-green-200", 
      titleColor: "text-green-600",
      count: "8 charts",
      charts: [
        { type: "card", icon: Hash, label: "Card" },
        { type: "multi-row-card", icon: Hash, label: "Multi-row Card" },
        { type: "gauge", icon: Gauge, label: "Gauge" },
        { type: "table", icon: LayoutGrid, label: "Table" },
        { type: "radar", icon: Target, label: "Radar Chart" },
        { type: "treemap", icon: LayoutGrid, label: "Treemap" },
        { type: "funnel", icon: Activity, label: "Funnel Chart" },
        { type: "text", icon: Type, label: "Text Label" },
      ]
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="hidden sm:inline-block mr-2">Add Chart</span>
          <span className="sm:hidden">+</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[800px] p-6" align="start">
        <DropdownMenuLabel className="text-xl font-bold mb-6 text-center">Choose Chart Type</DropdownMenuLabel>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          {chartCategories.map((category) => (
            <div 
              key={category.title}
              className={`${category.bgColor} ${category.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${category.titleColor}`}>
                  {category.title}
                </h3>
                <span className={`text-sm ${category.titleColor} opacity-75`}>
                  {category.count}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {category.charts.map((chart) => (
                  <button
                    key={chart.type}
                    onClick={() => handleAddItem(chart.type as ChartType)}
                    className="flex items-center gap-2 p-3 text-sm bg-white/70 hover:bg-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <chart.icon className="h-4 w-4" />
                    <span className="font-medium">{chart.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={onTextToChartOpen}
            className="w-full flex items-center justify-center gap-2 p-3 text-sm hover:bg-accent rounded-md transition-colors bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-200"
          >
            <MessageSquareText className="h-4 w-4" />
            <span className="font-medium">🪄 AI Text to Chart Generator</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChartCategoriesDropdown;
