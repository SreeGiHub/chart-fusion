
import { ChartTemplate } from "./chartTemplates";
import { ProcessedData } from "./dataProcessor";
import { ChartItemType, ChartData } from "@/types";
import { v4 as uuidv4 } from "uuid";

export function createChartsFromTemplates(
  templates: ChartTemplate[], 
  processedData: ProcessedData
): ChartItemType[] {
  return templates.map((template, index) => {
    const chartData = prepareTemplateChartData(template, processedData);
    const position = calculateChartPosition(index);
    
    return {
      id: uuidv4(),
      type: template.chartType,
      title: `${template.title} - ${getDefaultTitle(template, processedData)}`,
      position,
      size: { width: 400, height: 300 },
      data: chartData,
      options: {}
    };
  });
}

function prepareTemplateChartData(template: ChartTemplate, data: ProcessedData): ChartData {
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const textColumns = data.columns.filter(col => col.type === 'text');
  const dateColumns = data.columns.filter(col => col.type === 'date');

  // Special handling for table charts
  if (template.chartType === 'table') {
    const tableColumns = data.columns.slice(0, 6).map((col, index) => ({
      id: col.name.toLowerCase().replace(/\s+/g, '_'),
      header: col.name,
      accessor: col.name.toLowerCase().replace(/\s+/g, '_'),
      align: col.type === 'number' ? 'right' as const : 'left' as const
    }));

    const tableRows = data.rows.slice(0, 15).map(row => {
      const processedRow: Record<string, any> = {};
      data.columns.slice(0, 6).forEach(col => {
        const key = col.name.toLowerCase().replace(/\s+/g, '_');
        let value = row[col.name];
        
        if (col.type === 'number' && typeof value === 'number') {
          value = value.toLocaleString();
        } else if (value === null || value === undefined) {
          value = '-';
        }
        
        processedRow[key] = value;
      });
      return processedRow;
    });

    return {
      labels: [],
      datasets: [],
      tableColumns,
      tableRows
    };
  }

  // Handle card/KPI charts
  if (template.chartType === 'card' || template.chartType === 'multi-row-card') {
    const selectedColumns = numericColumns.slice(0, template.chartType === 'card' ? 1 : 4);
    const labels = selectedColumns.map(col => col.name);
    const values = selectedColumns.map(col => {
      const columnValues = data.rows
        .map(row => parseFloat(String(row[col.name])))
        .filter(val => !isNaN(val));
      
      if (template.calculation === 'sum') {
        return columnValues.reduce((sum, val) => sum + val, 0);
      } else if (template.calculation === 'avg') {
        return columnValues.length > 0 
          ? columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length
          : 0;
      } else if (template.calculation === 'count') {
        return columnValues.length;
      } else if (template.calculation === 'max') {
        return Math.max(...columnValues);
      } else if (template.calculation === 'min') {
        return Math.min(...columnValues);
      }
      return columnValues.length > 0 ? columnValues[0] : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: "Values",
          data: values,
          backgroundColor: "#4F46E5",
        }
      ]
    };
  }

  // Handle pie/donut charts
  if (template.chartType === 'pie' || template.chartType === 'donut' || template.chartType === 'treemap' || template.chartType === 'funnel') {
    const labelColumn = textColumns[0] || data.columns[0];
    const valueColumn = numericColumns[0] || data.columns[1];
    
    if (!labelColumn || !valueColumn) {
      return getDefaultChartData();
    }

    const aggregatedData = aggregateData(data.rows, labelColumn.name, valueColumn.name, template.calculation);
    const labels = Object.keys(aggregatedData).slice(0, 8);
    const values = labels.map(label => aggregatedData[label]);

    return {
      labels,
      datasets: [
        {
          label: valueColumn.name,
          data: values,
          backgroundColor: [
            "#4F46E5", "#8B5CF6", "#EC4899", "#F97316", 
            "#0D9488", "#DC2626", "#059669", "#7C3AED"
          ]
        }
      ]
    };
  }

  // Handle line/area charts (prefer date columns for x-axis)
  if (template.chartType === 'line' || template.chartType === 'area' || template.chartType === 'stacked-area') {
    const xColumn = dateColumns[0] || textColumns[0] || data.columns[0];
    const yColumn = numericColumns[0] || data.columns[1];
    
    if (!xColumn || !yColumn) {
      return getDefaultChartData();
    }

    const sortedData = [...data.rows].sort((a, b) => {
      const aVal = a[xColumn.name];
      const bVal = b[xColumn.name];
      if (xColumn.type === 'date') {
        return new Date(aVal).getTime() - new Date(bVal).getTime();
      }
      return String(aVal).localeCompare(String(bVal));
    });

    const labels = sortedData.slice(0, 12).map(row => String(row[xColumn.name]));
    const values = sortedData.slice(0, 12).map(row => {
      const val = parseFloat(String(row[yColumn.name]));
      return isNaN(val) ? 0 : val;
    });

    return {
      labels,
      datasets: [
        {
          label: yColumn.name,
          data: values,
          backgroundColor: template.chartType === 'area' ? "#8884d8" : undefined,
          borderColor: "#8884d8",
          borderWidth: 2,
          fill: template.chartType === 'area'
        }
      ]
    };
  }

  // Handle scatter/bubble charts
  if (template.chartType === 'scatter' || template.chartType === 'bubble') {
    const xColumn = numericColumns[0] || data.columns[0];
    const yColumn = numericColumns[1] || data.columns[1];
    
    if (!xColumn || !yColumn) {
      return getDefaultChartData();
    }

    const points = data.rows.slice(0, 20).map(row => ({
      x: parseFloat(String(row[xColumn.name])) || 0,
      y: parseFloat(String(row[yColumn.name])) || 0
    }));

    return {
      labels: [],
      datasets: [
        {
          label: `${xColumn.name} vs ${yColumn.name}`,
          data: points,
          backgroundColor: "#8884d8",
          borderColor: "#8884d8"
        }
      ]
    };
  }

  // Default handling for bar/column charts
  const xColumn = textColumns[0] || data.columns[0];
  const yColumn = numericColumns[0] || data.columns[1];
  
  if (!xColumn || !yColumn) {
    return getDefaultChartData();
  }

  const aggregatedData = aggregateData(data.rows, xColumn.name, yColumn.name, template.calculation);
  const labels = Object.keys(aggregatedData).slice(0, 10);
  const values = labels.map(label => aggregatedData[label]);

  return {
    labels,
    datasets: [
      {
        label: yColumn.name,
        data: values,
        backgroundColor: "#8884d8",
        borderColor: "#8884d8",
        borderWidth: 1
      }
    ]
  };
}

