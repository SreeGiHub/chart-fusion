import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PasteDataTabs from "./paste-data/PasteDataTabs";
import PasteDataDialogHeader from "./paste-data/PasteDataDialogHeader";
import EnterDataStep from "./paste-data/EnterDataStep";
import ConfigureColumnsStep from "./paste-data/ConfigureColumnsStep";
import PreviewDataStep from "./paste-data/PreviewDataStep";
import { processData, ProcessedData, DataValidationResult, validateData } from "@/utils/dataProcessor";
import { ChartTemplate } from "@/utils/chartTemplates";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PasteDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasteDataDialog: React.FC<PasteDataDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState("enter");
  const [rawData, setRawData] = useState("");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [validation, setValidation] = useState<DataValidationResult | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleColumnUpdate = (columnIndex: number, updates: Partial<any>) => {
    if (!processedData) return;
    
    const newColumns = [...processedData.columns];
    if (columnIndex >= newColumns.length) {
      // Adding new column
      newColumns.push(updates as any);
    } else {
      // Updating existing column
      newColumns[columnIndex] = { ...newColumns[columnIndex], ...updates };
    }
    
    const updatedData = { ...processedData, columns: newColumns };
    setProcessedData(updatedData);
    setValidation(validateData(updatedData));
  };

  const handleProcessData = () => {
    if (!rawData.trim()) {
      toast.error("Please enter some data first");
      return;
    }

    setIsProcessing(true);
    try {
      const processed = processData(rawData);
      setProcessedData(processed);
      setValidation(validateData(processed));
      setActiveTab("configure");
      toast.success("Data processed successfully!");
    } catch (error) {
      console.error("Error processing data:", error);
      toast.error("Failed to process data. Please check your data format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrySampleData = () => {
    const sampleData = `Name	Age	Sales	Region
John	25	1500	North
Sarah	30	2000	South
Mike	28	1800	East
Lisa	32	2200	West
Tom	27	1600	North`;
    setRawData(sampleData);
  };

  const handleNext = () => {
    if (activeTab === "enter") {
      handleProcessData();
    } else if (activeTab === "configure") {
      setActiveTab("preview");
    }
  };

  const handleBack = () => {
    if (activeTab === "configure") {
      setActiveTab("enter");
    } else if (activeTab === "preview") {
      setActiveTab("configure");
    }
  };

  const handlePickCharts = (templates: ChartTemplate[]) => {
    if (!processedData) {
      toast.error("No data available for chart generation");
      return;
    }

    const validation = validateData(processedData);
    if (!validation.isValid) {
      toast.error("Please fix validation issues before generating charts");
      return;
    }

    console.log('🚀 Starting chart generation with selected templates:', {
      templates: templates.length,
      processedData: !!processedData,
      dataRows: processedData?.rows.length,
      dataColumns: processedData?.columns.length
    });
    
    // Close dialog first
    onOpenChange(false);
    
    // Navigate to dashboard and pass the data through navigation state
    navigate("/dashboard", { 
      state: { 
        shouldGenerateCharts: true,
        processedData,
        selectedTemplates: templates,
        isManualSelection: true
      } 
    });
    
    // Reset state
    setTimeout(() => {
      setActiveTab("enter");
      setRawData("");
      setProcessedData(null);
      setValidation(null);
      setGeminiApiKey("");
      setIsGenerating(false);
    }, 1000);
  };

  const handleGenerateCharts = () => {
    if (!processedData) {
      toast.error("No data available for chart generation");
      return;
    }

    const validation = validateData(processedData);
    if (!validation.isValid) {
      toast.error("Please fix validation issues before generating charts");
      return;
    }

    console.log('🚀 Starting chart generation with data:', {
      processedData: !!processedData,
      geminiApiKey: !!geminiApiKey,
      dataRows: processedData?.rows.length,
      dataColumns: processedData?.columns.length
    });
    
    setIsGenerating(true);
    
    // Show loading message
    toast.loading("Preparing dashboard generation...");
    
    // Close dialog first
    onOpenChange(false);
    
    // Navigate to dashboard and pass the data through navigation state
    navigate("/dashboard", { 
      state: { 
        shouldGenerateCharts: true,
        processedData,
        geminiApiKey 
      } 
    });
    
    // Reset state
    setTimeout(() => {
      setActiveTab("enter");
      setRawData("");
      setProcessedData(null);
      setValidation(null);
      setGeminiApiKey("");
      setIsGenerating(false);
    }, 1000);
  };

  const handleComplete = () => {
    handleGenerateCharts();
  };

  const handleClose = () => {
    onOpenChange(false);
    setActiveTab("enter");
    setRawData("");
    setProcessedData(null);
    setValidation(null);
    setGeminiApiKey("");
    setIsGenerating(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <PasteDataDialogHeader />
        
        <div className="flex-1 overflow-hidden">
          <PasteDataTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            processedData={processedData}
          />
          
          <div className="mt-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === "enter" && (
              <EnterDataStep 
                pastedData={rawData}
                setPastedData={setRawData}
                processedData={processedData}
                isProcessing={isProcessing}
                onTrySampleData={handleTrySampleData}
                onProcessData={handleProcessData}
              />
            )}
            
            {activeTab === "configure" && processedData && (
              <ConfigureColumnsStep
                processedData={processedData}
                validation={validation}
                onColumnUpdate={handleColumnUpdate}
                onNext={handleNext}
              />
            )}
            
            {activeTab === "preview" && processedData && (
              <PreviewDataStep
                processedData={processedData}
                validation={validation}
                isGenerating={isGenerating}
                geminiApiKey={geminiApiKey}
                setGeminiApiKey={setGeminiApiKey}
                onGenerateCharts={handleGenerateCharts}
                onPickCharts={handlePickCharts}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasteDataDialog;
