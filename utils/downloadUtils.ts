
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// A4 page dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 15;

/**
 * Downloads a rendered HTML element as a multi-page PDF document.
 * @param element The HTML element to be captured for the PDF.
 * @param resumeName The base name for the downloaded PDF file.
 */
export async function downloadResumeAsPdf(element: HTMLElement, resumeName: string): Promise<void> {
  if (!element) {
    console.error('Resume content element not found for PDF generation.');
    alert('Error: Could not find resume content to generate PDF.');
    return;
  }

  // Add a class to disable shadows and transitions for a cleaner capture.
  element.classList.add('pdf-capturing');

  try {
    // Generate a high-resolution canvas from the HTML element.
    // A higher scale (e.g., 3) improves text clarity in the final PDF.
    const fullContentCanvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });
    
    // Remove the temporary class after capture is complete.
    element.classList.remove('pdf-capturing');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageContentWidth = A4_WIDTH_MM - MARGIN_MM * 2;
    const pageContentHeight = A4_HEIGHT_MM - MARGIN_MM * 2;

    const canvasWidth = fullContentCanvas.width;
    const canvasHeight = fullContentCanvas.height;

    // The logic maintains the aspect ratio of the captured content.
    // We calculate the scale factor between the canvas width and the PDF's printable width.
    const canvasToPdfScale = pageContentWidth / canvasWidth;

    // Using this scale, we can determine how much of the canvas's height fits onto one PDF page.
    const onePageCanvasHeight = pageContentHeight / canvasToPdfScale;

    let canvasYPosition = 0;

    // Loop through the tall canvas, slicing it into page-sized chunks.
    // NOTE: This method can cause content (like a line of text) to be clipped if it
    // falls directly on a page break. This is a known limitation of this client-side
    // HTML-to-PDF approach. The margin helps, but cannot fully prevent it.
    while (canvasYPosition < canvasHeight) {
      if (canvasYPosition > 0) { // Add a new page for all but the first slice
        pdf.addPage();
      }

      // Determine the height of the canvas slice for the current page.
      const sliceHeight = Math.min(onePageCanvasHeight, canvasHeight - canvasYPosition);

      // Create a temporary canvas to hold just the slice for the current page.
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = sliceHeight;
      const pageCtx = pageCanvas.getContext('2d');

      if (pageCtx) {
        // Draw the slice from the main canvas onto the temporary page canvas.
        pageCtx.drawImage(
          fullContentCanvas,
          0, // sourceX
          canvasYPosition, // sourceY
          canvasWidth, // sourceWidth
          sliceHeight, // sourceHeight
          0, // destX
          0, // destY
          canvasWidth, // destWidth
          sliceHeight  // destHeight
        );

        // Using PNG for lossless quality, which is ideal for text.
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        
        // Calculate the height of this specific image slice when placed in the PDF, maintaining aspect ratio.
        const pdfImageHeight = sliceHeight * canvasToPdfScale;
        
        pdf.addImage(
          pageImgData,
          'PNG',
          MARGIN_MM, // x
          MARGIN_MM, // y
          pageContentWidth, // width
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
    // Ensure the class is removed even if an error occurs.
    element.classList.remove('pdf-capturing');
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
