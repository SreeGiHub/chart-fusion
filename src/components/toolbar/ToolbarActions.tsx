
import { useDashboard } from "@/context/DashboardContext";
import { toast } from "sonner";
import { Undo, Redo, Eye, EyeOff, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface ToolbarActionsProps {
  onTextToChartOpen: () => void;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({ onTextToChartOpen }) => {
  const { state, dispatch } = useDashboard();
  const [zoomLevel, setZoomLevel] = useState(100);

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

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 25, 200);
    setZoomLevel(newZoom);
    const canvas = document.getElementById('dashboard-canvas');
    if (canvas) {
      canvas.style.transform = `scale(${newZoom / 100})`;
      canvas.style.transformOrigin = 'top left';
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 25, 25);
    setZoomLevel(newZoom);
    const canvas = document.getElementById('dashboard-canvas');
    if (canvas) {
      canvas.style.transform = `scale(${newZoom / 100})`;
      canvas.style.transformOrigin = 'top left';
    }
  };

  return (
    <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-1 border rounded-md">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 25}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="text-sm px-2 py-1 min-w-[60px] text-center">{zoomLevel}%</span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

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
    </div>
  );
};

export default ToolbarActions;
