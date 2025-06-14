
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { ProcessedData } from "@/utils/dataProcessor";

interface EnterDataStepProps {
  pastedData: string;
  setPastedData: (data: string) => void;
  processedData: ProcessedData | null;
  isProcessing: boolean;
  onTrySampleData: () => void;
  onProcessData: () => void;
}

const EnterDataStep: React.FC<EnterDataStepProps> = ({
  pastedData,
  setPastedData,
  processedData,
  isProcessing,
  onTrySampleData,
  onProcessData,
}) => {
  return (
    <div className="flex-1 space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border border-emerald-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">How it works</h3>
              <p className="text-sm text-gray-600 mt-1">
                Copy data from Excel or Google Sheets, paste it below, and we'll instantly create multiple chart types to visualize your insights.
              </p>
            </div>
          </div>
          <Button 
            onClick={onProcessData} 
            disabled={!pastedData.trim() || isProcessing}
            className="min-w-32 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Process Data
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="paste-area" className="text-base font-medium">
            Paste your data here
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={onTrySampleData}
            className="text-xs"
          >
            Try sample data
          </Button>
        </div>
        <Textarea
          id="paste-area"
          placeholder="Paste tabular data here...

Example:
Name	Age	Sales	Region
John	25	1500	North
Sarah	30	2000	South
Mike	28	1800	East"
          value={pastedData}
          onChange={(e) => setPastedData(e.target.value)}
          className="h-48 font-mono text-sm resize-none"
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Supports Excel & Sheets formats</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Auto-detects data types</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Up to 100 rows</span>
        </div>
      </div>

      {processedData && !processedData.isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {processedData.errors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end pt-4 border-t">
        <div className="text-sm text-gray-500">
          Step 1 of 3: Enter your data
        </div>
      </div>
    </div>
  );
};

export default EnterDataStep;
