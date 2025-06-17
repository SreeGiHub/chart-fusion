
import { useDashboard } from "@/context/DashboardContext";
import { toast } from "sonner";
import { Undo, Redo, Eye, EyeOff, ZoomIn, ZoomOut, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface ToolbarActionsProps {
  onTextToChartOpen: () => void;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({ onTextToChartOpen }) => {
  const { state, dispatch } = useDashboard();
  const [canvasTransform, setCanvasTransform] = useState({ scale: 1 });

  // Listen for canvas transform changes
  useEffect(() => {
    const canvas = document.getElementById('dashboard-canvas');
    if (canvas) {
      const observer = new MutationObserver(() => {
        const transform = canvas.style.transform;
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        if (scaleMatch) {
          setCanvasTransform({ scale: parseFloat(scaleMatch[1]) });
        }
      });
      
      observer.observe(canvas, { attributes: true, attributeFilter: ['style'] });
      
      return () => observer.disconnect();
    }
  }, []);

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

  const adjustCanvasZoom = (scaleFactor: number) => {
    const canvas = document.getElementById('dashboard-canvas');
    if (canvas) {
      const currentTransform = canvas.style.transform;
      const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
      
      const currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
      const newScale = Math.min(Math.max(currentScale * scaleFactor, 0.1), 5);
      
      canvas.style.transform = `scale(${newScale})`;
    }
  };

  const handleZoomIn = () => {
    adjustCanvasZoom(1.25);
  };

  const handleZoomOut = () => {
    adjustCanvasZoom(0.8);
  };

  const handleResetZoom = () => {
    const canvas = document.getElementById('dashboard-canvas');
    if (canvas) {
      canvas.style.transform = 'scale(1)';
    }
    // Reset scroll position
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.scrollTop = 0;
      scrollArea.scrollLeft = 0;
    }
  };

  const handleNavigationInfo = () => {
    toast.info("Use scrollbars to navigate • Cmd/Ctrl + Scroll to zoom • Cmd/Ctrl + 0 to reset view", {
      duration: 4000,
    });
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
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={canvasTransform.scale <= 0.1}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <button 
          onClick={handleResetZoom}
          className="text-sm px-2 py-1 min-w-[60px] text-center hover:bg-gray-100 rounded"
        >
          {Math.round(canvasTransform.scale * 100)}%
        </button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={canvasTransform.scale >= 5}>
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
            <Button variant="outline" size="icon" onClick={handleNavigationInfo}>
              <Hand className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Canvas Navigation</TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
