
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const handleContinue = () => {
    console.log('Continue button clicked, validation:', validation);
    if (validation && !validation.isValid) {
      console.log('Validation failed, cannot continue');
      return;
    }
    console.log('Proceeding to next step');
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Configure Your Columns</h3>
              <p className="text-sm text-gray-600 mt-1">
                Review and adjust column names and data types to ensure accurate chart generation.
              </p>
            </div>
          </div>
          <Button 
            onClick={handleContinue}
            disabled={validation && !validation.isValid}
            className="min-w-32 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Continue to Preview
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
            <h3 className="text-lg font-semibold">Column Configuration</h3>
            <Badge variant="outline" className="text-sm">
              {processedData.columns.length} columns found
            </Badge>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>💡 AI Enhancement Tip:</strong> Add descriptions to help our AI understand your data better and generate more relevant chart suggestions.
            </AlertDescription>
          </Alert>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Column Name</TableHead>
                  <TableHead className="font-semibold">Data Type</TableHead>
                  <TableHead className="font-semibold">Description (AI Context)</TableHead>
                  <TableHead className="font-semibold w-20">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.columns.map((column, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <Input
                        value={column.name}
                        onChange={(e) => onColumnUpdate(index, { name: e.target.value })}
                        className="min-w-[150px]"
                        placeholder="Enter column name"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Select
                        value={column.type}
                        onValueChange={(value) => onColumnUpdate(index, { type: value as DataColumn['type'] })}
                      >
                        <SelectTrigger className="min-w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    
                    <TableCell>
                      <Input
                        placeholder="e.g., 'Monthly sales revenue in USD', 'Customer satisfaction score 1-5'"
                        value={column.description || ''}
                        onChange={(e) => onColumnUpdate(index, { description: e.target.value })}
                        className="min-w-[250px]"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {column.hasErrors ? (
                          <div className="relative group">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {column.errorMessage}
                            </div>
                          </div>
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {processedData.rows.length > 0 && (
            <div className="text-sm text-gray-600">
              Preview: {processedData.rows.length} rows of data ready for visualization
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t bg-white">
        <div className="text-sm text-gray-500">
          Step 2 of 3: Configure your data columns
        </div>
      </div>
    </div>
  );
};

export default ConfigureColumnsStep;
