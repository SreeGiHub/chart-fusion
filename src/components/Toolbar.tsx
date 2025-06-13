import { useDashboard } from "@/context/DashboardContext";
import { ChartType } from "@/types";
import { 
  createNewChartItem, 
  exportToJSON, 
  exportToPNG, 
  exportToPDF
} from "@/utils/chartUtils";
import { toast } from "sonner";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Activity, 
  Type, 
  Save, 
  Download, 
  Undo, 
  Redo, 
  Eye, 
  EyeOff, 
  Grid, 
  Settings,
  Image,
  FileOutput,
  MessageSquareText,
  Wand2,
  ScatterChart,
  Gauge,
  Map,
  LayoutGrid,
  CircleDot,
  ZapOff,
  Palette as PaletteIcon,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useRef, useState } from "react";
import TextToChartDialog from "./TextToChartDialog";
import PasteDataDialog from "./PasteDataDialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface ToolbarProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

const CANVAS_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Light Gray", value: "#F8F9FA" },
  { name: "Dark Gray", value: "#E9ECEF" },
  { name: "Light Blue", value: "#E3F2FD" },
  { name: "Light Green", value: "#E8F5E8" },
  { name: "Light Yellow", value: "#FFF9E6" },
  { name: "Light Pink", value: "#FDE2E7" },
  { name: "Light Purple", value: "#F3E8FF" },
  { name: "Cream", value: "#FDF6E3" },
  { name: "Mint", value: "#F0FDFA" },
];

