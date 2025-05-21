
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
  Scatter,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  FunnelChart,
  Funnel,
  LabelList
} from "recharts";
import { X, GripVertical, Copy, Trash2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import chroma from "chroma-js";
import { 
  isTextChartType, 
  formatChartData,
  prepareChartLegend 
} from "@/utils/chartRendererUtils";

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
    return formatChartData(item.data.labels, item.data.datasets);
  };

  const processedData = formattedData();

  // Filter datasets for legend
  const legendDatasets = prepareChartLegend(item.data.datasets);

  const chartStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
  };

  // Custom legend component that properly hides datasets with legendHidden=true
  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload || !payload.length) return null;
    
    // Filter out datasets with legendHidden=true
    const filteredPayload = payload.filter((entry: any) => {
      const datasetIndex = item.data.datasets.findIndex(
        d => d.label === entry.value || (!d.label && `dataset-${item.data.datasets.indexOf(d)}` === entry.value)
      );
      return datasetIndex === -1 || !item.data.datasets[datasetIndex].legendHidden;
    });
    
    if (!filteredPayload.length) return null;
    
    return (
      <div className="flex justify-center flex-wrap mt-2 text-xs">
        {filteredPayload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center mr-3 mb-1">
            <div 
              className="w-2.5 h-2.5 mr-1.5 rounded-sm" 
              style={{ backgroundColor: entry.color }} 
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    switch (item.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
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
                tickFormatter={(value) => value.toString()}
              />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
              />
              <Legend content={<CustomLegend />} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
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
              <Legend content={<CustomLegend />} />
              {item.data.datasets
                .filter(dataset => !dataset.hidden)
                .map((dataset, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataset.label || `dataset-${index}`}
                  stroke={dataset.borderColor as string || "#4f46e5"}
                  fill={dataset.backgroundColor as string || "#4f46e533"}
                  strokeWidth={dataset.borderWidth || 3}
                  dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
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
              <Legend content={<CustomLegend />} />
              {item.data.datasets
                .filter(dataset => !dataset.hidden)
                .map((dataset, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={dataset.label || `dataset-${index}`}
                  stroke={typeof dataset.borderColor === 'string' ? dataset.borderColor : "#4f46e5"}
                  fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : "#4f46e533"}
                  strokeWidth={dataset.borderWidth || 3}
                  dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
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
                formatter={(value, name) => [
                  `${value} (${((Number(value) / processedData.reduce((a: number, b: any) => 
                    a + (Number(b[item.data.datasets[0]?.label || 'dataset-0']) || 0), 0)) * 100).toFixed(1)}%)`, 
                  name
                ]}
              />
              <Legend content={<CustomLegend />} />
              <Pie
                data={processedData}
                dataKey={item.data.datasets[0]?.label || "dataset-0"}
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={isPie ? 0 : "60%"}
                outerRadius="80%"
                paddingAngle={2}
                fill="#4f46e5"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                type="number"
                dataKey="x" 
                name="X"
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                type="number"
                dataKey="y"
                name="Y"
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Legend content={<CustomLegend />} />
              {item.data.datasets
                .filter(dataset => !dataset.hidden)
                .map((dataset, index) => (
                <Scatter
                  key={index}
                  name={dataset.label || `Dataset ${index + 1}`}
                  data={dataset.data.map((point: any, i: number) => ({
                    x: typeof point === 'object' ? point.x : i,
                    y: typeof point === 'object' ? point.y : point,
                  }))}
                  fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : "#4f46e5"}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case "bubble":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                type="number"
                dataKey="x" 
                name="X"
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
              />
              <YAxis 
                type="number"
                dataKey="y"
                name="Y"
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
              />
              <ZAxis 
                type="number" 
                dataKey="z" 
                range={[60, 400]} 
                name="Size" 
              />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                formatter={(value, name) => [value, name === 'z' ? 'Size' : name]}
              />
              <Legend content={<CustomLegend />} />
              {item.data.datasets
                .filter(dataset => !dataset.hidden)
                .map((dataset, index) => (
                <Scatter
                  key={index}
                  name={dataset.label || `Dataset ${index + 1}`}
                  data={dataset.data.map((point: any) => ({
                    x: typeof point === 'object' ? point.x : 0,
                    y: typeof point === 'object' ? point.y : point,
                    z: typeof point === 'object' && point.r ? point.r : 10,
                  }))}
                  fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : "#4f46e5"}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData} style={chartStyle}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <PolarRadiusAxis axisLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Legend content={<CustomLegend />} />
              {item.data.datasets
                .filter(dataset => !dataset.hidden)
                .map((dataset, index) => (
                <Radar
                  key={index}
                  name={dataset.label || `Dataset ${index + 1}`}
                  dataKey={dataset.label || `dataset-${index}`}
                  stroke={typeof dataset.borderColor === 'string' ? dataset.borderColor : "#4f46e5"}
                  fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : "#4f46e533"}
                  fillOpacity={0.6}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        );

      case "treemap":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={processedData}
              dataKey={item.data.datasets[0]?.label || "dataset-0"}
              nameKey="name"
              style={chartStyle}
              fill="#4f46e5"
            >
              {processedData.map((entry, index) => {
                const bgColors = item.data.datasets[0]?.backgroundColor;
                const color = Array.isArray(bgColors) ? bgColors[index % bgColors.length] : (bgColors as string || "#4f46e5");
                
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
            </Treemap>
          </ResponsiveContainer>
        );

      case "funnel":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart style={chartStyle}>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Legend content={<CustomLegend />} />
              {item.data.datasets
                .filter(dataset => !dataset.hidden)
                .map((dataset, index) => (
                <Funnel
                  key={index}
                  dataKey={dataset.label || `dataset-${index}`}
                  nameKey="name"
                  data={processedData}
                  isAnimationActive
                >
                  {processedData.map((entry, index) => {
                    const bgColors = dataset.backgroundColor;
                    const color = Array.isArray(bgColors) ? bgColors[index % bgColors.length] : (bgColors as string || "#4f46e5");
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                  <LabelList position="right" dataKey={dataset.label || `dataset-${index}`} />
                </Funnel>
              ))}
            </FunnelChart>
          </ResponsiveContainer>
        );

      case "gauge": 
        // For gauge chart, we'll use a pie chart with specific configuration
        const value = item.data.datasets[0]?.data[0] || 0;
        const max = 100; // Assuming max value is 100 for gauge
        const percentage = typeof value === 'number' ? (value / max) * 100 : 0;
        
        const gaugeData = [
          { name: "value", value: percentage },
          { name: "empty", value: 100 - percentage }
        ];
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={chartStyle}>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="80%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={0}
                dataKey="value"
              >
                <Cell fill={item.data.datasets[0]?.backgroundColor as string || "#4f46e5"} />
                <Cell fill="#E5E7EB" />
              </Pie>
              <text
                x="50%"
                y="85%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                {typeof value === 'number' ? value.toFixed(0) : String(value)}%
              </text>
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '14px' }}
              >
                {item.data.labels[0] || ""}
              </text>
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "table":
        if (!item.data.tableColumns || !item.data.tableRows) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <p>No table data available</p>
              </div>
            </div>
          );
        }
        
        return (
          <div className="h-full w-full overflow-auto p-2">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {item.data.tableColumns
                    .filter(col => col.visible !== false)
                    .map((column) => (
                    <th 
                      key={column.id}
                      className="border border-gray-200 bg-gray-50 p-2 text-sm font-medium text-left"
                      style={{
                        width: column.width ? `${column.width}px` : 'auto',
                        textAlign: column.align || 'left',
                        backgroundColor: column.backgroundColor || undefined
                      }}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.data.tableRows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    style={{ backgroundColor: row._rowColor || undefined }}
                  >
                    {item.data.tableColumns
                      .filter(col => col.visible !== false)
                      .map((column) => (
                      <td 
                        key={`${rowIndex}-${column.id}`}
                        className="border border-gray-200 p-2 text-sm"
                        style={{
                          textAlign: column.align || 'left'
                        }}
                      >
                        {row[column.accessor] !== undefined ? String(row[column.accessor]) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case "text":
        return (
          <div className="h-full w-full p-4 overflow-auto" ref={contentRef}>
            {isEditing ? (
              <TextareaAutosize
                value={item.data.datasets[0]?.label || ""}
                className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
                onChange={(e) => {
                  dispatch({
                    type: "UPDATE_ITEM",
                    payload: {
                      id: item.id,
                      updates: {
                        data: {
                          ...item.data,
                          datasets: [
                            {
                              ...item.data.datasets[0],
                              label: e.target.value,
                            },
                          ],
                        },
                      },
                    },
                  });
                }}
                onBlur={() => setIsEditing(false)}
              />
            ) : (
              <div className="prose max-w-none">
                {item.data.datasets[0]?.label || ""}
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-lg font-semibold mb-2">Chart Type: {item.type}</p>
              <p className="text-muted-foreground">
                This chart type will be supported soon.
              </p>
            </div>
          </div>
        );
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
