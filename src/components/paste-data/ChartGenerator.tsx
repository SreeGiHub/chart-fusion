
import React from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { ProcessedData, validateData } from "@/utils/dataProcessor";
import { generateAIChartSuggestions, createAIChartsFromData } from "@/utils/aiChartGenerator";
import { useDashboard } from "@/context/DashboardContext";

interface ChartGeneratorProps {
  processedData: ProcessedData | null;
  geminiApiKey: string;
  onComplete: () => void;
}

export const useChartGenerator = () => {
  const { state, dispatch } = useDashboard();

  const getNextPosition = (index: number) => {
    const existingItems = state.items;
    const totalItems = existingItems.length + index;
    
    // Create a grid layout to avoid overlapping
    const gridSize = 450; // Chart width + spacing
    const row = Math.floor(totalItems / 3);
    const col = totalItems % 3;
    
    return {
      x: 50 + (col * gridSize),
      y: 50 + (row * 350) // Chart height + spacing
    };
  };

  const generateCharts = async (processedData: ProcessedData, geminiApiKey: string, onComplete: () => void) => {
    if (!processedData) {
      console.error('No processed data available');
      return;
    }

    console.log('Starting AI-powered chart generation with enhanced data context:', processedData);
    
    const validation = validateData(processedData);
    if (!validation.isValid) {
      console.error('Validation failed:', validation);
      toast.error("Please fix data errors before generating charts");
      return;
    }

    try {
      console.log('Generating AI chart suggestions with rich column descriptions...');
      const suggestions = await generateAIChartSuggestions(processedData, geminiApiKey);
      console.log('Generated suggestions:', suggestions);
      
      if (suggestions.length === 0) {
        console.log('No suggestions found, creating default charts');
        const defaultSuggestions = [
          {
            type: 'bar' as const,
            columns: processedData.columns.slice(0, 2).map(col => col.name),
            title: 'Data Overview',
            description: 'Bar chart showing your data',
            priority: 1
          }
        ];
        
        const charts = createAIChartsFromData(processedData, defaultSuggestions);
        console.log('Created default charts:', charts);
        
        charts.forEach((chart, index) => {
          const position = getNextPosition(index);
          const chartWithPosition = { ...chart, position };
          console.log('Adding chart to dashboard:', chartWithPosition);
          dispatch({ type: "ADD_ITEM", payload: chartWithPosition });
        });
        
        toast.success("Generated 1 chart from your data! 🎉");
      } else {
        console.log('Creating charts from AI suggestions with enhanced context...');
        const charts = createAIChartsFromData(processedData, suggestions);
        console.log('Created charts:', charts);
        
        // Add charts to dashboard with proper positioning
        charts.forEach((chart, index) => {
          const position = getNextPosition(index);
          const chartWithPosition = { ...chart, position };
          console.log('Adding chart to dashboard:', chartWithPosition);
          dispatch({ type: "ADD_ITEM", payload: chartWithPosition });
        });

        const aiMessage = geminiApiKey ? 
          `Generated ${charts.length} AI-enhanced charts with intelligent insights from your rich data context! 🤖✨` :
          `Generated ${charts.length} charts from your data! 🎉`;

        toast.success(
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>{aiMessage}</span>
          </div>
        );
      }
      
      onComplete();
    } catch (error) {
      console.error("Chart generation error:", error);
      toast.error("Failed to generate charts. Please try again.");
    }
  };

  return { generateCharts };
};
