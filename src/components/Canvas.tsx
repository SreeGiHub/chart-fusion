
import { useRef, MouseEvent } from "react";
import { useDashboard } from "@/context/DashboardContext";
import ChartItem from "./ChartItem";
import { ChartType } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { toast } from "sonner";

const Canvas: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = () => {
    // Deselect when clicking on the canvas
    if (state.selectedItemId) {
      dispatch({ type: "SELECT_ITEM", payload: null });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData("chartType") as ChartType;
    if (!type) return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    
    const newItem = createNewChartItem(type, { x, y });
    dispatch({ type: "ADD_ITEM", payload: newItem });
    
    toast.success(`Added new ${type} chart`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      ref={canvasRef}
      id="dashboard-canvas"
      className={`relative w-full h-[calc(100vh-56px)] overflow-auto bg-gray-50 ${
        state.isGridVisible && !state.previewMode ? "canvas-grid" : ""
      }`}
      style={{ 
        backgroundColor: state.canvasColor || "#F8FAFC"
      }}
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {state.items.map((item) => (
        <ChartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Canvas;
