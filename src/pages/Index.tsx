
import { useRef, useEffect } from "react";
import { DashboardProvider } from "@/context/DashboardContext";
import Toolbar from "@/components/Toolbar";
import Canvas from "@/components/Canvas";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const isMobile = useIsMobile();

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

  return (
    <DashboardProvider>
      <div className="flex flex-col h-screen">
        <Toolbar canvasRef={canvasRef} />
        <div ref={canvasRef} className="flex-1 overflow-hidden relative">
          <Canvas />
          <Sidebar />
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Index;
