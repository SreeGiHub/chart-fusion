
import React from "react";
import EnterDataStep from "./EnterDataStep";
import ConfigureColumnsStep from "./ConfigureColumnsStep";
import PreviewDataStep from "./PreviewDataStep";

interface PasteDataStepsProps {
  dialogState: any;
  onClose: () => void;
}

const PasteDataSteps: React.FC<PasteDataStepsProps> = ({ dialogState, onClose }) => {
  const {
    activeTab,
    rawData,
    setRawData,
    processedData,
    validation,
    isProcessing,
    isGenerating,
    geminiApiKey,
    setGeminiApiKey,
    handleTrySampleData,
    handleProcessData,
    handleColumnUpdate,
    handleNext,
    handlePickCharts,
    handleGenerateCharts
  } = dialogState;

  if (activeTab === "enter") {
    return (
      <EnterDataStep 
        pastedData={rawData}
        setPastedData={setRawData}
        processedData={processedData}
        isProcessing={isProcessing}
        onTrySampleData={handleTrySampleData}
        onProcessData={handleProcessData}
      />
    );
  }
  
  if (activeTab === "configure" && processedData) {
    return (
      <ConfigureColumnsStep
        processedData={processedData}
        validation={validation}
        onColumnUpdate={handleColumnUpdate}
        onNext={handleNext}
      />
    );
  }
  
  if (activeTab === "preview" && processedData) {
    return (
      <PreviewDataStep
        processedData={processedData}
        validation={validation}
        isGenerating={isGenerating}
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
        onGenerateCharts={() => handleGenerateCharts(onClose)}
        onPickCharts={(templates) => handlePickCharts(templates, onClose)}
      />
    );
  }

  return null;
};

export default PasteDataSteps;