const Toolbar: React.FC<ToolbarProps> = ({ canvasRef }) => {
  const { state, dispatch } = useDashboard();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTextToChartOpen, setIsTextToChartOpen] = useState(false);
  const [isPasteDataOpen, setIsPasteDataOpen] = useState(false);

  const canvasColors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Light Gray", value: "#F8F9FA" },
    { name: "Dark Gray", value: "#E9ECEF" },
    { name: "Light Blue", value: "#E3F2FD" },
    { name: "Light Green", value: "#E8F5E8" },
    { name: "Light Yellow", value: "#FFF9E6" },
    { name: "Light Pink", value: "#FDE2E7" },
    { name: "Light Purple", value: "#F3E8FF" },
    { name: "Cream", value: "#FDF6E3" },
    { name: "Mint", value: "#F0FDFA" },
  ];

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

  const handleSave = () => {
    try {
      const data = exportToJSON(state);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${state.title || "dashboard"}.json`;
      link.click();

      toast.success("Dashboard saved successfully");
    } catch (error) {
      console.error("Failed to save dashboard:", error);
      toast.error("Failed to save dashboard");
    }
  };

  const handleExportPNG = () => {
    try {
      exportToPNG(canvasRef);
      toast.success("Exported as PNG");
    } catch (error) {
      console.error("Failed to export as PNG:", error);
      toast.error("Failed to export as PNG");
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(canvasRef);
      toast.success("Exported as PDF");
    } catch (error) {
      console.error("Failed to export as PDF:", error);
      toast.error("Failed to export as PDF");
    }
  };

  const handleUndo = () => {
    if (state.editHistory.past.length === 0) {
      toast.info("Nothing to undo");
      return;
    }
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    if (state.editHistory.future.length === 0) {
      toast.info("Nothing to redo");
      return;
    }
    dispatch({ type: "REDO" });
  };

  const handleTogglePreview = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
  };

  const handleToggleGrid = () => {
    dispatch({ type: "TOGGLE_GRID" });
  };

  const handleCanvasColorChange = (color: string) => {
    dispatch({ type: "SET_CANVAS_COLOR", payload: color });
    toast.success("Canvas color updated");
  };

  const getDataStatus = () => {
    const chartCount = state.items.length;
    if (chartCount === 0) {
      return { label: "No data yet", variant: "secondary" as const };
    }
    return { label: `${chartCount} items`, variant: "default" as const };
  };

  const dataStatus = getDataStatus();

  return (
    <div className="bg-background border-b p-2 flex items-center justify-between">
      <div className="left-section flex items-center gap-3">
        {/* Enhanced Paste & Visualize Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default" 
                onClick={() => setIsPasteDataOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
                size="default"
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">Paste & Visualize</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div className="font-medium">Paste your data, preview it, and instantly generate charts</div>
                <div className="text-xs text-muted-foreground mt-1">Up to 20 rows from Excel or Sheets</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Data Status Badge */}
        <Badge variant={dataStatus.variant} className="text-xs">
          {dataStatus.label}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <span className="hidden sm:inline-block mr-2">Add Chart</span>
              <span className="sm:hidden">+</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Chart Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddItem("bar")}>
                <BarChart className="mr-2 h-4 w-4" />
                <span>Bar Chart</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddItem("line")}>
                <LineChart className="mr-2 h-4 w-4" />
                <span>Line Chart</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Area Charts</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddItem("area")}>
                <Activity className="mr-2 h-4 w-4" />
                <span>Area Chart</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Pie & Donut</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddItem("pie")}>
                <PieChart className="mr-2 h-4 w-4" />
                <span>Pie Chart</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddItem("donut")}>
                <PieChart className="mr-2 h-4 w-4" />
                <span>Donut Chart</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Scatter & Bubble</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddItem("scatter")}>
                <ScatterChart className="mr-2 h-4 w-4" />
                <span>Scatter Plot</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddItem("bubble")}>
                <CircleDot className="mr-2 h-4 w-4" />
                <span>Bubble Chart</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Gauges</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddItem("gauge")}>
                <Gauge className="mr-2 h-4 w-4" />
                <span>Gauge Chart</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Special Charts</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddItem("radar")}>
                <ZapOff className="mr-2 h-4 w-4" />
                <span>Radar Chart</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddItem("funnel")}>
                <Activity className="mr-2 h-4 w-4" />
                <span>Funnel Chart</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddItem("treemap")}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                <span>Treemap</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAddItem("text")}>
              <Type className="mr-2 h-4 w-4" />
              <span>Text Label</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsTextToChartOpen(true)}>
              <MessageSquareText className="mr-2 h-4 w-4" />
              <span>Text to Chart</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsTextToChartOpen(true)}
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>AI Chart Generator</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleUndo} disabled={state.editHistory.past.length === 0}>
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleRedo} disabled={state.editHistory.future.length === 0}>
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleToggleGrid}>
                <Grid className={`h-4 w-4 ${state.isGridVisible ? "text-primary" : ""}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: state.canvasColor || "#FFFFFF" }}
              />
              <span>Canvas</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Canvas Background Color</h4>
              <div className="grid grid-cols-6 gap-2">
                {CANVAS_COLORS.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                      state.canvasColor === color.value 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleCanvasColorChange(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="middle-section">
        <input
          type="text"
          value={state.title}
          onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
          className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-center w-96"
          placeholder="Untitled Dashboard"
        />
      </div>

      <div className="right-section flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleTogglePreview}>
                {state.previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{state.previewMode ? "Exit Preview" : "Preview"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Save className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Save & Export</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              <span>Save as JSON</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPNG}>
              <Image className="mr-2 h-4 w-4" />
              <span>Export as PNG</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF}>
              <FileOutput className="mr-2 h-4 w-4" />
              <span>Export as PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Dashboard Settings</DialogTitle>
              <DialogDescription>
                Configure the dashboard appearance and behavior
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid">Show Grid</Label>
                <Switch
                  id="show-grid"
                  checked={state.isGridVisible}
                  onCheckedChange={() => dispatch({ type: "TOGGLE_GRID" })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="snap-grid">Snap to Grid</Label>
                <Switch
                  id="snap-grid"
                  checked={state.snapToGrid}
                  onCheckedChange={() => dispatch({ type: "TOGGLE_SNAP_TO_GRID" })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grid-size">Grid Size: {state.gridSize}px</Label>
                <Slider
                  id="grid-size"
                  defaultValue={[state.gridSize]}
                  min={10}
                  max={50}
                  step={5}
                  onValueChange={(value) => dispatch({ type: "SET_GRID_SIZE", payload: value[0] })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsSettingsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TextToChartDialog 
          open={isTextToChartOpen} 
          onOpenChange={setIsTextToChartOpen} 
        />

        <PasteDataDialog 
          open={isPasteDataOpen} 
          onOpenChange={setIsPasteDataOpen} 
        />
      </div>
    </div>
  );
};

export default Toolbar;
