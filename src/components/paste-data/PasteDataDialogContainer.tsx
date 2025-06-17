
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PasteDataDialogHeader from "./PasteDataDialogHeader";
import PasteDataTabs from "./PasteDataTabs";
import PasteDataSteps from "./PasteDataSteps";
import { usePasteDataDialog } from "@/hooks/usePasteDataDialog";

interface PasteDataDialogContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasteDataDialogContainer: React.FC<PasteDataDialogContainerProps> = ({
  open,
  onOpenChange,
}) => {
  const dialogState = usePasteDataDialog();

  const handleClose = () => {
    onOpenChange(false);
    dialogState.resetState();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <PasteDataDialogHeader />
        
        <div className="flex-1 overflow-hidden">
          <PasteDataTabs 
            activeTab={dialogState.activeTab} 
            onTabChange={dialogState.setActiveTab}
            processedData={dialogState.processedData}
          />
          
          <div className="mt-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <PasteDataSteps
              dialogState={dialogState}
              onClose={handleClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasteDataDialogContainer;
