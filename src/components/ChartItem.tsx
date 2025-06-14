
import { useState, useEffect, useRef } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { ChartItemType } from "@/types";
import { Rnd, RndResizeCallback, RndDragCallback } from "react-rnd";
import { snapToGrid } from "@/utils/chartUtils";
import { X, GripVertical, Copy, Trash2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import chroma from "chroma-js";
import ChartRenderer from './charts/ChartRenderer';

interface ChartItemProps {
  item: ChartItemType;
}

const ChartItem: React.FC<ChartItemProps> = ({ item }) => {
  const { state, dispatch } = useDashboard();
  const { isGridVisible, gridSize, snapToGrid: shouldSnapToGrid, previewMode } = state;
  const isSelected = state.selectedItemId === item.id;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
    }
  }, [isSelected]);

  useEffect(() => {
    setTitle(item.title);
  }, [item.title]);

  const handleSelect = (e: React.MouseEvent | any) => {
    e.stopPropagation();
    if (!isSelected && !previewMode) {
      dispatch({ type: "SELECT_ITEM", payload: item.id });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!previewMode) {
      setIsEditing(true);
    }
  };

  const handleTitleSubmit = () => {
    setIsEditing(false);
    if (title !== item.title) {
      dispatch({
        type: "UPDATE_ITEM",
        payload: {
          id: item.id,
          updates: { title },
        },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTitleSubmit();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "REMOVE_ITEM", payload: item.id });
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newItem = {
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      position: {
        x: item.position.x + 20,
        y: item.position.y + 20,
      },
    };
    
    dispatch({ type: "ADD_ITEM", payload: newItem });
  };

  const handleDrag: RndDragCallback = (e, d) => {
    setIsDragging(true);
    let { x, y } = d;
    
    if (shouldSnapToGrid) {
      x = snapToGrid(x, gridSize);
      y = snapToGrid(y, gridSize);
    }
    
    dispatch({
      type: "MOVE_ITEM",
      payload: {
        id: item.id,
        position: { x, y },
      },
    });
  };

  const handleDragStop: RndDragCallback = () => {
    setIsDragging(false);
  };

  const handleResize: RndResizeCallback = (e, direction, ref, delta, position) => {
    setIsResizing(true);
    
    let width = parseInt(ref.style.width);
    let height = parseInt(ref.style.height);
    let { x, y } = position;
    
    if (shouldSnapToGrid) {
      width = snapToGrid(width, gridSize);
      height = snapToGrid(height, gridSize);
      x = snapToGrid(x, gridSize);
      y = snapToGrid(y, gridSize);
    }
    
    dispatch({
      type: "RESIZE_ITEM",
      payload: {
        id: item.id,
        size: { width, height },
      },
    });
    
    dispatch({
      type: "MOVE_ITEM",
      payload: {
        id: item.id,
        position: { x, y },
      },
    });
  };

  const handleResizeStop: RndResizeCallback = () => {
    setIsResizing(false);
  };

  const getHeaderColor = () => {
    let color = "#4f46e5";
    
    if (item.data.datasets && item.data.datasets[0]) {
      const bgColor = item.data.datasets[0].backgroundColor;
      
      if (bgColor) {
        if (Array.isArray(bgColor)) {
          color = bgColor[0];
        } else {
          color = bgColor;
        }
      }
    }
    
    if (typeof color !== 'string') {
      color = "#4f46e5";
    }
    
    try {
      const lightColor = chroma(color).alpha(0.1).css();
      return lightColor;
    } catch (error) {
      return "rgba(79, 70, 229, 0.1)";
    }
  };

  const headerBgColor = getHeaderColor();

  return (
    <Rnd
      size={{ width: item.size.width, height: item.size.height }}
      position={{ x: item.position.x, y: item.position.y }}
      onDragStart={handleSelect}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStart={handleSelect}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      className={cn(
        "chart-item rounded-md bg-background border shadow-sm",
        isDragging && "opacity-70",
        isSelected && !previewMode && "ring-2 ring-primary",
        previewMode && "pointer-events-none"
      )}
      dragHandleClassName="drag-handle"
      enableResizing={!previewMode}
      disableDragging={previewMode}
      minWidth={100}
      minHeight={100}
      bounds="parent"
    >
      <div
        className="flex flex-col h-full cursor-move"
        onClick={handleSelect}
      >
        <div
          className="drag-handle px-3 py-2 flex items-center justify-between rounded-t-md"
          style={{ backgroundColor: headerBgColor }}
          onDoubleClick={handleDoubleClick}
        >
          <div className="flex-1 flex items-center">
            <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border px-1 focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            ) : (
              <h3 className="text-sm font-medium truncate">{title}</h3>
            )}
          </div>
          
          {!previewMode && (
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleDuplicate}>
                <Copy className="h-3 w-3" />
              </Button>
              
              {item.type !== "text" && (
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Move className="h-3 w-3" />
                </Button>
              )}
              
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleRemove}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden p-2">
          <ChartRenderer item={item} />
        </div>
      </div>
    </Rnd>
  );
};

export default ChartItem;
