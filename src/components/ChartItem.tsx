
import { useState, useEffect, useRef } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { ChartItemType, ChartType, ComplexDataPoint, BoxPlotDataPoint, ChartDataPoint, TableColumnConfig, TableRowData } from "@/types";
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
  Scatter,
  Area,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
  RadialBarChart,
  RadialBar
} from "recharts";
import { X, GripVertical, Copy, Trash2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import chroma from "chroma-js";

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
    if (item.type === "pie" || item.type === "donut" || item.type === "semi-circle") {
      return item.data.labels.map((label, index) => ({
        name: label,
        value: item.data.datasets[0].data[index],
      }));
    }
    
    return item.data.labels.map((label, index) => {
      const dataPoint: any = { name: label };
      
      item.data.datasets.forEach((dataset, datasetIndex) => {
        if (item.type === "scatter" || item.type === "bubble") {
          const point = dataset.data[index] as ComplexDataPoint;
          if (point && typeof point === 'object') {
            dataPoint[dataset.label || `dataset-${datasetIndex}`] = point.y;
            dataPoint.x = point.x;
            if (item.type === "bubble" && 'r' in point) {
              dataPoint.z = point.r;
            }
          }
        } else {
          const dp = dataset.data[index];
          dataPoint[dataset.label || `dataset-${datasetIndex}`] = dp;
        }
      });
      
      return dataPoint;
    });
  };

  const processedData = formattedData();

  // Custom formatter for axis ticks
  const formatAxisTick = (value: any) => {
    if (typeof value === 'string' && value.length > 10) {
      return `${value.substring(0, 8)}...`;
    }
    return value;
  };

  // Custom style for charts
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
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              {item.data.datasets.map((dataset, index) => (
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
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
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
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
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
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "pie":
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
              />
              <Pie
                data={processedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={0}
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
        
      case "donut":
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
              />
              <Pie
                data={processedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="60%"
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
              <XAxis 
                type="number" 
                dataKey="x" 
                name="x"
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="y"
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              {item.data.datasets.map((dataset, index) => (
                <Scatter
                  key={index}
                  name={dataset.label || `dataset-${index}`}
                  data={processedData.map((item) => ({ x: item.x, y: item[dataset.label || `dataset-${index}`] }))}
                  fill={Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] : dataset.backgroundColor || "#4f46e5"}
                  shape={(props) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill={props.fill}
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  )}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case "bubble":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
              <XAxis 
                type="number" 
                dataKey="x" 
                name="x"
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="y" 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              {item.data.datasets.map((dataset, index) => (
                <Scatter
                  key={index}
                  name={dataset.label || `dataset-${index}`}
                  data={processedData.map((item) => ({ 
                    x: item.x, 
                    y: item[dataset.label || `dataset-${index}`],
                    z: item.z || 100
                  }))}
                  fill={Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] : dataset.backgroundColor || "#4f46e5"}
                  shape={(props) => {
                    const size = props.payload.z ? props.payload.z / 10 : 6;
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={size}
                        fill={props.fill}
                        stroke="#fff"
                        strokeWidth={1}
                        fillOpacity={0.8}
                      />
                    )
                  }}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      case "gauge":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }} style={chartStyle}>
              <Pie
                data={[
                  { name: 'Value', value: item.data.datasets[0].data[0] },
                  { name: 'Remaining', value: 100 - (item.data.datasets[0].data[0] as number) }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="80%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={0}
                cornerRadius={5}
                fill="#4f46e5"
              >
                <Cell fill={Array.isArray(item.data.datasets[0].backgroundColor) 
                  ? item.data.datasets[0].backgroundColor[0] 
                  : typeof item.data.datasets[0].backgroundColor === 'string'
                  ? item.data.datasets[0].backgroundColor
                  : "#4f46e5"} />
                <Cell fill="#e5e7eb" />
              </Pie>
              <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {String(item.data.datasets[0].data[0])}%
              </text>
              <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '14px', fill: '#6B7280' }}>
                {item.data.datasets[0].label || 'Current Value'}
              </text>
            </PieChart>
          </ResponsiveContainer>
        );
        
      case "semi-circle":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }} style={chartStyle}>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
                formatter={(value, name) => [`${value} (${((value as number) / processedData.reduce((a, b) => a + (b.value as number), 0) * 100).toFixed(1)}%)`, name]}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "10px" }}
              />
              <Pie
                data={processedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="80%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                fill="#4f46e5"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
        
      case "radar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData} style={chartStyle}>
              <PolarGrid gridType="circle" stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} />
              {item.data.datasets.map((dataset, index) => (
                <Radar
                  key={index}
                  name={dataset.label || `dataset-${index}`}
                  dataKey={dataset.label || `dataset-${index}`}
                  stroke={typeof dataset.borderColor === 'string' ? dataset.borderColor : "#4f46e5"}
                  fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : "#4f46e533"}
                  fillOpacity={0.6}
                  strokeWidth={3}
                />
              ))}
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case "treemap":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={processedData}
              dataKey="value"
              nameKey="name"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#4f46e5"
              style={chartStyle}
            >
              {processedData.map((entry, index) => {
                const bgColors = item.data.datasets[0].backgroundColor;
                const color = Array.isArray(bgColors) ? bgColors[index % bgColors.length] : bgColors;
                return <Cell key={index} fill={color || `#${Math.floor(Math.random() * 16777215).toString(16)}`} />;
              })}
            </Treemap>
          </ResponsiveContainer>
        );
        
      case "funnel":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={processedData.map((d, i) => ({ 
                ...d, 
                value: d.value,
                order: processedData.length - i 
              }))} 
              layout="vertical"
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
              style={chartStyle}
            >
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickLine={false}
              />
              <XAxis type="number" hide />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
              />
              <Bar 
                dataKey="value"
                shape={(props) => {
                  const { x, y, width, height, index } = props;
                  const bgColors = item.data.datasets[0].backgroundColor;
                  const color = Array.isArray(bgColors) ? bgColors[index % bgColors.length] : bgColors || "#4f46e5";
                  
                  const percent = (processedData.length - index) / processedData.length;
                  const sidePadding = 5 + (20 * (1 - percent));
                  
                  return (
                    <path 
                      d={`M ${x + sidePadding},${y} 
                         L ${x + width - sidePadding},${y} 
                         L ${x + width - sidePadding + 10},${y + height} 
                         L ${x + sidePadding - 10},${y + height} Z`} 
                      fill={color}
                    />
                  );
                }}
                label={{
                  position: 'right',
                  content: (props) => {
                    const { x, y, width, height, value } = props;
                    return (
                      <text
                        x={x + width}
                        y={y + height / 2}
                        dy={3}
                        textAnchor="start"
                        fill="#6B7280"
                        fontSize={12}
                      >
                        {value}
                      </text>
                    );
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "table":
        const columns = item.data.tableColumns || [];
        const rows = item.data.tableRows || [];
        
        return (
          <div className="w-full h-full overflow-auto p-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  {columns.map((column, index) => (
                    <th 
                      key={column.id || index} 
                      className={`p-3 border border-gray-200 text-left text-xs font-semibold ${column.align ? `text-${column.align}` : ''}`}
                      style={column.width ? { width: `${column.width}px` } : {}}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    {columns.map((column, colIndex) => (
                      <td 
                        key={`${rowIndex}-${colIndex}`} 
                        className={`p-3 border border-gray-200 text-xs ${column.align ? `text-${column.align}` : ''}`}
                      >
                        {row[column.accessor] !== undefined ? row[column.accessor] : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {(!columns.length || !rows.length) && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No table data available
              </div>
            )}
          </div>
        );
        
      case "text":
        return (
          <div 
            ref={contentRef}
            className="w-full h-full flex items-center justify-center p-4 text-center"
          >
            <TextareaAutosize
              className="w-full h-full text-lg bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-center"
              placeholder="Enter your text here..."
              value={item.data.datasets[0].label || ""}
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
              disabled={previewMode}
            />
          </div>
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
