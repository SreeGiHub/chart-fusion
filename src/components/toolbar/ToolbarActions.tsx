
import { useDashboard } from "@/context/DashboardContext";
import { toast } from "sonner";
import { Undo, Redo, Eye, EyeOff, Grid, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolbarActionsProps {
  onTextToChartOpen: () => void;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({ onTextToChartOpen }) => {
  const { state, dispatch } = useDashboard();

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

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onTextToChartOpen}
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
