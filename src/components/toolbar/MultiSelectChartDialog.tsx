
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboard } from "@/context/DashboardContext";
import { ChartData, ChartType } from "@/types";
import { 
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

interface MultiSelectChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const iconMap = {
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
};

const MultiSelectChartDialog: React.FC<MultiSelectChartDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { state, dispatch } = useDashboard();
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  const getNextPosition = (index: number) => {
    const existingItems = state.items;
    const baseIndex = existingItems.length + index;
    
    const gridSize = 450;
    const row = Math.floor(baseIndex / 3);
    const col = baseIndex % 3;
    
    return {
      x: 50 + (col * gridSize),
      y: 50 + (row * 350)
    };
  };

  const createChartData = (type: ChartType): ChartData => {
    if (type === "table") {
      return {
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
        ],
      };
    }
    
    return {
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
  };

  const handleChartToggle = (chartType: string) => {
    setSelectedCharts(prev => 
      prev.includes(chartType)
        ? prev.filter(type => type !== chartType)
        : [...prev, chartType]
    );
  };

  const handleCreateCharts = () => {
    selectedCharts.forEach((chartType, index) => {
      const position = getNextPosition(index);
      const chartData = createChartData(chartType as ChartType);

      const newItem = {
        id: `chart-${Date.now()}-${index}`,
        type: chartType as ChartType,
        title: `New ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        position: position,
        size: { width: 400, height: 300 },
        data: chartData,
      };

      dispatch({ type: "ADD_ITEM", payload: newItem });
    });

    onOpenChange(false);
    setSelectedCharts([]);
  };

  const handleCancel = () => {
    setSelectedCharts([]);
    onOpenChange(false);
  };

  const chartCategories = [
    {
      name: "Column & Bar",
      color: "bg-orange-100 border-orange-200",
      textColor: "text-orange-600",
      charts: [
        { type: "bar", label: "Bar Chart", icon: "BarChart3" },
        { type: "column", label: "Column Chart", icon: "BarChart3" },
        { type: "stacked-bar", label: "Stacked Bar", icon: "Layers" },
        { type: "histogram", label: "Stacked Column", icon: "Layers" },
      ]
    },
    {
      name: "Line & Area",
      color: "bg-blue-100 border-blue-200",
      textColor: "text-blue-600",
      charts: [
        { type: "line", label: "Line Chart", icon: "LineChart" },
        { type: "area", label: "Area Chart", icon: "AreaChart" },
        { type: "stacked-area", label: "Stacked Area", icon: "TrendingUp" },
        { type: "combo", label: "Combo Chart", icon: "Activity" },
      ]
    },
    {
      name: "Pie & Donut",
      color: "bg-purple-100 border-purple-200",
      textColor: "text-purple-600",
      charts: [
        { type: "pie", label: "Pie Chart", icon: "PieChart" },
        { type: "donut", label: "Donut Chart", icon: "Target" },
        { type: "treemap", label: "Treemap", icon: "Layers" },
        { type: "funnel", label: "Funnel Chart", icon: "TrendingUp" },
      ]
    },
    {
      name: "Scatter & Bubble",
      color: "bg-green-100 border-green-200",
      textColor: "text-green-600",
      charts: [
        { type: "scatter", label: "Scatter Plot", icon: "ChartScatter" },
        { type: "bubble", label: "Bubble Chart", icon: "ChartScatter" },
        { type: "radar", label: "Radar Chart", icon: "Target" },
        { type: "gauge", label: "Gauge", icon: "Target" },
      ]
    },
    {
      name: "Data & KPI",
      color: "bg-pink-100 border-pink-200",
      textColor: "text-pink-600",
      charts: [
        { type: "table", label: "Table", icon: "Table" },
        { type: "card", label: "Card", icon: "FileText" },
        { type: "multi-row-card", label: "Multi-row Card", icon: "Layers" },
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Multiple Charts</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select multiple chart types to add to your dashboard at once.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6 pr-4">
              {chartCategories.map((category) => (
                <div key={category.name} className={`rounded-xl border-2 p-6 ${category.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold text-lg ${category.textColor}`}>
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.charts.filter(c => selectedCharts.includes(c.type)).length} selected
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {category.charts.map((chart) => {
                      const IconComponent = iconMap[chart.icon as keyof typeof iconMap];
                      const isSelected = selectedCharts.includes(chart.type);
                      
                      return (
                        <div
                          key={chart.type}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm ${
                            isSelected
                              ? 'bg-white border-blue-300 shadow-md'
                              : 'bg-white/70 border-gray-200 hover:bg-white'
                          }`}
                          onClick={() => handleChartToggle(chart.type)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleChartToggle(chart.type)}
                            className="flex-shrink-0"
                          />
                          
                          {IconComponent && (
                            <IconComponent className="h-5 w-5 flex-shrink-0 text-gray-600" />
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {chart.label}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedCharts.length} chart{selectedCharts.length !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCharts}
              disabled={selectedCharts.length === 0}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
            >
              Add {selectedCharts.length} Chart{selectedCharts.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiSelectChartDialog;
