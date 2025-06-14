
import TextToChartDialog from "./TextToChartDialog";
import PasteDataDialog from "./PasteDataDialog";
import ChartCategoriesDropdown from "./toolbar/ChartCategoriesDropdown";
import ExportDropdown from "./toolbar/ExportDropdown";
import CanvasColorPicker from "./toolbar/CanvasColorPicker";
import ToolbarActions from "./toolbar/ToolbarActions";
import DashboardTitle from "./toolbar/DashboardTitle";
import PasteDataButton from "./toolbar/PasteDataButton";
import SettingsDialog from "./toolbar/SettingsDialog";
import { useState } from "react";

interface ToolbarProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

const Toolbar: React.FC<ToolbarProps> = ({ canvasRef }) => {
  const [isTextToChartOpen, setIsTextToChartOpen] = useState(false);
  const [isPasteDataOpen, setIsPasteDataOpen] = useState(false);

  return (
    <div className="bg-background border-b p-2 flex items-center justify-between">
      <div className="left-section flex items-center gap-3">
        <PasteDataButton onPasteDataOpen={() => setIsPasteDataOpen(true)} />
        <ChartCategoriesDropdown onTextToChartOpen={() => setIsTextToChartOpen(true)} />
        <ToolbarActions onTextToChartOpen={() => setIsTextToChartOpen(true)} />
        <CanvasColorPicker />
      </div>

      <div className="middle-section">
        <DashboardTitle />
      </div>

      <div className="right-section flex items-center gap-2">
        <ExportDropdown canvasRef={canvasRef} />
        <SettingsDialog />
        
        <TextToChartDialog 
          open={isTextToChartOpen} 
          onOpenChange={setIsTextToChartOpen} 
        />

        <PasteDataDialog 
          open={isPasteDataOpen} 
          onOpenChange={setIsPasteDataOpen} 
        />
      </div>
    </div>
  );
};

export default Toolbar;
