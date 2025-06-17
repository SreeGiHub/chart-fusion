
import { useState } from "react";
import { ProcessedData, DataValidationResult, validateData, processData } from "@/utils/dataProcessor";
import { ChartTemplate } from "@/utils/chartTemplates";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const usePasteDataDialog = () => {
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
      newColumns.push(updates as any);
    } else {
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

  const handlePickCharts = (templates: ChartTemplate[], onClose: () => void) => {
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
    
    onClose();
    
    navigate("/dashboard", { 
      state: { 
        shouldGenerateCharts: true,
        processedData,
        selectedTemplates: templates,
        isManualSelection: true
      } 
    });
    
    resetState();
  };

  const handleGenerateCharts = (onClose: () => void) => {
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
    toast.loading("Preparing dashboard generation...");
    
    onClose();
    
    navigate("/dashboard", { 
      state: { 
        shouldGenerateCharts: true,
        processedData,
        geminiApiKey 
      } 
    });
    
    resetState();
  };

  const resetState = () => {
    setTimeout(() => {
      setActiveTab("enter");
      setRawData("");
      setProcessedData(null);
      setValidation(null);
      setGeminiApiKey("");
      setIsGenerating(false);
    }, 1000);
  };

  return {
    activeTab,
    setActiveTab,
    rawData,
    setRawData,
    processedData,
    validation,
    geminiApiKey,
    setGeminiApiKey,
    isProcessing,
    isGenerating,
    handleColumnUpdate,
    handleProcessData,
    handleTrySampleData,
    handleNext,
    handleBack,
    handlePickCharts,
    handleGenerateCharts,
    resetState
  };
};
