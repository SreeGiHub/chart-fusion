
import { useDashboard } from "@/context/DashboardContext";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface PasteDataButtonProps {
  onPasteDataOpen: () => void;
}

const PasteDataButton: React.FC<PasteDataButtonProps> = ({ onPasteDataOpen }) => {
  const { state } = useDashboard();

  const getDataStatus = () => {
    const chartCount = state.items.length;
    if (chartCount === 0) {
      return { label: "No data yet", variant: "secondary" as const };
    }
    return { label: `${chartCount} items`, variant: "default" as const };
  };

  const dataStatus = getDataStatus();

  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="default" 
              onClick={onPasteDataOpen}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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

      <Badge variant={dataStatus.variant} className="text-xs">
        {dataStatus.label}
      </Badge>
    </div>
  );
};

export default PasteDataButton;
