
import { useParams, Link } from "react-router-dom";
import { useDashboard } from "@/context/DashboardContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import ChartItem from "@/components/ChartItem";
import EditTableChartPanel from "@/components/EditTableChartPanel";

const ChartDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useDashboard();
  
  // Find the chart item
  const chartItem = state.items.find(item => item.id === id);
  
  useEffect(() => {
    if (chartItem) {
      dispatch({ type: "SELECT_ITEM", payload: chartItem.id });
    }
  }, [chartItem?.id, dispatch]);
  
  if (!chartItem) {
    return (
      <div className="min-h-screen p-8">
        <Link to="/">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-2xl font-bold mb-2">Chart Not Found</h1>
          <p className="text-muted-foreground">The chart you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{chartItem.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border rounded-lg p-4 bg-background shadow-sm">
          <div style={{ height: '500px', position: 'relative' }} className="flex items-center justify-center">
            <div 
              style={{ 
                position: 'absolute', 
                width: chartItem.size.width, 
                height: chartItem.size.height,
                left: '50%',
                top: '50%', 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <ChartItem item={chartItem} />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg bg-background shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Edit Chart</h2>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[600px]">
            {chartItem.type === 'table' ? (
              <EditTableChartPanel item={chartItem} />
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Edit options for {chartItem.type} charts are available in the main dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDetailPage;
