
import { useDashboard } from "@/context/DashboardContext";
import { ChartType } from "@/types";
import EditTableChartPanel from "./EditTableChartPanel";

const ChartEditorSidebar = () => {
  const { state } = useDashboard();
  const { selectedItemId, items } = state;

  if (!selectedItemId) return null;

  const selectedItem = items.find(item => item.id === selectedItemId);
  if (!selectedItem) return null;

  // Render appropriate editor based on chart type
  if (selectedItem.type === "table") {
    return <EditTableChartPanel item={selectedItem} />;
  }
  
  // For other chart types, we'll use the existing edit panel from Sidebar.tsx
  // This is just a placeholder as we can't modify Sidebar.tsx directly
  return null;
};

export default ChartEditorSidebar;
