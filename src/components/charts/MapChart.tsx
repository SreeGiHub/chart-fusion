
import React from 'react';
import { ChartData } from '@/types';

interface MapChartProps {
  data: ChartData;
}

const MapChart: React.FC<MapChartProps> = ({ data }) => {
  // Sample Indian states data
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-blue-50">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">India Map</h3>
        <p className="text-sm text-gray-500">Interactive map visualization</p>
      </div>
      
      {/* Simplified India map representation */}
      <div className="relative w-80 h-80 bg-green-100 rounded-lg border-2 border-green-300 shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🇮🇳</div>
            <div className="text-sm font-medium text-gray-700">India</div>
            <div className="text-xs text-gray-500">Click to drill down to states</div>
          </div>
        </div>
        
        {/* Sample data points */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse" title="Delhi"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse" title="Mumbai"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Bangalore"></div>
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" title="Chennai"></div>
      </div>
      
      {/* States list */}
      <div className="mt-4 max-h-32 overflow-y-auto w-full max-w-md">
        <div className="grid grid-cols-2 gap-1 text-xs">
          {states.map((state, index) => (
            <div key={state} className="p-1 bg-white rounded border hover:bg-blue-50 cursor-pointer">
              {state}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapChart;
