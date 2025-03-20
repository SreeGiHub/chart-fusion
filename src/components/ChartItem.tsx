import { useRef, useState, MouseEvent, useEffect } from "react";
import { ChartItemType, Position, Size } from "@/types";
import { useDashboard } from "@/context/DashboardContext";
import { snapToGrid } from "@/utils/chartUtils";
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  AreaChart,
  ResponsiveContainer,
  Bar,
  Line,
  Pie,
  Scatter,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

interface ChartItemProps {
  item: ChartItemType;
}

const ChartItem: React.FC<ChartItemProps> = ({ item }) => {
  const { state, dispatch } = useDashboard();
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState<Size>({ width: 0, height: 0 });
  const [initialPosition, setInitialPosition] = useState<Position>({ x: 0, y: 0 });
  const [initialMousePosition, setInitialMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [editingTitle, setEditingTitle] = useState(false);
  
  const isSelected = state.selectedItemId === item.id;
  const isPreviewMode = state.previewMode;

  const handleChartClick = (e: MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    dispatch({ type: "SELECT_ITEM", payload: item.id });
  };

  const handleDoubleClick = (e: MouseEvent) => {
    if (isPreviewMode || item.type !== "text") return;
    e.stopPropagation();
    setEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: item.id,
        updates: { title: e.target.value },
      },
    });
  };

  const handleTitleBlur = () => {
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingTitle(false);
    }
  };

  const startDrag = (e: MouseEvent) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const startResize = (e: MouseEvent, direction: string) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    if (itemRef.current) {
      setIsResizing(true);
      setResizeDirection(direction);
      setInitialSize(item.size);
      setInitialPosition(item.position);
      setInitialMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        const canvasElement = document.getElementById("dashboard-canvas");
        if (!canvasElement) return;

        const canvasRect = canvasElement.getBoundingClientRect();
        let newX = e.clientX - canvasRect.left - dragOffset.x;
        let newY = e.clientY - canvasRect.top - dragOffset.y;

        if (state.snapToGrid) {
          newX = snapToGrid(newX, state.gridSize);
          newY = snapToGrid(newY, state.gridSize);
        }

        newX = Math.max(0, Math.min(newX, canvasRect.width - item.size.width));
        newY = Math.max(0, Math.min(newY, canvasRect.height - item.size.height));

        dispatch({
          type: "MOVE_ITEM",
          payload: { id: item.id, position: { x: newX, y: newY } },
        });
      } else if (isResizing && resizeDirection) {
        let newWidth = initialSize.width;
        let newHeight = initialSize.height;
        let newX = initialPosition.x;
        let newY = initialPosition.y;

        const deltaX = e.clientX - initialMousePosition.x;
        const deltaY = e.clientY - initialMousePosition.y;

        if (resizeDirection.includes("e")) {
          newWidth = initialSize.width + deltaX;
        }
        if (resizeDirection.includes("w")) {
          newWidth = initialSize.width - deltaX;
          newX = initialPosition.x + deltaX;
        }
        if (resizeDirection.includes("s")) {
          newHeight = initialSize.height + deltaY;
        }
        if (resizeDirection.includes("n")) {
          newHeight = initialSize.height - deltaY;
          newY = initialPosition.y + deltaY;
        }

        if (state.snapToGrid) {
          newWidth = snapToGrid(newWidth, state.gridSize);
          newHeight = snapToGrid(newHeight, state.gridSize);
          newX = snapToGrid(newX, state.gridSize);
          newY = snapToGrid(newY, state.gridSize);
        }

        newWidth = Math.max(100, newWidth);
        newHeight = Math.max(100, newHeight);

        dispatch({
          type: "RESIZE_ITEM",
          payload: { id: item.id, size: { width: newWidth, height: newHeight } },
        });

        if (newX !== initialPosition.x || newY !== initialPosition.y) {
          dispatch({
            type: "MOVE_ITEM",
            payload: { id: item.id, position: { x: newX, y: newY } },
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging, 
    isResizing, 
    dragOffset, 
    item.id, 
    item.size, 
    resizeDirection, 
    initialSize, 
    initialPosition, 
    initialMousePosition, 
    dispatch, 
    state.gridSize, 
    state.snapToGrid
  ]);

  const renderChartContent = () => {
    if (item.type === "text") {
      return (
        <div className="flex items-center justify-center h-full w-full p-4">
          {editingTitle ? (
            <input
              type="text"
              value={item.title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="w-full text-center text-xl font-medium bg-transparent inline-editable"
              autoFocus
            />
          ) : (
            <h2 
              className="text-xl font-medium text-center w-full"
              onDoubleClick={handleDoubleClick}
            >
              {item.title}
            </h2>
          )}
        </div>
      );
    }

    const hasMultipleDatasets = item.data.datasets.length > 1;
    
    let chartData;
    
    if (hasMultipleDatasets) {
      chartData = item.data.labels.map((label, index) => {
        const dataPoint: any = { name: label };
        item.data.datasets.forEach(dataset => {
          dataPoint[dataset.label] = dataset.data[index];
        });
        return dataPoint;
      });
    } else {
      chartData = item.data.datasets[0].data.map((value, index) => {
        if (typeof value === "object" && "x" in value && "y" in value) {
          return value;
        }
        return {
          name: item.data.labels[index] || `Item ${index + 1}`,
          value: value,
        };
      });
    }
    
    const color = item.data.datasets[0].backgroundColor as string;
    const colors = Array.isArray(item.data.datasets[0].backgroundColor) 
      ? item.data.datasets[0].backgroundColor 
      : [item.data.datasets[0].backgroundColor || "#4F46E5"];

    switch (item.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {hasMultipleDatasets ? (
                item.data.datasets.map((dataset, index) => (
                  <Bar 
                    key={index}
                    dataKey={dataset.label} 
                    fill={
                      Array.isArray(dataset.backgroundColor) 
                        ? dataset.backgroundColor[0] 
                        : (dataset.backgroundColor as string || "#4F46E5")
                    } 
                  />
                ))
              ) : (
                <Bar dataKey="value" fill={color || "#4F46E5"} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={item.data.datasets[0].borderColor || "#4F46E5"} 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={item.data.datasets[0].borderColor || "#4F46E5"} 
                fill={item.data.datasets[0].backgroundColor || "#4F46E533"} 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="x" />
              <YAxis type="number" dataKey="y" name="y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter 
                name={item.data.datasets[0].label || "Scatter"} 
                data={item.data.datasets[0].data} 
                fill={color || "#4F46E5"} 
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case "donut":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div
      ref={itemRef}
      className={`chart-item absolute ${isSelected ? "selected" : ""}`}
      style={{
        left: item.position.x,
        top: item.position.y,
        width: item.size.width,
        height: item.size.height,
        cursor: isDragging ? "grabbing" : isSelected ? "grab" : "default",
        zIndex: isSelected ? 100 : 1,
      }}
      onClick={handleChartClick}
      onMouseDown={isSelected && !isPreviewMode ? startDrag : undefined}
    >
      {!isPreviewMode && (
        <div className="chart-tooltip">
          {item.title}
        </div>
      )}
      
      {item.type !== "text" && (
        <div className="chart-title px-4 pt-3 pb-1 border-b">
          {editingTitle ? (
            <input
              type="text"
              value={item.title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="w-full text-sm font-medium bg-transparent inline-editable"
              autoFocus
            />
          ) : (
            <h3 
              className="text-sm font-medium"
              onDoubleClick={() => !isPreviewMode && setEditingTitle(true)}
            >
              {item.title}
            </h3>
          )}
        </div>
      )}
      
      <div className="chart-content p-2" style={{ height: "calc(100% - 40px)" }}>
        {renderChartContent()}
      </div>
      
      {isSelected && !isPreviewMode && (
        <>
          <div
            className="resize-handle nw"
            onMouseDown={(e) => startResize(e, "nw")}
          />
          <div
            className="resize-handle ne"
            onMouseDown={(e) => startResize(e, "ne")}
          />
          <div
            className="resize-handle se"
            onMouseDown={(e) => startResize(e, "se")}
          />
          <div
            className="resize-handle sw"
            onMouseDown={(e) => startResize(e, "sw")}
          />
        </>
      )}
    </div>
  );
};

export default ChartItem;
