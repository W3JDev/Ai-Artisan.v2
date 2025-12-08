
/**
 * ARTISAN PRINT ENGINE (v5.0 - Vector Native)
 * 
 * Provides "Headless-Grade" PDF generation on the client side.
 * 
 * Key Features:
 * 1. Native Browser Rendering: Uses the browser's own PDF engine (Skia/Quartz) via window.print().
 * 2. Vector Text: All text remains selectable and searchable (ATS friendly).
 * 3. Smart Asset Loading: Waits for fonts and images to fully load before capturing.
 * 4. Auto-Scaling: Mathematically scales content to fit A4 without reflow issues.
 */

export const downloadResumeAsPdf = async (element: HTMLElement, filename: string): Promise<void> => {
  if (!element) {
    console.error('Resume content element not found.');
    return;
  }

  // --- 1. PRE-CALCULATION & CLONING ---
  // A4 Dimensions at 96 DPI (Web Standard)
  const A4_WIDTH_PX = 794; 
  const A4_HEIGHT_PX = 1123; 

  // Create a deep clone to manipulate for print without affecting UI
  const printContent = element.cloneNode(true) as HTMLElement;
  
  // Measure the "Natural" height of the content
  // We mount it temporarily off-screen to measure true scrollHeight
  const measureContainer = document.createElement('div');
  measureContainer.style.width = `${A4_WIDTH_PX}px`;
  measureContainer.style.visibility = 'hidden';
  measureContainer.style.position = 'absolute';
  measureContainer.appendChild(printContent);
  document.body.appendChild(measureContainer);
  
  const contentHeight = printContent.scrollHeight;
  const contentWidth = printContent.scrollWidth;
  document.body.removeChild(measureContainer);

  // Calculate Scale Factor (Shrink to fit if necessary)
  const availableHeight = A4_HEIGHT_PX - 20; // 20px buffer
  let scaleFactor = 1;
  if (contentHeight > availableHeight) {
      scaleFactor = availableHeight / contentHeight;
      // Cap minimum scale to ensure readability (approx 6pt font equivalent)
      scaleFactor = Math.max(scaleFactor, 0.65); 
  }

  // --- 2. IFRAME SANDBOX SETUP ---
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px'; // Move off-screen
  iframe.style.top = '0';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-1000';
  
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
      document.body.removeChild(iframe);
      return;
  }

  // --- 3. ASSET EXTRACTION ---
  // Capture current stylesheets to replicate exact look
  const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
  const styleHTML = Array.from(styles).map(style => style.outerHTML).join('\n');
  
  // Capture Tailwind state
  const tailwindConfig = (window as any).tailwind?.config;

  // --- 4. RENDER PIPELINE ---
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${filename}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Inject App Styles -->
        ${styleHTML}
        
        <!-- Inject Tailwind -->
        <script>
          ${tailwindConfig ? `window.tailwind = { config: ${JSON.stringify(tailwindConfig)} };` : ''}
        </script>

        <style>
          /* PRINT RESET */
          @page {
            size: A4 portrait;
            margin: 0mm; /* Remove browser default margins */
          }
          
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
              background-color: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              overflow: hidden; /* Prevent spillover pages */
            }
            
            /* Scaling Container */
            #print-scaler {
                width: 210mm;
                height: 297mm;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                transform-origin: top center;
                /* Apply calculated scale */
                transform: scale(${scaleFactor});
            }
            
            /* Ensure High Quality Rendering */
            * {
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
            }
          }

          body {
            background-color: white;
            font-family: 'Inter', sans-serif;
          }
        </style>
      </head>
      <body>
        <div id="print-scaler">
            <!-- Content Injected Here -->
            ${element.innerHTML}
        </div>

        <script>
           // --- 5. ROBUST LOADING & TRIGGER ---
           async function triggerPrint() {
             // Wait for fonts to be ready
             await document.fonts.ready;
             
             // Wait for all images to load
             const images = document.getElementsByTagName('img');
             const imagePromises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
             });
             await Promise.all(imagePromises);

             // Small buffer for layout reflow
             setTimeout(() => {
                try {
                    window.focus(); 
                    window.print();
                } catch (e) {
                    console.error('Print trigger failed', e);
                }
             }, 500);
           }

           window.onload = triggerPrint;
        </script>
      </body>
    </html>
  `);
  doc.close();

  // --- 6. CLEANUP ---
  // Remove iframe after user interacts with print dialog (1 minute timeout)
  setTimeout(() => {
    if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
    }
  }, 60000);
};

export const downloadCoverLetterAsPdf = (letterText: string, resumeName?: string): void => {
  // Convert text newlines to HTML paragraphs for proper formatting
  const formattedText = letterText
    .split('\n')
    .map(para => para.trim() ? `<p class="mb-4 leading-relaxed whitespace-pre-wrap text-justify text-slate-800">${para}</p>` : '<br/>')
    .join('');

  // Create a clean container for the cover letter
  const dummyElement = document.createElement('div');
  dummyElement.className = "p-12 font-sans w-full bg-white leading-relaxed text-[10pt]";
  dummyElement.innerHTML = `
    <div class="max-w-[210mm] mx-auto h-full flex flex-col">
        ${formattedText}
    </div>
  `;

  downloadResumeAsPdf(dummyElement, `${resumeName || 'Cover_Letter'}_CL`);
};
