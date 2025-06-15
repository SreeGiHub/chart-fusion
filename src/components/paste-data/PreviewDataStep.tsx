
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, AlertTriangle, ArrowRight } from "lucide-react";
import { ProcessedData, DataValidationResult } from "@/utils/dataProcessor";

interface PreviewDataStepProps {
  processedData: ProcessedData;
  validation: DataValidationResult | null;
  isGenerating: boolean;
  onGenerateCharts: () => void;
  onRegenerateCharts?: () => void;
}

const PreviewDataStep: React.FC<PreviewDataStepProps> = ({
  processedData,
  validation,
  isGenerating,
  onGenerateCharts,
  onRegenerateCharts,
}) => {
  const hasValidData = validation?.isValid !== false;

  return (
    <div className="space-y-6">
      {/* Data Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-3">Data Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Rows</div>
            <div className="text-lg font-medium">{processedData.rows.length}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Columns</div>
            <div className="text-lg font-medium">{processedData.columns.length}</div>
          </div>
        </div>
      </div>

      {/* Column Overview */}
      <div>
        <h3 className="font-medium mb-3">Column Types</h3>
        <div className="grid grid-cols-2 gap-2">
          {processedData.columns.map((column) => (
            <div
              key={column.name}
              className="flex items-center justify-between p-2 bg-muted/30 rounded"
            >
              <span className="text-sm font-medium">{column.name}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {column.type}
              </span>
            </div>
          ))}
        </div>
      </div>

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

      {/* Generate Dashboard Section */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Continue to Preview Data
            </h3>
            <p className="text-sm text-muted-foreground">
              {hasValidData 
                ? "Your data is ready! Generate an AI-powered dashboard with intelligent visualizations." 
                : "Please fix validation issues before proceeding to dashboard generation."
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {onRegenerateCharts && (
              <Button
                variant="outline"
                onClick={onRegenerateCharts}
                disabled={!hasValidData || isGenerating}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate Charts
              </Button>
            )}
            
            <Button
              onClick={onGenerateCharts}
              disabled={!hasValidData || isGenerating}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 py-3"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating Dashboard..." : "Generate Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewDataStep;
