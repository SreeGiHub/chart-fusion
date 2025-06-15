
import { ChartData } from "@/types";
import { ProcessedData } from "../../dataProcessor";
import { ChartSuggestion } from "../../autoChartGenerator";

export function preparePieChartData(data: ProcessedData, suggestion: ChartSuggestion): ChartData {
  const relevantColumns = suggestion.columns;
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
      borderWidth: 2,
      borderColor: '#FFFFFF'
    }]
  };
}
