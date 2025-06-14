
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
    const dataUrl = await htmlToImage.toPng(canvas, { quality: 0.95 });

    const pdf = new jsPDF.default({
      orientation: "landscape",
      unit: "px",
    });
    
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${document.title || "dashboard"}.pdf`);
  } catch (error) {
    console.error("Failed to export to PDF:", error);
  }
}