function aggregateData(rows: any[], labelColumn: string, valueColumn: string, calculation: string): Record<string, number> {
  const grouped: Record<string, number[]> = {};
  
  rows.forEach(row => {
    const label = String(row[labelColumn]);
    const value = parseFloat(String(row[valueColumn]));
    
    if (!isNaN(value)) {
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(value);
    }
  });

  const result: Record<string, number> = {};
  
  Object.keys(grouped).forEach(label => {
    const values = grouped[label];
    
    switch (calculation) {
      case 'sum':
        result[label] = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'avg':
        result[label] = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'count':
        result[label] = values.length;
        break;
      case 'max':
        result[label] = Math.max(...values);
        break;
      case 'min':
        result[label] = Math.min(...values);
        break;
      default:
        result[label] = values[0] || 0;
    }
  });

  return result;
}

function calculateChartPosition(index: number): { x: number; y: number } {
  const gridSize = 450;
  const row = Math.floor(index / 3);
  const col = index % 3;
  
  return {
    x: 50 + (col * gridSize),
    y: 50 + (row * 350)
  };
}

function getDefaultTitle(template: ChartTemplate, data: ProcessedData): string {
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const textColumns = data.columns.filter(col => col.type === 'text');
  
  if (template.chartType === 'table') {
    return 'Data Overview';
  }
  
  if (template.chartType === 'card' || template.chartType === 'multi-row-card') {
    return numericColumns[0]?.name || 'Metrics';
  }
  
  if (template.chartType === 'pie' || template.chartType === 'donut') {
    const labelCol = textColumns[0]?.name || 'Categories';
    const valueCol = numericColumns[0]?.name || 'Values';
    return `${valueCol} by ${labelCol}`;
  }
  
  const xCol = textColumns[0]?.name || data.columns[0]?.name || 'X';
  const yCol = numericColumns[0]?.name || data.columns[1]?.name || 'Y';
  return `${yCol} by ${xCol}`;
}

function getDefaultChartData(): ChartData {
  return {
    labels: ["No Data"],
    datasets: [
      {
        label: "No Data",
        data: [0],
        backgroundColor: "#E5E7EB"
      }
    ]
  };
}
