
import ChartCategoriesDropdown from "./toolbar/ChartCategoriesDropdown";
import ExportDropdown from "./toolbar/ExportDropdown";
import ToolbarActions from "./toolbar/ToolbarActions";
import DashboardTitle from "./toolbar/DashboardTitle";
import SettingsDialog from "./toolbar/SettingsDialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboard } from "@/context/DashboardContext";
import { toast } from "sonner";

interface ToolbarProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

const Toolbar: React.FC<ToolbarProps> = ({ canvasRef }) => {
  const { state, dispatch } = useDashboard();

  const handleClearCanvas = () => {
    if (state.items.length === 0) {
      toast.info("Canvas is already empty");
      return;
    }
    
    dispatch({ type: "CLEAR_ALL_ITEMS" });
    toast.success("Canvas cleared successfully");
  };

  return (
    <div className="bg-background border-b p-2 flex items-center justify-between">
      <div className="left-section flex items-center gap-3">
        <ChartCategoriesDropdown onTextToChartOpen={() => {}} />
        <ToolbarActions onTextToChartOpen={() => {}} />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleClearCanvas}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Canvas</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="middle-section">
        <DashboardTitle />
      </div>

      <div className="right-section flex items-center gap-2">
        <ExportDropdown canvasRef={canvasRef} />
        <SettingsDialog />
      </div>
    </div>
  );
};

export default Toolbar;
