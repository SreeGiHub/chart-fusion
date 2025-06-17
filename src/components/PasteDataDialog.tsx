
import React from "react";
import PasteDataDialogContainer from "./paste-data/PasteDataDialogContainer";

interface PasteDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasteDataDialog: React.FC<PasteDataDialogProps> = (props) => {
  return <PasteDataDialogContainer {...props} />;
};

export default PasteDataDialog;
