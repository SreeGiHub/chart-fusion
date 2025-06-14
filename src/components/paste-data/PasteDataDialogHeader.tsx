
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

const PasteDataDialogHeader: React.FC = () => {
  return (
    <DialogHeader className="space-y-3 pb-4 border-b">
      <DialogTitle className="flex items-center gap-3 text-xl">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-xl font-bold">Paste & Visualize</div>
          <div className="text-sm font-normal text-muted-foreground">Transform your data into beautiful charts instantly</div>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};

export default PasteDataDialogHeader;
