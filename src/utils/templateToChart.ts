
import { ChartTemplate } from "./chartTemplates";
import { ProcessedData } from "./dataProcessor";
import { ChartItemType, ChartData, Position } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const convertTemplateToChart = (
  template: ChartTemplate,
  processedData: ProcessedData,
  position: Position
): ChartItemType => {
  console.log('🔄 Converting template to chart:', {
    template: template.id,
    chartType: template.chartType,
    dataRows: processedData.rows.length,
    dataColumns: processedData.columns.length
  });

  const chartData = createChartDataFromTemplate(template, processedData);
  
  return {
    id: uuidv4(),
    type: template.chartType,
    title: template.title,
    position,
    size: getDefaultSize(template.chartType),
    data: chartData,
  };
};

const createChartDataFromTemplate = (template: ChartTemplate, processedData: ProcessedData): ChartData => {
  const { chartType, dataMapping, calculation } = template;
  
  // Handle table charts
  if (chartType === 'table') {
    return createTableData(processedData);
  }
  
  // Handle card/KPI charts
  if (chartType === 'card' || chartType === 'multi-row-card') {
    return createCardData(template, processedData);
  }
  
  // Handle pie/donut charts
  if (chartType === 'pie' || chartType === 'donut') {
    return createPieData(template, processedData);
  }
  
  // Handle other chart types (bar, line, area, etc.)
  return createStandardChartData(template, processedData);
};

const createTableData = (processedData: ProcessedData): ChartData => {
  const tableColumns = processedData.columns.map(col => ({
    id: col.name,
    header: col.name,
    accessor: col.name,
    align: col.type === 'number' ? 'right' as const : 'left' as const
  }));
  
  return {
    labels: [],
    datasets: [],
    tableColumns,
    tableRows: processedData.rows.slice(0, 100) // Limit to 100 rows as requested
  };
};

const createCardData = (template: ChartTemplate, processedData: ProcessedData): ChartData => {
  const valueColumn = findColumn(template.dataMapping.valueColumn, processedData, 'number');
  
  if (!valueColumn) {
    return {
      labels: [],
      datasets: [],
      value: 0,
      label: 'No Data'
    };
  }
  
  const values = processedData.rows
    .map(row => parseFloat(row[valueColumn.name]) || 0)
    .filter(val => !isNaN(val));
  
  let calculatedValue = 0;
  switch (template.calculation) {
    case 'sum':
      calculatedValue = values.reduce((sum, val) => sum + val, 0);
      break;
    case 'avg':
      calculatedValue = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      break;
    case 'count':
      calculatedValue = values.length;
      break;
    case 'max':
      calculatedValue = Math.max(...values);
      break;
    case 'min':
      calculatedValue = Math.min(...values);
      break;
    default:
      calculatedValue = values.reduce((sum, val) => sum + val, 0);
  }
  
  return {
    labels: [],
    datasets: [],
    value: calculatedValue,
    label: valueColumn.name
  };
};

const createPieData = (template: ChartTemplate, processedData: ProcessedData): ChartData => {
  const labelColumn = findColumn(template.dataMapping.labelColumn, processedData, 'string');
  const valueColumn = findColumn(template.dataMapping.valueColumn, processedData, 'number');
  
  if (!labelColumn || !valueColumn) {
    return {
      labels: ['No Data'],
      datasets: [{
        label: 'Data',
        data: [1],
        backgroundColor: ['#8884d8'],
        borderColor: ['#8884d8'],
        borderWidth: 2
      }]
    };
  }
  
  // Group and aggregate data
  const groupedData = new Map<string, number>();
  
  processedData.rows.forEach(row => {
    const label = row[labelColumn.name]?.toString() || 'Unknown';
    const value = parseFloat(row[valueColumn.name]) || 0;
    
    if (template.calculation === 'sum') {
      groupedData.set(label, (groupedData.get(label) || 0) + value);
    } else if (template.calculation === 'count') {
      groupedData.set(label, (groupedData.get(label) || 0) + 1);
    } else {
      groupedData.set(label, value);
    }
  });
  
  const labels = Array.from(groupedData.keys());
  const data = Array.from(groupedData.values());
  const colors = generateColors(labels.length);
  
  return {
    labels,
    datasets: [{
      label: valueColumn.name,
      data,
      backgroundColor: colors,
      borderColor: colors,
      borderWidth: 2
    }]
  };
};

