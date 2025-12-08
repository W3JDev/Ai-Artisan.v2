
import React, { useState, useRef, useEffect } from 'react';
import type { ResumePreviewProps, ResumeData, ResumeSettings } from '../types';
import { MailIcon, PhoneIcon, LinkedInIcon, LocationMarkerIcon, DownloadIcon, ClipboardCopyIcon, CheckIcon, DocumentTextIcon, XMarkIcon } from './icons';
import { downloadResumeAsPdf } from '../utils/downloadUtils';
import { linkifyText, formatResumeDataAsText } from '../utils/textUtils';

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, fontGroup, settings, headshotImage }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showDownloadPopover, setShowDownloadPopover] = useState(false);
  const [filename, setFilename] = useState(data.name ? `${data.name.replace(/\s+/g, '_')}_Resume` : 'Resume');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Safe Skills Extraction: Ensures skills is always an array, handling string cases from legacy data
  const skillsList = Array.isArray(data.skills) 
    ? data.skills 
    : (typeof data.skills === 'string' ? (data.skills as string).split(',').map(s => s.trim()).filter(Boolean) : []);

  const handleDownload = async () => {
    setShowDownloadPopover(false);
    // CRITICAL: This ID must match what downloadUtils expects
    const element = document.getElementById('resume-inner-content-for-pdf');
    if (element) await downloadResumeAsPdf(element, filename);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatResumeDataAsText(data));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
            setShowDownloadPopover(false);
        }
    };
    if(showDownloadPopover) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDownloadPopover]);


  const getFontClass = () => {
    switch(fontGroup) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  // --- Dynamic Settings Logic ---
  const getMarginClass = () => {
    switch(settings.margin) {
        case 'compact': return 'p-8'; // ~2cm
        case 'generous': return 'p-14'; // ~3.5cm
        case 'standard': default: return 'p-12'; // ~3cm
    }
  };

  const getFontSizeClass = () => {
      switch(settings.fontSizeScale) {
          case 'small': return 'text-[9pt]'; 
          case 'large': return 'text-[11pt]'; 
          case 'medium': default: return 'text-[10pt]'; 
      }
  };

  // --- Styles for A4 Paper ---
  // STRICT DIMENSIONS: 210mm x 297mm
  // We use inline styles here to guarantee these exact dimensions are passed to the print logic
  const a4Styles = {
      width: '210mm',
      height: '297mm', // Fixed height for one-pager visualization
      minHeight: '297mm',
      backgroundColor: 'white',
      color: '#1e293b', // slate-800
      boxSizing: 'border-box' as const,
      margin: '0 auto', // Center in the preview window
      overflow: 'hidden' // Force visual cut off in preview to encourage editing
  };

  // --- RENDER HELPERS ---
  const renderContactLine = (separator = ' | ') => (
    <div className="flex flex-wrap items-center justify-center gap-x-1 text-inherit">
      {data.contact?.email && <span>{data.contact.email}</span>}
      {data.contact?.phone && <>{separator}<span>{data.contact.phone}</span></>}
      {data.contact?.location && <>{separator}<span>{data.contact.location}</span></>}
      {data.contact?.linkedin && <>{separator}<span>LinkedIn</span></>}
      {data.contact?.portfolio && <>{separator}<span>Portfolio</span></>}
    </div>
  );

  return (
    <div className={`relative group ${getFontClass()} antialiased`}>
      {/* Floating Action Bar */}
      <div className={`absolute top-4 right-[-60px] flex flex-col space-y-3 transition-all duration-500 z-50 ${showDownloadPopover ? 'opacity-100 right-[-60px]' : 'opacity-0 group-hover:opacity-100 group-hover:right-[-50px]'}`}>
        <button onClick={handleCopy} className="p-3 bg-white text-obsidian rounded-full shadow-2xl border border-gray-200 hover:scale-110 transition-transform relative group/tooltip">
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-600"/> : <ClipboardCopyIcon className="w-4 h-4"/>}
            <span className="absolute right-12 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">Copy Text</span>
        </button>
        
        <div className="relative">
            <button onClick={() => setShowDownloadPopover(!showDownloadPopover)} className="p-3 bg-obsidian text-white rounded-full shadow-2xl hover:scale-110 transition-transform relative group/tooltip">
                <DownloadIcon className="w-4 h-4"/>
                <span className="absolute right-12 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">Export PDF</span>
            </button>
            
            {/* Download Popover */}
            {showDownloadPopover && (
                <div ref={popoverRef} className="absolute right-14 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 animate-fade-in-up z-50 text-gray-800">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Export Options</span>
                        <button onClick={() => setShowDownloadPopover(false)}><XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600"/></button>
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">Filename</label>
                        <div className="flex items-center border border-gray-200 rounded px-2 py-1.5 focus-within:ring-1 focus-within:ring-gray-400">
                            <DocumentTextIcon className="w-4 h-4 text-gray-400 mr-2"/>
                            <input 
                                type="text" 
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="w-full text-sm text-gray-700 outline-none"
                            />
                            <span className="text-xs text-gray-400 ml-1">.pdf</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleDownload}
                        className="w-full bg-gray-900 text-white text-xs font-bold py-2 rounded hover:bg-black transition-colors"
                    >
                        Auto-Fit & Download
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Main Resume Container - A4 STRICT */}
      <div 
        id="resume-inner-content-for-pdf"
        className={`shadow-2xl relative mx-auto bg-white ${getFontSizeClass()}`}
        style={a4Styles}
      >
        <div className={`h-full w-full flex flex-col ${getMarginClass()}`}>
          
          {/* --- TEMPLATE LOGIC --- */}
          {(() => {
            switch(template) {
              case 'classic-serif':
                return (
                  // HARVARD CLASSIC STYLE
                  <div className="h-full font-serif text-gray-900 flex flex-col">
                     <div className="text-center border-b-2 border-gray-900 pb-4 mb-6 flex-shrink-0">
                        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">{data.name}</h1>
                        <div className="text-sm italic mb-2">{data.jobTitle}</div>
                        <div className="text-xs text-gray-600">{renderContactLine(' • ')}</div>
                     </div>

                     <div className="flex-grow space-y-5">
                        {data.summary && (
                          <div className="">
                            <h3 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1">Professional Summary</h3>
                            <p className="text-justify leading-relaxed">{linkifyText(data.summary)}</p>
                          </div>
                        )}

                        <div className="">
                          <h3 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">Experience</h3>
                          {(data.experience || []).map((exp, i) => (
                            <div key={i} className="mb-4">
                              <div className="flex justify-between font-bold text-sm">
                                <span>{exp.company}</span>
                                <span>{exp.dates}</span>
                              </div>
                              <div className="italic text-sm mb-1">{exp.role}</div>
                              <ul className="list-disc ml-5 space-y-1">
                                {(exp.responsibilities || []).map((r, j) => <li key={j} className="pl-1 text-gray-800">{linkifyText(r)}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="">
                            <h3 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">Education</h3>
                            {(data.education || []).map((edu, i) => (
                              <div key={i} className="mb-2">
                                <div className="flex justify-between font-bold text-sm">
                                  <span>{edu.institution}</span>
                                  <span className="font-normal">{edu.details}</span>
                                </div>
                                <div className="italic text-sm">{edu.degree}</div>
                              </div>
                            ))}
                        </div>
                     </div>

                     <div className="mt-auto pt-4 flex-shrink-0">
                        <h3 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1">Skills</h3>
                        <div className="text-sm">{skillsList.join(' • ')}</div>
                     </div>
                  </div>
                );

              case 'minimal-sans':
                return (
                  // SILICON VALLEY MINIMALIST
                  <div className="h-full font-sans text-slate-800 flex flex-col">
                      <div className="mb-8 flex-shrink-0">
                         <h1 className="text-4xl font-extrabold tracking-tight text-black mb-1">{data.name}</h1>
                         <p className="text-lg text-slate-500 mb-3 font-medium">{data.jobTitle}</p>
                         <div className="text-xs text-slate-400 font-mono">
                            {data.contact?.email}  /  {data.contact?.phone}  /  {data.contact?.location}
                         </div>
                      </div>

                      {data.summary && (
                        <div className="mb-8 flex-shrink-0">
                           <p className="text-slate-600 leading-relaxed max-w-2xl">{linkifyText(data.summary)}</p>
                        </div>
                      )}

                      <div className="mb-8 flex-grow">
                         <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Experience</h3>
                         <div className="border-l-2 border-slate-100 pl-4 space-y-6">
                            {(data.experience || []).map((exp, i) => (
                               <div key={i} className="">
                                  <div className="flex items-baseline justify-between mb-1">
                                     <h4 className="font-bold text-slate-900">{exp.role}</h4>
                                     <span className="text-xs font-mono text-slate-400">{exp.dates}</span>
                                  </div>
                                  <div className="text-sm font-semibold text-slate-500 mb-2">{exp.company}</div>
                                  <ul className="space-y-1 text-slate-600">
                                     {(exp.responsibilities || []).map((r, j) => <li key={j}>— {linkifyText(r)}</li>)}
                                  </ul>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mt-auto pt-8 border-t border-slate-100 flex-shrink-0">
                         <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Education</h3>
                            {(data.education || []).map((edu, i) => (
                               <div key={i} className="mb-3">
                                  <div className="font-bold text-sm">{edu.institution}</div>
                                  <div className="text-xs text-slate-500">{edu.degree}</div>
                               </div>
                            ))}
                         </div>
                         <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                               {skillsList.map(s => <span key={s} className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-xs font-medium">{s}</span>)}
                            </div>
                         </div>
                      </div>
                  </div>
                );

              case 'swiss-grid':
                return (
                   // SWISS GRID
                   <div className="h-full flex flex-col font-sans -m-12 w-[calc(100%+6rem)] h-[calc(100%+6rem)]"> 
                      <header className="bg-slate-900 text-white p-12 mb-8 flex justify-between items-center flex-shrink-0">
                          <div>
                             <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
                             <div className="text-slate-400 text-sm">{data.jobTitle}</div>
                          </div>
                          <div className="text-right text-xs text-slate-400 space-y-1 font-mono">
                             {data.contact?.email && <div>{data.contact.email}</div>}
                             {data.contact?.phone && <div>{data.contact.phone}</div>}
                             {data.contact?.linkedin && <div>LinkedIn Profile</div>}
                          </div>
                      </header>

                      <div className="flex-1 grid grid-cols-12 gap-8 px-12 pb-12">
                          <div className="col-span-8 space-y-8">
                             {data.summary && (
                                <section>
                                   <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-b-2 border-slate-900 pb-1 w-10">Bio</h3>
                                   <p className="text-slate-700 leading-relaxed">{linkifyText(data.summary)}</p>
                                </section>
                             )}
                             <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b-2 border-slate-900 pb-1 w-10">Work</h3>
                                <div className="space-y-6">
                                    {(data.experience || []).map((exp, i) => (
                                        <div key={i}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-900">{exp.role}</span>
                                                <span className="text-slate-300">/</span>
                                                <span className="font-medium text-slate-700">{exp.company}</span>
                                            </div>
                                            <ul className="list-square ml-4 space-y-1 marker:text-slate-300">
                                                {(exp.responsibilities || []).map((r, j) => <li key={j} className="text-slate-600">{linkifyText(r)}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                             </section>
                          </div>

                          <div className="col-span-4 space-y-8 bg-slate-50 p-6 border-l border-slate-200 h-full">
                             <section className="pt-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Skills</h3>
                                <div className="space-y-2">
                                    {skillsList.map((s, i) => (
                                        <div key={i} className="text-xs font-mono text-slate-600 border-b border-slate-200 pb-1">{s}</div>
                                    ))}
                                </div>
                             </section>

                             <section>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Education</h3>
                                <div className="space-y-4">
                                   {(data.education || []).map((edu, i) => (
                                       <div key={i}>
                                           <div className="font-bold text-xs text-slate-900">{edu.institution}</div>
                                           <div className="text-xs text-slate-500">{edu.degree}</div>
                                       </div>
                                   ))}
                                </div>
                             </section>

                             {headshotImage && (
                                <div className="mt-8 border border-slate-200 p-1 bg-white shadow-sm">
                                    <img src={headshotImage} alt="Headshot" className="w-full grayscale contrast-125"/>
                                </div>
                             )}
                          </div>
                      </div>
                   </div>
                );

              case 'modern-compact':
                return (
                  <div className="h-full flex flex-col">
                      <div className="flex h-full gap-8">
                          <div className="w-1/3 border-r border-gray-200 pr-6 h-full flex flex-col">
                               {headshotImage && (
                                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-6 mx-auto flex-shrink-0">
                                        <img src={headshotImage} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                                    </div>
                                )}
                               <div className="flex-shrink-0 text-right">
                                   <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2 break-words">{data.name}</h1>
                                   <p className="text-sm text-sky-700 font-medium mb-6">{data.jobTitle}</p>
                                   
                                   <div className="text-xs text-slate-500 space-y-2 mb-8">
                                        {data.contact?.email && <div>{data.contact.email}</div>}
                                        {data.contact?.phone && <div>{data.contact.phone}</div>}
                                        {data.contact?.location && <div>{data.contact.location}</div>}
                                   </div>
                               </div>
    
                               <div className="mb-8 text-right flex-grow">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Skills</h3>
                                    <div className="flex flex-wrap justify-end gap-2">
                                        {skillsList.map(s => <span key={s} className="text-xs text-slate-600">{s}</span>)}
                                    </div>
                               </div>
    
                               {(data.education || []).length > 0 && (
                                   <div className="text-right flex-shrink-0 mt-auto">
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Education</h3>
                                        <div className="space-y-4">
                                            {data.education.map((edu, i) => (
                                                <div key={i}>
                                                    <div className="font-bold text-slate-800 text-xs">{edu.institution}</div>
                                                    <div className="text-[10px] text-sky-700">{edu.degree}</div>
                                                </div>
                                            ))}
                                        </div>
                                   </div>
                               )}
                          </div>
    
                          <div className="flex-1 pt-2 flex flex-col">
                              {data.summary && (
                                  <div className="mb-8 flex-shrink-0">
                                      <p className="text-slate-600 leading-relaxed font-medium text-sm">{data.summary}</p>
                                  </div>
                              )}
                               <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Experience</h3>
                               <div className="space-y-6 flex-grow">
                                    {(data.experience || []).map((exp, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-slate-800">{exp.role}</h4>
                                                <span className="text-xs font-mono text-slate-400">{exp.dates}</span>
                                            </div>
                                            <div className="text-xs font-semibold text-sky-700 mb-2 uppercase tracking-wide">{exp.company}</div>
                                            <ul className="space-y-1.5">
                                                {(exp.responsibilities || []).map((r,j) => (
                                                    <li key={j} className="text-sm text-slate-600 relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-sky-300">
                                                        {linkifyText(r)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                               </div>
                          </div>
                      </div>
                  </div>
                );

              case 'enterprise-pro':
              default:
                 return (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-start mb-8 border-b border-gray-900 pb-6 flex-shrink-0">
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-2">{data.name}</h1>
                                <p className="text-lg text-gray-600 font-serif italic mb-4">{data.jobTitle}</p>
                                
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 font-medium tracking-wide uppercase">
                                    {data.contact?.location && <span className="flex items-center"><LocationMarkerIcon className="w-3 h-3 mr-1"/> {data.contact.location}</span>}
                                    {data.contact?.phone && <span className="flex items-center"><PhoneIcon className="w-3 h-3 mr-1"/> {data.contact.phone}</span>}
                                    {data.contact?.email && <span className="flex items-center"><MailIcon className="w-3 h-3 mr-1"/> {data.contact.email}</span>}
                                    {data.contact?.linkedin && <span className="flex items-center"><LinkedInIcon className="w-3 h-3 mr-1"/> LinkedIn</span>}
                                </div>
                            </div>
                            {headshotImage && (
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg ml-6 flex-shrink-0">
                                    <img src={headshotImage} alt="Professional Headshot" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
        
                        {data.summary && (
                            <div className={`mb-6 flex-shrink-0`}>
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-3">Executive Profile</h3>
                                <p className="text-justify leading-relaxed text-gray-700">{linkifyText(data.summary)}</p>
                            </div>
                        )}
        
                        <div className={`mb-6 flex-grow`}>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-4">Professional Experience</h3>
                            <div className={`${settings.lineHeight === 'tight' ? 'space-y-4' : 'space-y-6'}`}>
                                {(data.experience || []).map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-bold text-base text-gray-900">{exp.company}</span>
                                            <span className="text-xs font-semibold text-gray-500 text-right">{exp.dates}</span>
                                        </div>
                                        <div className="text-sm font-serif italic text-gray-700 mb-2">{exp.role}</div>
                                        <ul className={`list-disc ml-4 text-gray-600 marker:text-gray-400 space-y-1`}>
                                            {(exp.responsibilities || []).map((r, j) => (
                                                <li key={j} className="pl-1">{linkifyText(r)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
        
                        <div className={`mb-6 flex-shrink-0`}>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-4">Education</h3>
                            <div className="space-y-3">
                                 {(data.education || []).map((edu, i) => (
                                    <div key={i} className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-gray-900">{edu.institution}</div>
                                            <div className="italic text-gray-700 font-serif">{edu.degree}</div>
                                        </div>
                                    </div>
                                 ))}
                            </div>
                        </div>
        
                        <div className="mt-auto pt-6 border-t border-gray-200 flex-shrink-0">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-3">Core Competencies</h3>
                            <div className="flex flex-wrap gap-x-2 gap-y-2 text-gray-600 text-xs">
                                {skillsList.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-gray-700 border border-gray-200">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                 );
            }
          })()}
          
        </div>
      </div>
    </div>
  );
};
