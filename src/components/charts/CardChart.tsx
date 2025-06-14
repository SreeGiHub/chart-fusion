
import React from 'react';
import { ChartItemType } from '@/types';

interface CardChartProps {
  item: ChartItemType;
}

const CardChart: React.FC<CardChartProps> = ({ item }) => {
  if (item.type === "multi-row-card") {
    return (
      <div className="h-full w-full p-4 space-y-3">
        {item.data.labels.map((label, index) => {
          const value = item.data.datasets[0]?.data[index];
          const change = item.data.datasets[1]?.data[index];
          return (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : String(value)}
                </div>
              </div>
              {change !== undefined && (
                <div className={`text-sm font-medium ${Number(change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(change) >= 0 ? '+' : ''}{change}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Regular card
  const cardValue = item.data.datasets[0]?.data[0] || 0;
  const cardTitle = item.data.labels[0] || "Value";
  const cardChange = item.data.datasets[0]?.data[1] || null;
  
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-600 mb-2">{cardTitle}</h3>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {typeof cardValue === 'number' ? cardValue.toLocaleString() : String(cardValue)}
        </div>
        {cardChange !== null && (
          <div className={`text-sm font-medium ${Number(cardChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Number(cardChange) >= 0 ? '+' : ''}{cardChange}%
          </div>
        )}
      </div>
    </div>
  );
};

export default CardChart;
