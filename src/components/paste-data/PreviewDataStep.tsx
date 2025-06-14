
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Database
} from "lucide-react";
import { ProcessedData, DataValidationResult } from "@/utils/dataProcessor";

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
  const handleGenerate = () => {
    console.log('Generate button clicked, validation:', validation);
    if (validation && !validation.isValid) {
      console.log('Validation failed, cannot generate');
      return;
    }
    console.log('Proceeding to generate charts');
    onGenerateCharts();
  };

  // Show first 10 rows for preview
  const previewRows = processedData.rows.slice(0, 10);

  return (
    <div className="flex-1 flex flex-col overflow-hidden space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Preview Your Data</h3>
              <p className="text-sm text-gray-600 mt-1">
                Review your data structure and generate AI-powered dashboard charts.
              </p>
            </div>
          </div>
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || (validation && !validation.isValid)}
            className="min-w-48 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating Charts...' : 'Generate AI Dashboard'}
          </Button>
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Data Preview</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-sm">
                {processedData.columns.length} columns
              </Badge>
              <Badge variant="outline" className="text-sm">
                {processedData.rows.length} rows
              </Badge>
            </div>
          </div>

          <div className="border rounded-lg overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {processedData.columns.map((column, index) => (
                    <TableHead key={index} className="font-semibold min-w-[120px]">
                      <div className="space-y-1">
                        <div>{column.name}</div>
                        <div className="text-xs text-gray-500 font-normal">
                          {column.type}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50">
                    {processedData.columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className="min-w-[120px]">
                        {row[column.name] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {processedData.rows.length > 10 && (
            <div className="text-sm text-gray-600 text-center">
              Showing first 10 rows of {processedData.rows.length} total rows
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Column Descriptions for AI:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {processedData.columns.map((column, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-blue-800">{column.name}:</span>{' '}
                  <span className="text-blue-700">
                    {column.description || 'No description provided'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t bg-white">
        <div className="text-sm text-gray-500">
          Step 3 of 3: Review data and generate your dashboard
        </div>
      </div>
    </div>
  );
};

export default PreviewDataStep;
