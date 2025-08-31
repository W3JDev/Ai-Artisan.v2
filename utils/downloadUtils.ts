import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData } from '../types'; 

// A4 page dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 10; // 1cm margin

export async function downloadResumeAsPdf(element: HTMLElement, resumeName: string): Promise<void> {
  // 'element' is now expected to be 'resume-inner-content-for-pdf'
  if (!element) {
    console.error('Resume inner content element not found for PDF generation.');
    alert('Error: Could not find resume content to generate PDF.');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff', 
      onclone: (clonedDoc) => { 
        // The button is outside the 'element' being cloned if 'element' is the inner div.
        // However, finding it in the clonedDoc (which is a clone of the whole document) and hiding it is still a good safety measure.
        const button = clonedDoc.getElementById('download-resume-pdf-button');
        if (button) button.style.display = 'none';
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pagePrintableWidth = A4_WIDTH_MM - 2 * MARGIN_MM;
    const pagePrintableHeight = A4_HEIGHT_MM - 2 * MARGIN_MM;

    const imgActualWidth = imgProps.width;
    const imgActualHeight = imgProps.height;

    const widthScaleFactor = pagePrintableWidth / imgActualWidth;
    const heightScaleFactor = pagePrintableHeight / imgActualHeight;
    const scale = Math.min(widthScaleFactor, heightScaleFactor, 1); // Ensure we don't scale up beyond 100% if image is smaller than page

    const scaledWidth = imgActualWidth * scale;
    const scaledHeight = imgActualHeight * scale;
    
    const xOffset = MARGIN_MM + (pagePrintableWidth - scaledWidth) / 2;
    const yOffset = MARGIN_MM + (pagePrintableHeight - scaledHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
    
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