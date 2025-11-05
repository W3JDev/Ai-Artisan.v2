import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData } from '../types'; 

// A4 page dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 15; // Increased margin for better aesthetics and to prevent clipping.

export async function downloadResumeAsPdf(element: HTMLElement, resumeName: string): Promise<void> {
  if (!element) {
    console.error('Resume content element not found for PDF generation.');
    alert('Error: Could not find resume content to generate PDF.');
    return;
  }

  try {
    // Use a higher scale for better resolution, crucial for text clarity.
    // This renders the entire element content onto a single, tall canvas.
    const canvas = await html2canvas(element, {
      scale: 2.5, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pagePrintableWidth = A4_WIDTH_MM - MARGIN_MM * 2;
    const pagePrintableHeight = A4_HEIGHT_MM - MARGIN_MM * 2;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate the height of one PDF page in terms of canvas pixels, maintaining aspect ratio.
    const pdfToCanvasHeightRatio = canvasWidth / pagePrintableWidth;
    const onePageCanvasHeight = pagePrintableHeight * pdfToCanvasHeightRatio;

    let canvasYPosition = 0;

    // Loop through the tall canvas, slicing it into page-sized chunks for the PDF.
    // NOTE: This method can cause content (like a line of text) to be clipped if it
    // falls directly on a page break. This is a known limitation of rendering HTML
    // to a canvas for multi-page PDF generation. The logic ensures all content is
    // included, but does not prevent splitting elements in awkward places.
    while (canvasYPosition < canvasHeight) {
      if (canvasYPosition > 0) { // Add a new page for all but the first slice
        pdf.addPage();
      }

      // Determine the height of the canvas slice for the current page
      const sliceHeight = Math.min(onePageCanvasHeight, canvasHeight - canvasYPosition);

      // Create a temporary canvas to hold just the slice for the current page
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = sliceHeight;
      const pageCtx = pageCanvas.getContext('2d');

      if (pageCtx) {
         // Draw the slice from the main canvas onto the temporary canvas
        pageCtx.drawImage(
          canvas,
          0, // sourceX
          canvasYPosition, // sourceY
          canvasWidth, // sourceWidth
          sliceHeight, // sourceHeight
          0, // destX
          0, // destY
          canvasWidth, // destWidth
          sliceHeight  // destHeight
        );

        const pageImgData = pageCanvas.toDataURL('image/png');
        
        // Calculate the height of this specific image slice when placed in the PDF
        const pdfImageHeight = (sliceHeight * pagePrintableWidth) / canvasWidth;
        
        pdf.addImage(
          pageImgData,
          'PNG',
          MARGIN_MM, // x
          MARGIN_MM, // y
          pagePrintableWidth, // width
          pdfImageHeight // height
        );
      }
      
      canvasYPosition += sliceHeight;
    }
    
    const safeResumeName = resumeName.replace(/\s+/g, '_') || 'Resume';
    pdf.save(`${safeResumeName}_Resume.pdf`);

  } catch (error) {
    console.error('Error generating resume PDF:', error);
    alert('Failed to generate resume PDF. Please try again.');
  }
}

export function downloadCoverLetterAsPdf(letterText: string, resumeName?: string): void {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    pdf.setFont('helvetica', 'normal'); 
    pdf.setFontSize(11);

    const usableWidth = A4_WIDTH_MM - 2 * MARGIN_MM;
    
    const lines = pdf.splitTextToSize(letterText, usableWidth);

    let cursorY = MARGIN_MM;
    const pdfLineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;
    const customLineHeight = pdfLineHeight * 1.2; 

    lines.forEach((line: string) => {
      if (cursorY + customLineHeight > A4_HEIGHT_MM - MARGIN_MM) {
        pdf.addPage();
        cursorY = MARGIN_MM;
      }
      pdf.text(line, MARGIN_MM, cursorY);
      cursorY += customLineHeight;
    });
    
    const safeResumeName = resumeName?.replace(/\s+/g, '_') || 'Applicant';
    pdf.save(`${safeResumeName}_Cover_Letter.pdf`);

  } catch (error) {
    console.error('Error generating cover letter PDF:', error);
    alert('Failed to generate cover letter PDF. Please try again.');
  }
}
