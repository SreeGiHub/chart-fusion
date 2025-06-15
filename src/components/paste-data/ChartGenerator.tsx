
import React from "react";
import { toast } from "sonner";
import { Sparkles, RefreshCw } from "lucide-react";
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

  const generateCharts = async (
    processedData: ProcessedData, 
    geminiApiKey: string, 
    onComplete: () => void,
    isRegeneration: boolean = false
  ) => {
    if (!processedData) {
      console.error('❌ No processed data available');
      return;
    }

    console.log('\n=== STARTING CHART GENERATION ===');
    console.log('🚀 Generation type:', isRegeneration ? 'REGENERATION' : 'INITIAL');
    console.log('🔑 Has API key:', !!geminiApiKey);
    console.log('📊 Data overview:', {
      rows: processedData.rows.length,
      columns: processedData.columns.length,
      columnTypes: processedData.columns.map(col => `${col.name} (${col.type})`),
      sampleData: processedData.rows.slice(0, 3)
    });
    
    const validation = validateData(processedData);
    if (!validation.isValid) {
      console.error('❌ Validation failed:', validation);
      toast.error("Please fix data errors before generating charts");
      return;
    }

    try {
      console.log('🤖 Generating AI chart suggestions...');
      
      // Clear existing charts if regenerating
      if (isRegeneration) {
        console.log('🧹 Clearing existing charts for regeneration');
        dispatch({ type: "CLEAR_ALL_ITEMS" });
      }
      
      const suggestions = await generateAIChartSuggestions(processedData, geminiApiKey);
      console.log('✅ AI suggestions received:', suggestions.length);
      console.log('📋 AI suggestions details:', suggestions.map(s => ({
        type: s.type,
        title: s.title,
        columns: s.columns,
        priority: s.priority
      })));
      
      if (suggestions.length === 0) {
        console.log('⚠️ No AI suggestions, using enhanced fallback');
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
        
        charts.forEach((chart) => {
          dispatch({ type: "ADD_ITEM", payload: chart });
        });
        
        toast.success("Generated 1 fallback chart from your data! 🎉");
      } else {
        console.log('🏗️ Creating charts from AI suggestions...');
        const charts = createAIChartsFromData(processedData, suggestions);
        console.log('✅ Successfully created charts:', charts.length);
        
        // Add charts to dashboard (they already have proper positioning)
        charts.forEach((chart) => {
          console.log(`📍 Adding chart: ${chart.title} at position (${chart.position.x}, ${chart.position.y})`);
          dispatch({ type: "ADD_ITEM", payload: chart });
        });

        const message = isRegeneration 
          ? `🔄 Regenerated ${charts.length} new AI-enhanced charts with proper layout!`
          : `Generated ${charts.length} AI-enhanced charts with organized grid layout! 🤖✨`;

        toast.success(
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>{message}</span>
          </div>
        );
      }
      
      onComplete();
    } catch (error) {
      console.error("❌ Chart generation error:", error);
      
      // Enhanced error handling with specific messages
      if (error.message.includes('Failed to parse AI response')) {
        toast.error(
          <div>
            <div className="font-medium">AI Response Error</div>
            <div className="text-sm text-muted-foreground">The AI returned invalid data. Using fallback charts instead.</div>
          </div>
        );
        
        // Generate fallback charts on AI failure
        try {
          const fallbackSuggestions = [
            {
              type: 'bar' as const,
              columns: processedData.columns.slice(0, 2).map(col => col.name),
              title: `${processedData.columns[1]?.name || 'Values'} by ${processedData.columns[0]?.name || 'Category'}`,
              description: 'Fallback visualization of your data',
              priority: 5
            }
          ];
          
          const fallbackCharts = createAIChartsFromData(processedData, fallbackSuggestions);
          fallbackCharts.forEach((chart) => {
            dispatch({ type: "ADD_ITEM", payload: chart });
          });
          
          toast.success("Generated fallback charts with proper layout! 📊");
          onComplete();
        } catch (fallbackError) {
          console.error("❌ Fallback generation failed:", fallbackError);
          toast.error("Chart generation failed completely. Please try again.");
        }
      } else {
        toast.error(
          <div>
            <div className="font-medium">Generation Failed</div>
            <div className="text-sm text-muted-foreground">Please check your API key and try again.</div>
          </div>
        );
      }
    }
  };

  return { generateCharts };
};
