
import { useState, useCallback, useEffect } from "react";

interface Transform {
  x: number;
  y: number;
  scale: number;
}

export const useCanvasTransform = () => {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (isPanning) {
      // Since we're using ScrollArea, we don't need to manually handle panning
      // The scroll will be handled by the ScrollArea component
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
    // Reset scroll position
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.scrollTop = 0;
      scrollArea.scrollLeft = 0;
    }
  };

  // Add global event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        resetView();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    transform,
    setTransform,
    isPanning,
    setIsPanning,
    lastPanPoint,
    setLastPanPoint,
    resetView
  };
};
