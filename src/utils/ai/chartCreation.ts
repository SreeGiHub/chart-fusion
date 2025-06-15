
import { ChartItemType, Position } from "@/types";
import { createNewChartItem } from "@/utils/chartUtils";
import { ProcessedData } from "@/utils/dataProcessor";
import { prepareChartData } from "@/utils/chartData";
import { v4 as uuidv4 } from "uuid";
import { AIChartSuggestion } from "./types";

export function createAIChartsFromData(
  data: ProcessedData, 
  suggestions: AIChartSuggestion[], 
  startPosition: Position = { x: 50, y: 50 }
): ChartItemType[] {
  console.log('\n=== CREATING STORY-DRIVEN CHARTS FROM AI SUGGESTIONS ===');
  console.log('📊 Input data overview:', {
    rows: data.rows.length,
    columns: data.columns.map(col => `${col.name} (${col.type})`),
    suggestionsCount: suggestions.length,
    dataQuality: analyzeDataQuality(data)
  });
  
  console.log('🎯 AI suggestions for dashboard story:', suggestions.map(s => ({ 
    type: s.type, 
    title: s.title, 
    priority: s.priority,
    columns: s.columns,
    insight: s.businessInsight || s.description
  })));
  
  const charts: ChartItemType[] = [];
  
  // Enhanced 3-column grid layout with better spacing for professional dashboards
  const GRID_COLUMNS = 3;
  const CHART_WIDTH = 420;
  const CHART_HEIGHT = 320;
  const HORIZONTAL_GAP = 30;
  const VERTICAL_GAP = 40;
  
  // Sort suggestions by priority and business impact
  const sortedSuggestions = suggestions
    .sort((a, b) => (b.priority || 5) - (a.priority || 5))
    .slice(0, 9); // Limit to 9 charts for optimal layout
  
  console.log('📋 Creating charts in priority order:', sortedSuggestions.map(s => `${s.priority}: ${s.title}`));
  
  sortedSuggestions.forEach((suggestion, index) => {
    console.log(`\n📈 Creating chart ${index + 1}/${sortedSuggestions.length}:`, {
      type: suggestion.type,
      title: suggestion.title,
      priority: suggestion.priority,
      columns: suggestion.columns,
      businessContext: suggestion.businessInsight
    });
    
    // Calculate responsive grid position
    const row = Math.floor(index / GRID_COLUMNS);
    const col = index % GRID_COLUMNS;
    
    const position = {
      x: startPosition.x + (col * (CHART_WIDTH + HORIZONTAL_GAP)),
      y: startPosition.y + (row * (CHART_HEIGHT + VERTICAL_GAP))
    };
    
    console.log(`📍 Chart position: row=${row}, col=${col}, position=(${position.x}, ${position.y})`);
    
    try {
      console.log('🔄 Preparing enhanced chart data with business context...');
      
      // Validate columns exist and provide intelligent fallbacks
      const validatedColumns = validateAndOptimizeColumns(data, suggestion);
      console.log('✅ Validated columns:', validatedColumns);
      
      // Prepare chart data with validated columns
      const chartData = prepareChartData(data, {
        type: suggestion.type,
        title: suggestion.title,
        description: suggestion.description,
        columns: validatedColumns,
        priority: suggestion.priority || 5
      });
      
      console.log('✅ Chart data prepared:', {
        labels: chartData.labels?.slice(0, 3),
        datasetCount: chartData.datasets?.length,
        firstDatasetLength: chartData.datasets?.[0]?.data?.length,
        dataPreview: chartData.datasets?.[0]?.data?.slice(0, 3),
        tableData: chartData.tableRows ? `${chartData.tableRows.length} rows` : 'N/A'
      });
      
      // Create chart item with enhanced configuration
      const chart = createNewChartItem(suggestion.type, position);
      
      // Set dynamic sizing based on chart type and importance
      const chartSize = calculateOptimalChartSize(suggestion.type, suggestion.priority || 5);
      chart.size = chartSize;
      chart.title = suggestion.title;
      chart.data = chartData;
      chart.id = uuidv4();
      
      // Enhanced chart options for professional appearance
      chart.options = {
        ...chart.options,
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          ...chart.options?.plugins,
          legend: {
            display: !['card', 'gauge', 'table', 'multi-row-card'].includes(suggestion.type),
            position: 'top',
            labels: {
              font: {
                size: 11,
                weight: 'normal'
              },
              padding: 15,
              usePointStyle: true,
              boxWidth: 10,
              generateLabels: (chart: any) => {
                const original = chart.data.datasets.map((dataset: any, i: number) => ({
                  text: dataset.label || `Series ${i + 1}`,
                  fillStyle: dataset.backgroundColor || dataset.borderColor,
                  hidden: false,
                  index: i
                }));
                return original;
              }
            }
          },
          title: {
            display: true,
            text: chart.title,
            font: {
              size: 14,
              weight: 'bold'
            },
            color: '#1f2937',
            padding: {
              top: 15,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#374151',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: (context: any) => {
                return context[0]?.label || 'Data Point';
              },
              label: (context: any) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y ?? context.parsed;
                return `${label}: ${formatValue(value)}`;
              }
            }
          }
        },
        scales: shouldShowScales(suggestion.type) ? {
          x: {
            display: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.06)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 10
              },
              color: '#6b7280',
              maxRotation: 45,
              minRotation: 0,
              callback: function(value: any, index: number) {
                const label = this.getLabelForValue(value);
                return truncateLabel(label, 12);
              }
            },
            title: {
              display: validatedColumns.length > 0,
              text: validatedColumns[0] || '',
              font: {
                size: 11,
                weight: 'bold'
              },
              color: '#374151'
            }
          },
          y: {
            display: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.06)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 10
              },
              color: '#6b7280',
              callback: function(value: any) {
                return formatValue(value);
              }
            },
            title: {
              display: validatedColumns.length > 1,
              text: validatedColumns[1] || '',
              font: {
                size: 11,
                weight: 'bold'
              },
              color: '#374151'
            }
          }
        } : undefined
      };
      
      console.log(`✅ Successfully created business chart: ${chart.title}`, {
        type: chart.type,
        priority: suggestion.priority,
        position: chart.position,
        size: chart.size,
        dataQuality: `${chart.data.datasets?.[0]?.data?.length || 0} data points`,
        businessInsight: suggestion.businessInsight || 'Strategic business visualization',
        actualColumns: validatedColumns
      });
      
      charts.push(chart);
    } catch (error) {
      console.error(`❌ Error creating business chart ${suggestion.type}:`, error);
      
      // Create intelligent fallback chart with business context
      try {
        const fallbackChart = createIntelligentFallback(suggestion, data, position, index);
        charts.push(fallbackChart);
        console.log('⚠️ Created intelligent fallback chart with business context');
      } catch (fallbackError) {
        console.error('❌ Failed to create intelligent fallback chart:', fallbackError);
      }
    }
  });
  
  console.log(`\n🎉 Created ${charts.length} business-focused charts with professional layout`);
  console.log('📊 Dashboard story summary:', {
    totalCharts: charts.length,
    chartTypes: [...new Set(charts.map(c => c.type))],
    positions: charts.map(chart => ({
      title: chart.title,
      position: chart.position,
      size: chart.size
    })),
    businessValue: 'Comprehensive dashboard telling data-driven business story'
  });
  
  return charts;
}

