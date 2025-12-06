
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// A4 page dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 0; // We handle margins inside the CSS now for better control

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
    // Scale 5 provides near-print quality (~450-600 DPI equivalent)
    const fullContentCanvas = await html2canvas(element, {
      scale: 5, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff', // Force white background for the paper itself
      allowTaint: true,
      imageTimeout: 0, // Ensure images load
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(element.id);
        if (clonedElement) {
           clonedElement.style.boxShadow = 'none'; // Double ensure no outer shadows
           clonedElement.style.transform = 'none';
        }
      }
    });
    
    // Remove the temporary class after capture is complete.
    element.classList.remove('pdf-capturing');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const canvasWidth = fullContentCanvas.width;
    const canvasHeight = fullContentCanvas.height;

    // The logic maintains the aspect ratio of the captured content.
    const canvasToPdfScale = A4_WIDTH_MM / canvasWidth;

    // We calculate exactly how much fits on one page
    const onePageCanvasHeight = A4_HEIGHT_MM / canvasToPdfScale;

    let canvasYPosition = 0;

    // Loop through the tall canvas, slicing it into page-sized chunks.
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

        // Using JPEG with high quality (0.98) can sometimes be sharper/smaller than PNG for complex docs,
        // but PNG is safer for text sharpness. Let's stick to PNG for max crispness.
        const pageImgData = pageCanvas.toDataURL('image/png');
        
        pdf.addImage(
          pageImgData,
          'PNG',
          0, // x (0 because margins are internal)
          0, // y
          A4_WIDTH_MM, // width
          sliceHeight * canvasToPdfScale // height
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

    const usableWidth = A4_WIDTH_MM - 30; // 15mm margin * 2
    
    const lines = pdf.splitTextToSize(letterText, usableWidth);

    let cursorY = 15;
    const pdfLineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;
    const customLineHeight = pdfLineHeight * 1.2; 

    lines.forEach((line: string) => {
      if (cursorY + customLineHeight > A4_HEIGHT_MM - 15) {
        pdf.addPage();
        cursorY = 15;
      }
      pdf.text(line, 15, cursorY);
      cursorY += customLineHeight;
    });
    
    const safeResumeName = resumeName?.replace(/\s+/g, '_') || 'Applicant';
    pdf.save(`${safeResumeName}_Cover_Letter.pdf`);

  } catch (error) {
    console.error('Error generating cover letter PDF:', error);
    alert('Failed to generate cover letter PDF. Please try again.');
  }
}
