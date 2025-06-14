
import React from 'react';
import { ChartItemType } from '@/types';
import BarChart from './BarChart';
import LineChart from './LineChart';
import AreaChart from './AreaChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';
import ComboChart from './ComboChart';
import CardChart from './CardChart';
import RadarChart from './RadarChart';
import TreemapChart from './TreemapChart';
import FunnelChart from './FunnelChart';
import GaugeChart from './GaugeChart';
import TextChart from './TextChart';
import TableChart from './TableChart';
import { useDashboard } from '@/context/DashboardContext';

interface ChartRendererProps {
  item: ChartItemType;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ item }) => {
  const { state, dispatch } = useDashboard();
  const isSelected = state.selectedItemId === item.id;

  switch (item.type) {
    case "bar":
    case "column":
    case "stacked-bar":
    case "histogram":
      return <BarChart item={item} />;
      
    case "line":
      return <LineChart item={item} />;
      
    case "area":
    case "stacked-area":
      return <AreaChart item={item} />;
      
    case "pie":
    case "donut":
      return <PieChart item={item} />;
      
    case "scatter":
    case "bubble":
      return <ScatterChart item={item} />;
      
    case "combo":
      return <ComboChart item={item} />;
      
    case "card":
    case "multi-row-card":
      return <CardChart item={item} />;
      
    case "radar":
      return <RadarChart item={item} />;
      
    case "treemap":
      return <TreemapChart item={item} />;
      
    case "funnel":
      return <FunnelChart item={item} />;
      
    case "gauge":
    case "semi-circle":
      return <GaugeChart item={item} />;
      
    case "text":
      return <TextChart item={item} isSelected={isSelected} />;
      
    case "table":
      return (
        <TableChart 
          data={item.data} 
          onDataUpdate={(newData) => {
            dispatch({
              type: "UPDATE_ITEM",
              payload: {
                id: item.id,
                updates: { data: newData },
              },
            });
          }}
        />
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

export default ChartRenderer;
