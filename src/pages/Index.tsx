
import { useRef, useEffect } from "react";
import { DashboardProvider } from "@/context/DashboardContext";
import Toolbar from "@/components/Toolbar";
import Canvas from "@/components/Canvas";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertCircle } from "lucide-react";
import { useChartGenerator } from "@/components/paste-data/ChartGenerator";

const IndexContent = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { generateCharts } = useChartGenerator();

  useEffect(() => {
    if (isMobile) {
      toast.warning(
        "This application is optimized for desktop. Some features may not work well on mobile devices.",
        {
          duration: 5000,
          icon: <AlertCircle className="h-4 w-4" />,
        }
      );
    }
  }, [isMobile]);

  // Handle chart generation from landing page navigation
  useEffect(() => {
    const state = location.state as any;
    if (state?.shouldGenerateCharts && state?.processedData && state?.geminiApiKey) {
      console.log('🚀 Generating charts from landing page navigation');
      
      // Clear the navigation state to prevent re-generation on refresh
      navigate("/dashboard", { replace: true });
      
      // Generate charts with the provided data
      generateCharts(
        state.processedData,
        state.geminiApiKey,
        () => {
          console.log('✅ Charts generated successfully from landing page');
        },
        false // not a regeneration
      );
    }
  }, [location.state, generateCharts, navigate]);

  return (
    <div className="flex flex-col h-screen">
      <Toolbar canvasRef={canvasRef} />
      <div ref={canvasRef} className="flex-1 overflow-hidden relative">
        <Canvas />
        <Sidebar />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <DashboardProvider>
      <IndexContent />
    </DashboardProvider>
  );
};

export default Index;
