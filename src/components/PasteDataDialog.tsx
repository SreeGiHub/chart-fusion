import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { processData, validateData, DataColumn, ProcessedData } from "@/utils/dataProcessor";
import EnterDataStep from "./paste-data/EnterDataStep";
import ConfigureColumnsStep from "./paste-data/ConfigureColumnsStep";
import PreviewDataStep from "./paste-data/PreviewDataStep";
import GeminiApiKeyInput from "./paste-data/GeminiApiKeyInput";
import PasteDataDialogHeader from "./paste-data/PasteDataDialogHeader";
import PasteDataTabs from "./paste-data/PasteDataTabs";
import { useChartGenerator } from "./paste-data/ChartGenerator";
import { useSampleData } from "./paste-data/SampleDataManager";

interface PasteDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GEMINI_API_KEY_STORAGE_KEY = "gemini_api_key";

const PasteDataDialog: React.FC<PasteDataDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState("enter");
  const [pastedData, setPastedData] = useState("");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const { generateCharts } = useChartGenerator();
  const { loadSampleData } = useSampleData();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage whenever it changes
  const handleApiKeyChange = (key: string) => {
    setGeminiApiKey(key);
    if (key.trim()) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    }
  };

  const handleTrySampleData = () => {
    const success = loadSampleData(setPastedData, setProcessedData);
    if (success) {
      toast.success("Sample data loaded with auto-detected types and descriptions! Click 'Continue to Preview' to proceed.");
    }
  };

  const handlePasteData = () => {
    if (!pastedData.trim()) {
      toast.error("Please paste some data first");
      return;
    }

    console.log('Processing pasted data...');
    setIsProcessing(true);
    try {
      const processed = processData(pastedData);
      console.log('Processed data:', processed);
      setProcessedData(processed);
      
      if (processed.isValid) {
        setActiveTab("configure");
        toast.success(
          <div className="flex items-center gap-2">
            <span>Data processed successfully! Found {processed.columns.length} columns and {processed.rows.length} rows with auto-detected types.</span>
          </div>
        );
      } else {
        toast.error("Data processing failed. Please check the errors below.");
      }
    } catch (error) {
      console.error("Data processing error:", error);
      toast.error("Failed to process data. Please check your data format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleColumnUpdate = (columnIndex: number, updates: Partial<DataColumn>) => {
    if (!processedData) return;
    
    console.log('Updating column:', columnIndex, updates);
    const updatedColumns = [...processedData.columns];
    updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], ...updates };
    
    const updatedProcessedData = {
      ...processedData,
      columns: updatedColumns
    };
    
    console.log('Updated processed data:', updatedProcessedData);
    setProcessedData(updatedProcessedData);
  };

  const handleConfigureNext = () => {
    if (!processedData) return;
    
    console.log('Moving to preview step with data:', processedData);
    const validation = validateData(processedData);
    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
      toast.error("Please fix data errors before proceeding");
      return;
    }
    
    setActiveTab("preview");
    toast.success("Configuration complete! Review your data and generate dashboard.");
  };

  const handleGenerateCharts = async () => {
    if (!processedData) return;

    setIsGenerating(true);
    try {
      await generateCharts(processedData, geminiApiKey, () => {
        onOpenChange(false);
        resetDialog();
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetDialog = () => {
    setPastedData("");
    setProcessedData(null);
    setActiveTab("enter");
    // Note: We don't reset the API key anymore - it persists in localStorage
  };

  const validation = processedData ? validateData(processedData) : null;

  return (
    <Dialog open={open} onOpenChange={(open) => { 
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col">
        <PasteDataDialogHeader />

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <PasteDataTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              processedData={processedData}
            />

            <TabsContent value="enter" className="flex-1 space-y-6">
              <EnterDataStep
                pastedData={pastedData}
                setPastedData={setPastedData}
                processedData={processedData}
                isProcessing={isProcessing}
                onTrySampleData={handleTrySampleData}
                onProcessData={handlePasteData}
              />
              
              <GeminiApiKeyInput
                apiKey={geminiApiKey}
                setApiKey={handleApiKeyChange}
                showKey={showApiKey}
                setShowKey={setShowApiKey}
              />
            </TabsContent>

            <TabsContent value="configure" className="flex-1">
              {processedData && (
                <ConfigureColumnsStep
                  processedData={processedData}
                  validation={validation}
                  onColumnUpdate={handleColumnUpdate}
                  onNext={handleConfigureNext}
                />
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1">
              {processedData && (
                <PreviewDataStep
                  processedData={processedData}
                  validation={validation}
                  isGenerating={isGenerating}
                  onGenerateCharts={handleGenerateCharts}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasteDataDialog;
