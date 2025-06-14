
import { useDashboard } from "@/context/DashboardContext";
import { ChartType } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { toast } from "sonner";

interface UseCanvasDropZoneProps {
  transform: { x: number; y: number; scale: number };
  canvasRef: React.RefObject<HTMLDivElement>;
}

export const useCanvasDropZone = ({ transform, canvasRef }: UseCanvasDropZoneProps) => {
  const { dispatch } = useDashboard();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData("chartType") as ChartType;
    if (!type) return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Convert screen coordinates to canvas coordinates
    const screenX = e.clientX - canvasRect.left;
    const screenY = e.clientY - canvasRect.top;
    
    const x = (screenX - transform.x) / transform.scale;
    const y = (screenY - transform.y) / transform.scale;
    
    const newItem = createNewChartItem(type, { x, y });
    dispatch({ type: "ADD_ITEM", payload: newItem });
    
    toast.success(`Added new ${type} chart`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    handleDrop,
    handleDragOver
  };
};
