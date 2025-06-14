
import { MouseEvent } from "react";

interface CanvasNavigationProps {
  transform: { x: number; y: number; scale: number };
  setTransform: (transform: { x: number; y: number; scale: number }) => void;
  setIsPanning: (isPanning: boolean) => void;
  setLastPanPoint: (point: { x: number; y: number }) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const CanvasNavigation: React.FC<CanvasNavigationProps> = ({
  transform,
  setTransform,
  setIsPanning,
  setLastPanPoint,
  canvasRef
}) => {
  const handleMouseDown = (e: MouseEvent) => {
    // Left click with meta/ctrl or middle click
    if ((e.button === 0 && (e.metaKey || e.ctrlKey)) || e.button === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.1), 5);
      
      // Zoom towards mouse position
      const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
      const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
      
      setTransform({
        x: newX,
        y: newY,
        scale: newScale
      });
    }
  };

  return {
    handleMouseDown,
    handleWheel
  };
};

export default CanvasNavigation;