function validateAndOptimizeColumns(data: ProcessedData, suggestion: AIChartSuggestion): string[] {
  const availableColumns = data.columns.map(col => col.name);
  
  // Validate suggested columns exist
  const validColumns = suggestion.columns.filter(colName => 
    availableColumns.includes(colName)
  );
  
  if (validColumns.length > 0) {
    console.log('✅ Using validated columns:', validColumns);
    return validColumns;
  }
  
  // Intelligent fallback based on chart type and data structure
  console.log('⚠️ No valid columns found, generating intelligent fallback');
  
  const numericCols = data.columns.filter(col => col.type === 'number');
  const textCols = data.columns.filter(col => col.type === 'text');
  const dateCols = data.columns.filter(col => col.type === 'date');
  
  switch (suggestion.type) {
    case 'multi-row-card':
    case 'card':
    case 'gauge':
      return numericCols.length > 0 ? [numericCols[0].name] : [availableColumns[0]];
      
    case 'table':
      return availableColumns.slice(0, 6);
      
    case 'pie':
    case 'donut':
    case 'funnel':
      if (textCols.length > 0 && numericCols.length > 0) {
        return [textCols[0].name, numericCols[0].name];
      }
      break;
      
    case 'line':
    case 'area':
      if (dateCols.length > 0 && numericCols.length > 0) {
        return [dateCols[0].name, numericCols[0].name];
      }
      if (textCols.length > 0 && numericCols.length > 0) {
        return [textCols[0].name, numericCols[0].name];
      }
      break;
      
    case 'scatter':
      if (numericCols.length >= 2) {
        return [numericCols[0].name, numericCols[1].name];
      }
      break;
      
    case 'stacked-bar':
    case 'stacked-column':
      if (textCols.length > 0 && numericCols.length >= 2) {
        return [textCols[0].name, numericCols[0].name, numericCols[1].name];
      }
      break;
      
    default:
      if (textCols.length > 0 && numericCols.length > 0) {
        return [textCols[0].name, numericCols[0].name];
      }
  }
  
  // Ultimate fallback
  return availableColumns.slice(0, Math.min(2, availableColumns.length));
}

