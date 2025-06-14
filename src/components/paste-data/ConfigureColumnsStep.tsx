
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { ProcessedData, DataColumn, DataValidationResult } from "@/utils/dataProcessor";

interface ConfigureColumnsStepProps {
  processedData: ProcessedData;
  validation: DataValidationResult | null;
  onColumnUpdate: (columnIndex: number, updates: Partial<DataColumn>) => void;
  onNext: () => void;
}

const ConfigureColumnsStep: React.FC<ConfigureColumnsStepProps> = ({
  processedData,
  validation,
  onColumnUpdate,
  onNext,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900">Configure Your Columns</h3>
            <p className="text-sm text-gray-600 mt-1">
              Review and adjust column names and data types to ensure accurate chart generation.
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
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Column Configuration</h3>
          <div className="grid gap-3">
            {processedData.columns.map((column, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`col-name-${index}`} className="text-xs">
                    Column Name
                  </Label>
                  <input
                    id={`col-name-${index}`}
                    value={column.name}
                    onChange={(e) => onColumnUpdate(index, { name: e.target.value })}
                    className="w-full h-8 px-3 border rounded-md"
                  />
                </div>
                
                <div className="w-32 space-y-1">
                  <Label htmlFor={`col-type-${index}`} className="text-xs">
                    Data Type
                  </Label>
                  <select
                    value={column.type}
                    onChange={(e) => onColumnUpdate(index, { type: e.target.value as DataColumn['type'] })}
                    className="w-full h-8 px-2 border rounded-md text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`${
                    column.type === 'number' ? 'bg-blue-100 text-blue-800' :
                    column.type === 'date' ? 'bg-green-100 text-green-800' :
                    column.type === 'boolean' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {column.type}
                  </Badge>
                  {column.hasErrors ? (
                    <div className="relative group">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {column.errorMessage}
                      </div>
                    </div>
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button 
          onClick={onNext}
          className="min-w-32 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Next: Preview Data
        </Button>
      </div>
    </div>
  );
};

export default ConfigureColumnsStep;
