
import React from "react";

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function exportToJSON(state: any): string {
  return JSON.stringify({
    title: state.title,
    items: state.items,
  });
}

export function exportToPNG(canvasRef: React.RefObject<HTMLDivElement>): void {
  if (!canvasRef.current) return;

  import("html-to-image").then((htmlToImage) => {
    htmlToImage
      .toPng(canvasRef.current!, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${document.title || "dashboard"}.png`;
        link.href = dataUrl;
        link.click();
      });
  });
}

export async function exportToPDF(canvasRef: React.RefObject<HTMLDivElement>): Promise<void> {
  if (!canvasRef.current) return;

  try {
    const [htmlToImage, jsPDF] = await Promise.all([
      import("html-to-image"),
      import("jspdf"),
    ]);

    const canvas = canvasRef.current;
    
    // Store original styles
    const originalTransform = canvas.style.transform;
    const originalPosition = canvas.style.position;
    const originalTop = canvas.style.top;
    const originalLeft = canvas.style.left;
    
    // Find the scroll area viewport
    const scrollArea = canvas.closest('[data-radix-scroll-area-viewport]') as HTMLElement;
    const originalScrollTop = scrollArea?.scrollTop || 0;
    const originalScrollLeft = scrollArea?.scrollLeft || 0;
    
    // Reset canvas transform and position for full capture
    canvas.style.transform = 'scale(1)';
    canvas.style.position = 'static';
    canvas.style.top = 'auto';
    canvas.style.left = 'auto';
    
    // Reset scroll position
    if (scrollArea) {
      scrollArea.scrollTop = 0;
      scrollArea.scrollLeft = 0;
    }
    
    // Wait a moment for the DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture the full canvas
    const dataUrl = await htmlToImage.toPng(canvas, { 
      quality: 0.95,
      width: 8000,
      height: 8000,
      style: {
        transform: 'scale(1)',
        transformOrigin: '0 0'
      }
    });

    // Restore original styles
    canvas.style.transform = originalTransform;
    canvas.style.position = originalPosition;
    canvas.style.top = originalTop;
    canvas.style.left = originalLeft;
    
    // Restore scroll position
    if (scrollArea) {
      scrollArea.scrollTop = originalScrollTop;
      scrollArea.scrollLeft = originalScrollLeft;
    }

    const pdf = new jsPDF.default({
      orientation: "landscape",
      unit: "px",
      format: [8000, 8000]
    });
    
    // Add the full canvas image to PDF
    pdf.addImage(dataUrl, "PNG", 0, 0, 8000, 8000);
    pdf.save(`${document.title || "dashboard"}.pdf`);
  } catch (error) {
    console.error("Failed to export to PDF:", error);
    
    // Restore original styles in case of error
    const canvas = canvasRef.current;
    if (canvas) {
      const scrollArea = canvas.closest('[data-radix-scroll-area-viewport]') as HTMLElement;
      
      // Try to restore to a reasonable state
      canvas.style.transform = 'scale(1)';
      if (scrollArea) {
        scrollArea.scrollTop = 0;
        scrollArea.scrollLeft = 0;
      }
    }
  }
}
