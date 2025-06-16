
import React from "react";
import { toast } from "sonner";
import { Sparkles, RefreshCw, AlertTriangle, Clock } from "lucide-react";
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
      toast.error("No data available for chart generation");
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

    // Show loading toast
    const loadingToast = toast.loading(
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Generating AI-powered dashboard...</span>
      </div>
    );

    try {
      console.log('🤖 Generating AI chart suggestions...');
      
      // Clear existing charts if regenerating
      if (isRegeneration) {
        console.log('🧹 Clearing existing charts for regeneration');
        dispatch({ type: "CLEAR_ALL_ITEMS" });
      }
      
      const suggestions = await generateAIChartSuggestions(processedData, geminiApiKey);
      console.log('✅ AI suggestions received:', suggestions.length);
      
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
        
        toast.dismiss(loadingToast);
        toast.success("Generated 1 fallback chart from your data! 📊");
      } else {
        console.log('🏗️ Creating charts from AI suggestions...');
        const charts = createAIChartsFromData(processedData, suggestions);
        console.log('✅ Successfully created charts:', charts.length);
        
        // Add charts to dashboard
        charts.forEach((chart) => {
          console.log(`📍 Adding chart: ${chart.title} at position (${chart.position.x}, ${chart.position.y})`);
          dispatch({ type: "ADD_ITEM", payload: chart });
        });

        toast.dismiss(loadingToast);
        const message = isRegeneration 
          ? `🔄 Regenerated ${charts.length} new AI-enhanced charts!`
          : `Generated ${charts.length} AI-enhanced charts! 🤖✨`;

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
      toast.dismiss(loadingToast);
      
      // Enhanced error handling with specific messages for different error types
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.includes('429') || errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
        toast.error(
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>API Rate Limit Exceeded</span>
            </div>
            <div className="text-sm text-muted-foreground">
              The Gemini API rate limit has been reached. Please wait a few minutes and try again, or use fallback charts.
            </div>
          </div>,
          { duration: 8000 }
        );
      } else if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('API key')) {
        toast.error(
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Invalid API Key</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Please check your Gemini API key and try again, or generate charts without AI assistance.
            </div>
          </div>,
          { duration: 8000 }
        );
      } else if (errorMessage.includes('Failed to parse AI response')) {
        toast.error(
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>AI Response Error</span>
            </div>
            <div className="text-sm text-muted-foreground">
              The AI returned invalid data. Generating fallback charts instead.
            </div>
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
          
          toast.success("Generated fallback charts! 📊");
          onComplete();
        } catch (fallbackError) {
          console.error("❌ Fallback generation failed:", fallbackError);
          toast.error("Chart generation failed completely. Please try again.");
        }
      } else {
        toast.error(
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Generation Failed</span>
            </div>
            <div className="text-sm text-muted-foreground">
              An unexpected error occurred. Please check your connection and try again.
            </div>
          </div>
        );
      }
    }
  };

  return { generateCharts };
};
