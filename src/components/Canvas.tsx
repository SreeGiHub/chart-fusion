
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

  const getNextPosition = () => {
    const existingItems = state.items;
    if (existingItems.length === 0) {
      return { x: 50, y: 50 };
    }
    
    // Find a position that doesn't overlap with existing items
    const gridSize = 450; // Chart width + some spacing
    const row = Math.floor(existingItems.length / 3);
    const col = existingItems.length % 3;
    
    return {
      x: 50 + (col * gridSize),
      y: 50 + (row * 350) // Chart height + some spacing
    };
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
      className="relative w-full h-[calc(100vh-56px)] overflow-auto bg-white"
      style={{ 
        minWidth: "200%",
        minHeight: "200%",
        backgroundColor: "#FFFFFF"
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
