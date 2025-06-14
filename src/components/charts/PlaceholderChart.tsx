
import React from 'react';
import { ChartType } from '@/types';

interface PlaceholderChartProps {
  type: ChartType;
  title?: string;
}

const PlaceholderChart: React.FC<PlaceholderChartProps> = ({ type, title }) => {
  const getIcon = () => {
    switch (type) {
      case 'gantt':
        return '📊';
      case 'matrix':
        return '🔢';
      case 'slicer':
        return '🔍';
      case 'filled-map':
        return '🗺️';
      case 'heatmap':
        return '🌡️';
      case 'word-cloud':
        return '☁️';
      case 'timeline':
        return '⏰';
      default:
        return '📈';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'gantt':
        return 'Project timeline and task management visualization';
      case 'matrix':
        return 'Data matrix with rows and columns correlation';
      case 'slicer':
        return 'Interactive filter for data selection';
      case 'filled-map':
        return 'Geographic regions filled with data values';
      case 'heatmap':
        return 'Color-coded data intensity visualization';
      case 'word-cloud':
        return 'Text frequency visualization';
      case 'timeline':
        return 'Chronological events and milestones';
      default:
        return 'Advanced chart visualization';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
      <div className="text-6xl mb-4">{getIcon()}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2 capitalize">
        {title || type.replace('-', ' ')}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        {getDescription()}
      </p>
      <div className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
        Chart Type: {type}
      </div>
    </div>
  );
};

export default PlaceholderChart;
