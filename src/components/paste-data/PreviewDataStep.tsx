
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, ArrowRight, Grid3X3 } from "lucide-react";
import { ProcessedData, DataValidationResult } from "@/utils/dataProcessor";
import GeminiApiKeyInput from "./GeminiApiKeyInput";
import PickAChartDialog from "./PickAChartDialog";
import { ChartTemplate } from "@/utils/chartTemplates";

interface PreviewDataStepProps {
  processedData: ProcessedData;
  validation: DataValidationResult | null;
  isGenerating: boolean;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  onGenerateCharts: () => void;
  onPickCharts: (templates: ChartTemplate[]) => void;
}

const PreviewDataStep: React.FC<PreviewDataStepProps> = ({
  processedData,
  validation,
  isGenerating,
  geminiApiKey,
  setGeminiApiKey,
  onGenerateCharts,
  onPickCharts,
}) => {
  const [showKey, setShowKey] = useState(false);
  const [isPickChartOpen, setIsPickChartOpen] = useState(false);
  const hasValidData = validation?.isValid !== false;

  const handlePickCharts = (templates: ChartTemplate[]) => {
    onPickCharts(templates);
  };

  return (
    <div className="space-y-6">
      {/* Validation Warnings */}
      {validation && !validation.isValid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Data Validation Issues</span>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Preview Table */}
      <div>
        <h3 className="font-medium mb-3">Data Preview</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-48">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {processedData.columns.map((column) => (
                    <th key={column.name} className="px-3 py-2 text-left font-medium">
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processedData.rows.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-t">
                    {processedData.columns.map((column) => (
                      <td key={column.name} className="px-3 py-2">
                        {row[column.name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {processedData.rows.length > 5 && (
            <div className="bg-muted/30 px-3 py-2 text-xs text-muted-foreground text-center">
              Showing 5 of {processedData.rows.length} rows
            </div>
          )}
        </div>
      </div>

      {/* Chart Creation Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Create Your Charts</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you want to visualize your data - pick specific charts or let AI create a complete dashboard.
        </p>

        {/* Pick a Chart Option */}
        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-emerald-600" />
                Pick a Chart
              </h4>
              <p className="text-sm text-muted-foreground">
                Browse all available chart types and manually select the ones you want to create with your data.
              </p>
              <p className="text-xs text-emerald-700 font-medium">
                Manual selection • Instant creation • Full control
              </p>
            </div>
            
            <Button
              onClick={() => setIsPickChartOpen(true)}
              disabled={!hasValidData}
              variant="outline"
              className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              size="lg"
            >
              <Grid3X3 className="h-4 w-4" />
              Browse Charts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* AI Generate Dashboard Option */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Generate Dashboard with AI
                </h4>
                <p className="text-sm text-muted-foreground">
                  Let AI analyze your data and create an intelligent dashboard with multiple relevant charts and insights.
                </p>
                <p className="text-xs text-blue-700 font-medium">
                  AI-powered • Multiple charts • Business insights
                </p>
              </div>
              
              <Button
                onClick={onGenerateCharts}
                disabled={!hasValidData || isGenerating}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Gemini API Key Input for AI option */}
            <GeminiApiKeyInput
              apiKey={geminiApiKey}
              setApiKey={setGeminiApiKey}
              showKey={showKey}
              setShowKey={setShowKey}
            />
          </div>
        </div>
      </div>

      {/* Pick a Chart Dialog */}
      <PickAChartDialog
        open={isPickChartOpen}
        onOpenChange={setIsPickChartOpen}
        onChartsSelected={handlePickCharts}
      />
    </div>
  );
};

export default PreviewDataStep;