function calculateOptimalChartSize(chartType: string, priority: number): { width: number; height: number } {
  const baseSizes = {
    'multi-row-card': { width: 450, height: 280 },
    'table': { width: 500, height: 350 },
    'card': { width: 200, height: 150 },
    'gauge': { width: 250, height: 200 },
    'pie': { width: 350, height: 300 },
    'donut': { width: 350, height: 300 },
    'funnel': { width: 300, height: 250 },
    'default': { width: 420, height: 320 }
  };
  
  const size = baseSizes[chartType as keyof typeof baseSizes] || baseSizes.default;
  
  // Adjust size based on priority (higher priority = slightly larger)
  const priorityMultiplier = priority >= 8 ? 1.1 : priority >= 6 ? 1.0 : 0.9;
  
  return {
    width: Math.round(size.width * priorityMultiplier),
    height: Math.round(size.height * priorityMultiplier)
  };
}

function shouldShowScales(chartType: string): boolean {
  const noScalesTypes = ['pie', 'donut', 'funnel', 'card', 'gauge', 'multi-row-card', 'table'];
  return !noScalesTypes.includes(chartType);
}

function formatValue(value: any): string {
  if (typeof value !== 'number') return String(value);
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else if (value % 1 === 0) {
    return value.toLocaleString();
  } else {
    return value.toFixed(1);
  }
}

function truncateLabel(label: string, maxLength: number): string {
  if (!label || typeof label !== 'string') return 'N/A';
  return label.length > maxLength ? label.substring(0, maxLength - 3) + '...' : label;
}

function analyzeDataQuality(data: ProcessedData): string {
  const totalCells = data.rows.length * data.columns.length;
  const emptyCells = data.rows.reduce((count, row) => {
    return count + data.columns.filter(col => 
      row[col.name] === null || row[col.name] === undefined || row[col.name] === ''
    ).length;
  }, 0);
  
  const completeness = ((totalCells - emptyCells) / totalCells * 100).toFixed(1);
  return `${completeness}% complete, ${data.rows.length} records, ${data.columns.length} attributes`;
}

function createIntelligentFallback(
  suggestion: AIChartSuggestion, 
  data: ProcessedData, 
  position: Position, 
  index: number
): ChartItemType {
  const fallbackChart = createNewChartItem('bar', position);
  fallbackChart.title = suggestion.title || `Business Insight ${index + 1}`;
  fallbackChart.size = { width: 420, height: 320 };
  fallbackChart.id = uuidv4();
  
  // Create meaningful fallback data based on business context
  const numericCols = data.columns.filter(col => col.type === 'number');
  const textCols = data.columns.filter(col => col.type === 'text');
  
  if (numericCols.length > 0) {
    const targetCol = numericCols[0];
    const categoryCol = textCols.length > 0 ? textCols[0] : null;
    
    if (categoryCol) {
      // Group data by category
      const groupedData = new Map<string, number>();
      data.rows.forEach(row => {
        const category = String(row[categoryCol.name] || 'Unknown');
        const value = parseFloat(String(row[targetCol.name] || 0));
        groupedData.set(category, (groupedData.get(category) || 0) + (isNaN(value) ? 0 : value));
      });
      
      const sortedEntries = Array.from(groupedData.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      fallbackChart.data = {
        labels: sortedEntries.map(([label]) => label),
        datasets: [{
          label: targetCol.name,
          data: sortedEntries.map(([, value]) => value),
          backgroundColor: '#4F46E5'
        }]
      };
    } else {
      // Single metric summary
      const values = data.rows
        .map(row => parseFloat(String(row[targetCol.name] || 0)))
        .filter(val => !isNaN(val));
      
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = values.length > 0 ? sum / values.length : 0;
      
      fallbackChart.data = {
        labels: ['Total', 'Average', 'Records'],
        datasets: [{
          label: 'Business Metrics',
          data: [sum, avg, data.rows.length],
          backgroundColor: ['#4F46E5', '#8B5CF6', '#EC4899']
        }]
      };
    }
  } else {
    // Count-based fallback
    fallbackChart.data = {
      labels: ['Total Records', 'Columns', 'Data Points'],
      datasets: [{
        label: 'Data Summary',
        data: [data.rows.length, data.columns.length, data.rows.length * data.columns.length],
        backgroundColor: '#4F46E5'
      }]
    };
  }
  
  return fallbackChart;
}
