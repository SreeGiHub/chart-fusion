
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileSpreadsheet,
  Settings,
  Eye
} from "lucide-react";
import { ProcessedData } from "@/utils/dataProcessor";

interface PasteDataTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  processedData: ProcessedData | null;
}

const PasteDataTabs: React.FC<PasteDataTabsProps> = ({
  activeTab,
  onTabChange,
  processedData,
}) => {
  return (
    <TabsList className="grid w-full grid-cols-3 mb-6">
      <TabsTrigger value="enter" className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        <span>1. Enter Data</span>
      </TabsTrigger>
      <TabsTrigger value="configure" disabled={!processedData} className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <span>2. Configure Columns</span>
      </TabsTrigger>
      <TabsTrigger value="preview" disabled={!processedData} className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span>3. Preview & Generate</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default PasteDataTabs;
