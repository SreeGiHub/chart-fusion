
import { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { ChartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table2 } from "lucide-react";
import { toast } from "sonner";

interface EditTableChartPanelProps {
  item: ChartItemType;
}

// This component is deprecated but kept for compatibility with existing dashboards
const EditTableChartPanel: React.FC<EditTableChartPanelProps> = ({ item }) => {
  const { dispatch } = useDashboard();
  const [title, setTitle] = useState(item.title);

  useEffect(() => {
    setTitle(item.title);
  }, [item]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: item.id,
        updates: { title },
      },
    });
    toast.success("Table title updated");
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Table2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Edit Table</h2>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chart-title">Table Title</Label>
        <Input
          id="chart-title"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
        />
      </div>

      <Separator />

      <div className="p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">
          Table charts are no longer supported in this version.
        </p>
      </div>
    </div>
  );
};

export default EditTableChartPanel;