const createStandardChartData = (template: ChartTemplate, processedData: ProcessedData): ChartData => {
  const xColumn = findColumn(template.dataMapping.xAxis, processedData);
  const yColumn = findColumn(template.dataMapping.yAxis, processedData, 'number');
  const groupColumn = findColumn(template.dataMapping.groupBy, processedData, 'string');
  
  if (!xColumn || !yColumn) {
    return {
      labels: ['No Data'],
      datasets: [{
        label: 'Dataset 1',
        data: [0],
        backgroundColor: '#8884d8',
        borderColor: '#8884d8',
        borderWidth: 2
      }]
    };
  }
  
  if (groupColumn) {
    return createGroupedChartData(xColumn, yColumn, groupColumn, processedData, template.calculation);
  } else {
    return createSimpleChartData(xColumn, yColumn, processedData, template.calculation);
  }
};

const createSimpleChartData = (xColumn: any, yColumn: any, processedData: ProcessedData, calculation: string): ChartData => {
  const dataMap = new Map<string, number[]>();
  
  processedData.rows.forEach(row => {
    const xValue = row[xColumn.name]?.toString() || 'Unknown';
    const yValue = parseFloat(row[yColumn.name]) || 0;
    
    if (!dataMap.has(xValue)) {
      dataMap.set(xValue, []);
    }
    dataMap.get(xValue)!.push(yValue);
  });
  
  const labels = Array.from(dataMap.keys());
  const data = labels.map(label => {
    const values = dataMap.get(label)!;
    switch (calculation) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'avg':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'count':
        return values.length;
      case 'max':
        return Math.max(...values);
      case 'min':
        return Math.min(...values);
      default:
        return values[0] || 0;
    }
  });
  
  return {
    labels,
    datasets: [{
      label: yColumn.name,
      data,
      backgroundColor: '#8884d8',
      borderColor: '#8884d8',
      borderWidth: 2
    }]
  };
};

const createGroupedChartData = (xColumn: any, yColumn: any, groupColumn: any, processedData: ProcessedData, calculation: string): ChartData => {
  const groupedData = new Map<string, Map<string, number[]>>();
  
  processedData.rows.forEach(row => {
    const xValue = row[xColumn.name]?.toString() || 'Unknown';
    const yValue = parseFloat(row[yColumn.name]) || 0;
    const groupValue = row[groupColumn.name]?.toString() || 'Unknown';
    
    if (!groupedData.has(groupValue)) {
      groupedData.set(groupValue, new Map());
    }
    if (!groupedData.get(groupValue)!.has(xValue)) {
      groupedData.get(groupValue)!.set(xValue, []);
    }
    groupedData.get(groupValue)!.get(xValue)!.push(yValue);
  });
  
  const allXValues = new Set<string>();
  groupedData.forEach(groupMap => {
    groupMap.forEach((_, xValue) => allXValues.add(xValue));
  });
  
  const labels = Array.from(allXValues);
  const colors = generateColors(groupedData.size);
  
  const datasets = Array.from(groupedData.entries()).map(([groupName, groupMap], index) => {
    const data = labels.map(label => {
      const values = groupMap.get(label) || [];
      switch (calculation) {
        case 'sum':
          return values.reduce((sum, val) => sum + val, 0);
        case 'avg':
          return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
        case 'count':
          return values.length;
        case 'max':
          return values.length > 0 ? Math.max(...values) : 0;
        case 'min':
          return values.length > 0 ? Math.min(...values) : 0;
        default:
          return values[0] || 0;
      }
    });
    
    return {
      label: groupName,
      data,
      backgroundColor: colors[index],
      borderColor: colors[index],
      borderWidth: 2
    };
  });
  
  return { labels, datasets };
};

const findColumn = (columnName: string | undefined, processedData: ProcessedData, preferredType?: string) => {
  if (columnName && columnName !== 'auto') {
    return processedData.columns.find(col => col.name === columnName);
  }
  
  // Auto-detect column based on type
  if (preferredType === 'number') {
    return processedData.columns.find(col => col.type === 'number');
  } else if (preferredType === 'string') {
    return processedData.columns.find(col => col.type === 'string');
  }
  
  // Return first available column
  return processedData.columns[0];
};

const generateColors = (count: number): string[] => {
  const baseColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1',
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

const getDefaultSize = (chartType: string) => {
  switch (chartType) {
    case 'card':
      return { width: 200, height: 120 };
    case 'multi-row-card':
      return { width: 250, height: 180 };
    case 'table':
      return { width: 500, height: 300 };
    default:
      return { width: 400, height: 300 };
  }
};
