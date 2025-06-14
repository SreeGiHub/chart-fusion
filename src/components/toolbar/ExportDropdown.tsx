
import { useDashboard } from "@/context/DashboardContext";
import { exportToJSON, exportToPNG, exportToPDF } from "@/utils/chartUtils";
import { toast } from "sonner";
import { Save, Download, Image, FileOutput } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportDropdownProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ canvasRef }) => {
  const { state } = useDashboard();

  const handleSave = () => {
    try {
      const data = exportToJSON(state);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${state.title || "dashboard"}.json`;
      link.click();

      toast.success("Dashboard saved successfully");
    } catch (error) {
      console.error("Failed to save dashboard:", error);
      toast.error("Failed to save dashboard");
    }
  };

  const handleExportPNG = () => {
    try {
      exportToPNG(canvasRef);
      toast.success("Exported as PNG");
    } catch (error) {
      console.error("Failed to export as PNG:", error);
      toast.error("Failed to export as PNG");
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(canvasRef);
      toast.success("Exported as PDF");
    } catch (error) {
      console.error("Failed to export as PDF:", error);
      toast.error("Failed to export as PDF");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Save className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Save & Export</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          <span>Save as JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPNG}>
          <Image className="mr-2 h-4 w-4" />
          <span>Export as PNG</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileOutput className="mr-2 h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
