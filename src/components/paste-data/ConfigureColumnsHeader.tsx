
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings,
  AlertTriangle,
  ArrowRight,
  Info,
  Plus
} from "lucide-react";
import { ProcessedData, DataValidationResult } from "@/utils/dataProcessor";

interface ConfigureColumnsHeaderProps {
  processedData: ProcessedData;
  validation: DataValidationResult | null;
  onNext: () => void;
  onAddColumn: () => void;
}

const ConfigureColumnsHeader: React.FC<ConfigureColumnsHeaderProps> = ({
  processedData,
  validation,
  onNext,
  onAddColumn,
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
    <>
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
            className="min-w-48 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Column Configuration</h3>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {processedData.columns.length} columns found
          </Badge>
          <Button
            onClick={onAddColumn}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Column
          </Button>
        </div>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <strong>💡 AI Enhancement Tip:</strong> Add descriptions to help our AI understand your data better and generate more relevant chart suggestions.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default ConfigureColumnsHeader;
