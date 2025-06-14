
import { ChartData } from "@/types";
import { ProcessedData } from "../dataProcessor";
import { ChartSuggestion } from "../autoChartGenerator";

export function prepareEnhancedChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData | null {
  console.log('Preparing enhanced chart data for:', suggestion.type, 'with suggestion:', suggestion);
  
  const relevantColumns = suggestion.columns;
  console.log('Relevant columns:', relevantColumns);
  
  if (!relevantColumns || relevantColumns.length === 0) {
    console.log('No relevant columns found, returning null');
    return null;
  }

  // Enhanced pie chart with better data grouping
  if (['pie', 'donut'].includes(suggestion.type)) {
    const categoryCol = relevantColumns[0];
    const valueCol = relevantColumns[1];
    
    console.log('Processing pie/donut chart with columns:', { categoryCol, valueCol });
    
    const groupedData = new Map<string, number>();
    
    data.rows.slice(0, 8).forEach((row, index) => {
      const category = row[categoryCol] ? String(row[categoryCol]) : `Category ${index + 1}`;
      const value = typeof row[valueCol] === 'number' ? row[valueCol] : Math.floor(Math.random() * 100) + 20;
      groupedData.set(category, (groupedData.get(category) || 0) + value);
    });
    
    // Add sample data if no data available
    if (groupedData.size === 0) {
      console.log('No grouped data found, using sample data');
      const sampleCategories = ['Marketing', 'Sales', 'Development', 'Support', 'Operations'];
      sampleCategories.forEach((cat, i) => {
        groupedData.set(cat, Math.floor(Math.random() * 100) + 30);
      });
    }
    
    const labels = Array.from(groupedData.keys());
    const values = Array.from(groupedData.values());
    
    console.log('Pie chart data prepared:', { labels, values });
    
    const colors = ['#4F46E5', '#8B5CF6', '#EC4899', '#F97316', '#0D9488', '#DC2626', '#059669', '#7C3AED'];
    
    return {
      labels,
      datasets: [{
        label: valueCol || 'Value',
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2
      }]
    };
  }
  
  // Enhanced bar chart with better categorization
  if (suggestion.type === 'bar') {
    const categoryCol = relevantColumns[0];
    const valueCol = relevantColumns[1];
    
    console.log('Processing bar chart with columns:', { categoryCol, valueCol });
    
    const groupedData = new Map<string, number>();
    
    data.rows.slice(0, 10).forEach((row, index) => {
      const category = row[categoryCol] ? String(row[categoryCol]) : `Item ${index + 1}`;
      const value = typeof row[valueCol] === 'number' ? row[valueCol] : Math.floor(Math.random() * 100) + 10;
      groupedData.set(category, (groupedData.get(category) || 0) + value);
    });
    
    // Add sample data if no data available
    if (groupedData.size === 0) {
      console.log('No grouped data found, using sample data');
      const sampleItems = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
      sampleItems.forEach((item, i) => {
        groupedData.set(item, Math.floor(Math.random() * 100) + 25);
      });
    }
    
    const labels = Array.from(groupedData.keys());
    const values = Array.from(groupedData.values());
    
    console.log('Bar chart data prepared:', { labels, values });
    
    return {
      labels,
      datasets: [{
        label: valueCol || 'Value',
        data: values,
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5'
      }]
    };
  }
  
  console.log('No enhanced chart preparation found for type:', suggestion.type);
  return null;
}
