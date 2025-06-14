
import { useRef, MouseEvent, useState, useCallback, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import ChartItem from "./ChartItem";
import { ChartType } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { toast } from "sonner";

const Canvas: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Canvas transform state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleCanvasClick = () => {
    // Only deselect if we're not panning
    if (state.selectedItemId && !isPanning) {
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

  // Pan functionality
  const handleMouseDown = (e: MouseEvent) => {
    // Left click with meta/ctrl or middle click
    if ((e.button === 0 && (e.metaKey || e.ctrlKey)) || e.button === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setTransform(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Zoom functionality
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.1), 5);
      
      // Zoom towards mouse position
      const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
      const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
      
      setTransform({
        x: newX,
        y: newY,
        scale: newScale
      });
    }
  };

  // Add global event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Reset zoom and pan
  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        resetView();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
