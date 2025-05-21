import { useState, useEffect, useRef } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { ChartItemType } from "@/types";
import { Rnd, RndResizeCallback, RndDragCallback } from "react-rnd";
import { snapToGrid } from "@/utils/chartUtils";
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  AreaChart,
  ResponsiveContainer,
  Cell,
  Legend,
  Bar,
  Line,
  Pie,
  Area,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { X, GripVertical, Copy, Trash2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import chroma from "chroma-js";
import { isTextChartType } from "@/utils/chartRendererUtils";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(item.size.height);

  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
    }
  }, [isSelected]);

  useEffect(() => {
    setTitle(item.title);
  }, [item.title]);

  useEffect(() => {
    if (item.type === "text" && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      if (contentHeight > height) {
        setHeight(contentHeight + 40);
        dispatch({
          type: "UPDATE_ITEM",
          payload: {
            id: item.id,
            updates: {
              size: {
                width: item.size.width,
                height: contentHeight + 40,
              },
            },
          },
        });
      }
    }
  }, [item, dispatch, height]);

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

  const formattedData = () => {
    return item.data.labels.map((label, index) => {
      const dataPoint: any = { name: label };
      
      item.data.datasets
        .filter(dataset => !dataset.hidden) // Only include visible datasets
        .forEach((dataset, datasetIndex) => {
          const dp = dataset.data[index];
          dataPoint[dataset.label || `dataset-${datasetIndex}`] = dp;
        });
      
      return dataPoint;
    });
  };

  const processedData = formattedData();

  const chartStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
  };

  const renderChart = () => {
    switch (item.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }} 
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }} 
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => value}
              />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }} 
                content={(props) => {
                  const { payload } = props;
                  if (!payload || !payload.length) return null;
                  
                  // Filter out datasets with legendHidden=true
                  const filteredPayload = payload.filter(entry => {
                    const datasetIndex = item.data.datasets.findIndex(
                      d => d.label === entry.value || (!d.label && `dataset-${item.data.datasets.indexOf(d)}` === entry.value)
                    );
                    return datasetIndex === -1 || !item.data.datasets[datasetIndex].legendHidden;
                  });
                  
                  if (!filteredPayload.length) return null;
                  
                  return (
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
                      {filteredPayload.map((entry, index) => (
                        <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                          <div style={{ width: 10, height: 10, backgroundColor: entry.color, marginRight: 5 }} />
                          <span style={{ fontSize: 12 }}>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              {item.data.datasets
                .filter(dataset => !dataset.hidden)
                .map((dataset, index) => (
                <Bar
                  key={index}
                  dataKey={dataset.label || `dataset-${index}`}
                  fill={Array.isArray(dataset.backgroundColor)
                    ? dataset.backgroundColor[0]
                    : dataset.backgroundColor || "#4f46e5"}
                  radius={[2, 2, 0, 0]}
                  barSize={30}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                content={(props) => {
                  const { payload } = props;
                  if (!payload || !payload.length) return null;
                  
                  // Filter out datasets with legendHidden=true
                  const filteredPayload = payload.filter(entry => {
                    const datasetIndex = item.data.datasets.findIndex(
                      d => d.label === entry.value || (!d.label && `dataset-${item.data.datasets.indexOf(d)}` === entry.value)
                    );
                    return datasetIndex === -1 || !item.data.datasets[datasetIndex].legendHidden;
                  });
                  
                  if (!filteredPayload.length) return null;
                  
                  return (
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
                      {filteredPayload.map((entry, index) => (
                        <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                          <div style={{ width: 10, height: 10, backgroundColor: entry.color, marginRight: 5 }} />
                          <span style={{ fontSize: 12 }}>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              {item.data.datasets.map((dataset, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataset.label || `dataset-${index}`}
                  stroke={dataset.borderColor as string || "#4f46e5"}
                  fill={dataset.backgroundColor as string || "#4f46e533"}
                  strokeWidth={dataset.borderWidth || 3}
                  dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  hide={dataset.hidden}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                content={(props) => {
                  const { payload } = props;
                  if (!payload || !payload.length) return null;
                  
                  // Filter out datasets with legendHidden=true
                  const filteredPayload = payload.filter(entry => {
                    const datasetIndex = item.data.datasets.findIndex(
                      d => d.label === entry.value || (!d.label && `dataset-${item.data.datasets.indexOf(d)}` === entry.value)
                    );
                    return datasetIndex === -1 || !item.data.datasets[datasetIndex].legendHidden;
                  });
                  
                  if (!filteredPayload.length) return null;
                  
                  return (
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
                      {filteredPayload.map((entry, index) => (
                        <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                          <div style={{ width: 10, height: 10, backgroundColor: entry.color, marginRight: 5 }} />
                          <span style={{ fontSize: 12 }}>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              {item.data.datasets.map((dataset, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={dataset.label || `dataset-${index}`}
                  stroke={typeof dataset.borderColor === 'string' ? dataset.borderColor : "#4f46e5"}
                  fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : "#4f46e533"}
                  strokeWidth={dataset.borderWidth || 3}
                  dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  hide={dataset.hidden}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "pie":
      case "donut":
        const isPie = item.type === "pie";
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }} style={chartStyle}>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
                formatter={(value, name) => [`${value} (${((value as number) / processedData.reduce((a, b) => a + (b.value as number), 0) * 100).toFixed(1)}%)`, name]}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: "10px" }}
                content={(props) => {
                  const { payload } = props;
                  if (!payload || !payload.length) return null;
                  
                  // For pie/donut charts, check if the dataset is hidden
                  const dataset = item.data.datasets[0];
                  if (dataset && dataset.legendHidden) return null;
                  
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 10 }}>
                      {payload.map((entry, index) => (
                        <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                          <div style={{ width: 10, height: 10, backgroundColor: entry.color, marginRight: 5 }} />
                          <span style={{ fontSize: 12 }}>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Pie
                data={processedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={isPie ? 0 : "60%"}
                outerRadius="80%"
                paddingAngle={2}
                fill="#4f46e5"
                label={({ name, percent }) => {
                  const dataset = item.data.datasets[0];
                  if (dataset && dataset.legendHidden) return null;
                  return `${name}: ${(percent * 100).toFixed(0)}%`;
                }}
                labelLine={false}
              >
                {processedData.map((entry, index) => {
                  const bgColors = item.data.datasets[0].backgroundColor;
                  const color = Array.isArray(bgColors) ? bgColors[index % bgColors.length] : bgColors;
                  return <Cell key={index} fill={color || `#${Math.floor(Math.random() * 16777215).toString(16)}`} />;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div className="flex items-center justify-center h-full">Unsupported chart type</div>;
    }
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
          {renderChart()}
        </div>
      </div>
    </Rnd>
  );
};

export default ChartItem;
