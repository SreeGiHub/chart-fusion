
import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { createTextToChartItem } from "@/utils/chartUtils";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Loader2, Wand2 } from "lucide-react";

interface TextToChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TextToChartDialog: React.FC<TextToChartDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { dispatch } = useDashboard();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChart = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your chart");
      return;
    }

    setIsLoading(true);
    
    try {
      // Text-to-chart examples with hardcoded responses
      let chartItem;
      const lowerPrompt = prompt.toLowerCase();

      // Match common patterns
      if (lowerPrompt.includes("compare") && 
         (lowerPrompt.includes("gender") || lowerPrompt.includes("boys") || lowerPrompt.includes("girls"))) {
        chartItem = createTextToChartItem("gender comparison", prompt);
      } 
      else if (lowerPrompt.includes("sales") || lowerPrompt.includes("revenue")) {
        chartItem = createTextToChartItem("sales overview", prompt);
      } 
      else if (lowerPrompt.includes("age") || lowerPrompt.includes("demographic")) {
        chartItem = createTextToChartItem("age distribution", prompt);
      }
      else if (lowerPrompt.includes("temperature") || lowerPrompt.includes("weather")) {
        chartItem = createTextToChartItem("temperature trend", prompt);
      }
      else if (lowerPrompt.includes("pie") || lowerPrompt.includes("proportion") || lowerPrompt.includes("distribution")) {
        chartItem = createTextToChartItem("market share", prompt);
      }
      else {
        // Default to a simple bar chart
        chartItem = createTextToChartItem("default", prompt);
      }
      
      dispatch({ type: "ADD_ITEM", payload: chartItem });
      toast.success("Chart created successfully!");
      onOpenChange(false);
      setPrompt("");
    } catch (error) {
      console.error("Error creating chart:", error);
      toast.error("Failed to create chart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Chart from Text</DialogTitle>
          <DialogDescription>
            Describe the chart you want to create. For example: "Create a comparison chart of student performance by gender" or "Show monthly sales data for 2023".
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Describe your chart here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateChart} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Create Chart
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TextToChartDialog;
