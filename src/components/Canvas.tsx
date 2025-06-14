
import { useRef } from "react";
import { useDashboard } from "@/context/DashboardContext";
import ChartItem from "./ChartItem";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useCanvasNavigation } from "@/hooks/useCanvasNavigation";
import { useCanvasDropZone } from "@/hooks/useCanvasDropZone";

const Canvas: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    transform,
    setTransform,
    isPanning,
    setIsPanning,
    setLastPanPoint
  } = useCanvasTransform();

  const { handleMouseDown, handleWheel } = useCanvasNavigation({
    transform,
    setTransform,
    setIsPanning,
    setLastPanPoint,
    canvasRef
  });

  const { handleDrop, handleDragOver } = useCanvasDropZone({
    transform,
    canvasRef
  });

  const handleCanvasClick = () => {
    // Only deselect if we're not panning
    if (state.selectedItemId && !isPanning) {
      dispatch({ type: "SELECT_ITEM", payload: null });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-56px)] overflow-hidden bg-gray-50"
      onWheel={handleWheel}
    >
      <div 
        ref={canvasRef}
        id="dashboard-canvas"
        className="absolute inset-0 cursor-grab"
        style={{ 
          width: "8000px",
          height: "8000px",
          backgroundColor: "#FFFFFF",
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          cursor: isPanning ? 'grabbing' : 'grab'
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {state.items.map((item) => (
          <ChartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
