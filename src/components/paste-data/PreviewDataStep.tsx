
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye,
  AlertTriangle,
  Zap,
  RefreshCw,
  Play
} from "lucide-react";
import { ProcessedData, DataValidationResult } from "@/utils/dataProcessor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewDataStepProps {
  processedData: ProcessedData;
  validation: DataValidationResult | null;
  isGenerating: boolean;
  onGenerateCharts: () => void;
}

const PreviewDataStep: React.FC<PreviewDataStepProps> = ({
  processedData,
  validation,
  isGenerating,
  onGenerateCharts,
}) => {
  return (
    <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-start gap-3">
          <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900">Preview Your Data</h3>
            <p className="text-sm text-gray-600 mt-1">
              Review your processed data and generate your dashboard with multiple chart types.
            </p>
          </div>
        </div>
      </div>

      {validation && validation.warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <strong>Data Warnings:</strong>
              {validation.warnings.map((warning, index) => (
                <div key={index} className="text-xs">• {warning}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Data Preview ({processedData.rows.length} rows)</h3>
          <ScrollArea className="h-96 w-full border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  {processedData.columns.map((column, index) => (
                    <TableHead key={index} className="min-w-24">
                      <div className="flex items-center gap-1">
                        <span>{column.name}</span>
                        {column.hasErrors && (
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="text-muted-foreground font-mono">{rowIndex + 1}</TableCell>
                    {processedData.columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        <span className="truncate block max-w-32" title={String(row[column.name])}>
                          {row[column.name] !== undefined && row[column.name] !== null
                            ? String(row[column.name])
                            : '-'
                          }
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>

      {/* Generate Dashboard CTA Section */}
      <div className="border-t pt-6">
        {validation && validation.isValid ? (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Ready to Generate Dashboard!</h3>
                <p className="text-sm text-green-700">
                  We'll create 6-8 diverse charts including bar, line, pie, and scatter plots based on your {processedData.rows.length} rows of data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 mb-4">
              <span>• Charts will be fully editable and movable</span>
              <span>• Smart chart type selection</span>
              <span>• Instant insights</span>
            </div>
            <Button 
              onClick={onGenerateCharts}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white min-w-48"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating Dashboard...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate My Dashboard
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Please fix data errors before generating dashboard</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewDataStep;
