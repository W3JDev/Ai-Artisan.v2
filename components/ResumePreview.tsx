
import React, { useState, useRef, useEffect } from 'react';
import type { ResumePreviewProps, ResumeData, ResumeSettings } from '../types';
import { MailIcon, PhoneIcon, LinkedInIcon, LocationMarkerIcon, DownloadIcon, ClipboardCopyIcon, CheckIcon, DocumentTextIcon, XMarkIcon, GlobeAltIcon } from './icons';
import { downloadResumeAsPdf } from '../utils/downloadUtils';
import { linkifyText, formatResumeDataAsText } from '../utils/textUtils';

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, fontGroup, settings, headshotImage }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showDownloadPopover, setShowDownloadPopover] = useState(false);
  const [filename, setFilename] = useState(data.name ? `${data.name.replace(/\s+/g, '_')}_Resume` : 'Resume');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Safe Skills Extraction
  const skillsList = Array.isArray(data.skills) 
    ? data.skills 
    : (typeof data.skills === 'string' ? (data.skills as string).split(',').map(s => s.trim()).filter(Boolean) : []);

  const handleDownload = async () => {
    setShowDownloadPopover(false);
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
  // Using precise MM values for A4 accuracy
  // Standard A4 Print Margin: ~15-25mm
  const getMarginClass = () => {
    switch(settings.margin) {
        case 'compact': return 'p-[12.7mm]'; // 0.5 inch
        case 'generous': return 'p-[25.4mm]'; // 1 inch
        case 'standard': default: return 'p-[19mm]'; // 0.75 inch
    }
  };

  const getFontSizeClass = () => {
      switch(settings.fontSizeScale) {
          case 'small': return 'text-[9pt] leading-[1.3]'; 
          case 'large': return 'text-[11pt] leading-[1.45]'; 
          case 'medium': default: return 'text-[10pt] leading-[1.35]'; 
      }
  };

  // --- Styles for A4 Paper ---
  // STRICT DIMENSIONS: 210mm x 297mm
  const a4Styles = {
      width: '210mm',
      height: '297mm', // Fixed height
      backgroundColor: 'white',
      color: '#1e293b', // slate-800
      boxSizing: 'border-box' as const,
      margin: '0 auto', 
      overflow: 'hidden', // Ensure no bleed
      position: 'relative' as const,
  };

  // --- RENDER HELPERS ---
  const renderContactLine = (separator = ' • ') => (
    <div className="flex flex-wrap items-center justify-center gap-x-1 text-inherit">
      {data.contact?.email && <span className="whitespace-nowrap">{data.contact.email}</span>}
      {data.contact?.phone && <><span className="opacity-50">{separator}</span><span className="whitespace-nowrap">{data.contact.phone}</span></>}
      {data.contact?.location && <><span className="opacity-50">{separator}</span><span className="whitespace-nowrap">{data.contact.location}</span></>}
      {data.contact?.linkedin && <><span className="opacity-50">{separator}</span><a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="whitespace-nowrap hover:underline">LinkedIn</a></>}
      {data.contact?.portfolio && <><span className="opacity-50">{separator}</span><a href={data.contact.portfolio} target="_blank" rel="noreferrer" className="whitespace-nowrap hover:underline">Portfolio</a></>}
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

      {/* Main Resume Container */}
      <div 
        id="resume-inner-content-for-pdf"
        className={`shadow-2xl relative mx-auto bg-white ${getFontSizeClass()}`}
        style={a4Styles}
      >
        <div className={`h-full w-full flex flex-col ${getMarginClass()} relative z-10`}>
          
          {/* --- TEMPLATE LOGIC --- */}
          {(() => {
            switch(template) {
              case 'classic-serif':
                return (
                  // HARVARD/IVY LEAGUE STYLE (Strict, Dense, Serif)
                  // Best for: Finance, Law, Academia
                  <div className="h-full font-serif text-gray-900 flex flex-col">
                     <div className="text-center mb-6 flex-shrink-0">
                        <h1 className="text-[22pt] font-bold uppercase tracking-widest text-black mb-2">{data.name}</h1>
                        <div className="text-[9pt] text-gray-600 border-b border-gray-400 pb-3">{renderContactLine(' • ')}</div>
                     </div>

                     <div className="flex-grow space-y-5">
                        {data.summary && (
                          <div className="">
                            <h3 className="text-[10pt] font-bold uppercase text-black border-b border-black mb-2 pb-0.5 tracking-wider">Professional Profile</h3>
                            <p className="text-justify leading-relaxed">{linkifyText(data.summary)}</p>
                          </div>
                        )}

                        <div className="">
                          <h3 className="text-[10pt] font-bold uppercase text-black border-b border-black mb-2 pb-0.5 tracking-wider">Experience</h3>
                          <div className="space-y-4">
                            {(data.experience || []).map((exp, i) => (
                                <div key={i}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="font-bold text-[11pt]">{exp.company}</span>
                                    <span className="text-[10pt] font-medium text-gray-800">{exp.dates}</span>
                                </div>
                                <div className="text-[10pt] italic font-semibold mb-1 text-gray-700">{exp.role}</div>
                                <ul className="list-disc ml-4 space-y-0.5 marker:text-black/70">
                                    {(exp.responsibilities || []).map((r, j) => <li key={j} className="pl-1 text-gray-900 leading-snug">{linkifyText(r)}</li>)}
                                </ul>
                                </div>
                            ))}
                          </div>
                        </div>

                        <div className="">
                            <h3 className="text-[10pt] font-bold uppercase text-black border-b border-black mb-2 pb-0.5 tracking-wider">Education</h3>
                            <div className="space-y-1">
                                {(data.education || []).map((edu, i) => (
                                <div key={i} className="flex justify-between items-start">
                                    <div>
                                        <span className="font-bold">{edu.institution}</span>, {edu.details}
                                    </div>
                                    <div className="italic text-right">{edu.degree}</div>
                                </div>
                                ))}
                            </div>
                        </div>

                        {(data.skills || []).length > 0 && (
                            <div className="flex-shrink-0 pt-2">
                                <h3 className="text-[10pt] font-bold uppercase text-black border-b border-black mb-2 pb-0.5 tracking-wider">Skills & Expertise</h3>
                                <div className="text-[10pt] leading-normal text-justify">{skillsList.join(' • ')}</div>
                            </div>
                        )}
                     </div>
                  </div>
                );

              case 'enterprise-pro':
                 return (
                    // MODERN CORPORATE (Clean, High Contrast, Structured)
                    // Best for: Tech, Business, Marketing
                    <div className="h-full flex flex-col font-sans text-slate-800">
                        <div className="flex justify-between items-start mb-6 border-b-2 border-slate-900 pb-5 flex-shrink-0">
                            <div className="flex-1 pr-4">
                                <h1 className="text-[28pt] font-extrabold uppercase tracking-tight text-slate-900 mb-1 leading-none">{data.name}</h1>
                                <p className="text-[11pt] text-accent font-bold tracking-widest uppercase mb-3">{data.jobTitle}</p>
                                
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9pt] text-slate-600 font-medium">
                                    {data.contact?.location && <span className="flex items-center"><LocationMarkerIcon className="w-3 h-3 mr-1 text-slate-400"/> {data.contact.location}</span>}
                                    {data.contact?.phone && <span className="flex items-center"><PhoneIcon className="w-3 h-3 mr-1 text-slate-400"/> {data.contact.phone}</span>}
                                    {data.contact?.email && <span className="flex items-center"><MailIcon className="w-3 h-3 mr-1 text-slate-400"/> {data.contact.email}</span>}
                                    {data.contact?.linkedin && <span className="flex items-center"><LinkedInIcon className="w-3 h-3 mr-1 text-slate-400"/> LinkedIn</span>}
                                </div>
                            </div>
                            {headshotImage && (
                                <div className="w-[22mm] h-[22mm] rounded-full overflow-hidden border-2 border-slate-100 shadow-sm flex-shrink-0">
                                    <img src={headshotImage} alt="Professional Headshot" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
        
                        {data.summary && (
                            <div className="mb-6 flex-shrink-0">
                                <h3 className="text-[9pt] font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-accent"></span> Executive Profile
                                </h3>
                                <p className="text-slate-700 leading-relaxed text-justify">{linkifyText(data.summary)}</p>
                            </div>
                        )}
        
                        <div className="mb-6 flex-grow">
                            <h3 className="text-[9pt] font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1 h-4 bg-accent"></span> Experience
                            </h3>
                            <div className="space-y-6">
                                {(data.experience || []).map((exp, i) => (
                                    <div key={i} className="relative">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <div>
                                                <span className="font-bold text-[11pt] text-slate-900 block">{exp.company}</span>
                                                <span className="text-[10pt] font-semibold text-accent uppercase tracking-wide block text-[8pt]">{exp.role}</span>
                                            </div>
                                            <span className="text-[9pt] font-bold text-slate-500 text-right whitespace-nowrap">{exp.dates}</span>
                                        </div>
                                        <ul className="list-none ml-0 text-slate-700 space-y-1.5 mt-2">
                                            {(exp.responsibilities || []).map((r, j) => (
                                                <li key={j} className="pl-4 relative before:content-['▹'] before:absolute before:left-0 before:text-accent">
                                                    {linkifyText(r)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
        
                        <div className="grid grid-cols-2 gap-8 mt-auto pt-4 border-t border-slate-200 flex-shrink-0">
                            <div>
                                <h3 className="text-[9pt] font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-accent"></span> Education
                                </h3>
                                <div className="space-y-3">
                                     {(data.education || []).map((edu, i) => (
                                        <div key={i}>
                                            <div className="font-bold text-slate-900">{edu.institution}</div>
                                            <div className="text-[9pt] text-slate-600">{edu.degree}</div>
                                            <div className="text-[8pt] text-slate-500">{edu.details}</div>
                                        </div>
                                     ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[9pt] font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-accent"></span> Competencies
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {skillsList.map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[8pt] font-semibold rounded">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                 );

              case 'modern-compact':
                return (
                  // MODERN SIDEBAR (Visual, Distinct, Compact)
                  // Best for: Creative, Startups, General
                  <div className="h-full flex flex-col font-sans">
                      <div className="flex h-full gap-8">
                          {/* Sidebar */}
                          <div className="w-[65mm] border-r border-gray-200 pr-5 h-full flex flex-col pt-2 flex-shrink-0">
                               {headshotImage && (
                                    <div className="w-[45mm] h-[45mm] rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 mx-auto flex-shrink-0 ring-1 ring-gray-100">
                                        <img src={headshotImage} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                )}
                               
                               <div className="text-right space-y-6">
                                   <div className="mb-6">
                                        <h3 className="text-[9pt] font-bold text-slate-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Contact</h3>
                                        <div className="text-[9pt] text-slate-500 space-y-2 font-medium break-words">
                                                {data.contact?.email && <div>{data.contact.email}</div>}
                                                {data.contact?.phone && <div>{data.contact.phone}</div>}
                                                {data.contact?.location && <div>{data.contact.location}</div>}
                                                {data.contact?.linkedin && <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline block truncate">LinkedIn</a>}
                                                {data.contact?.portfolio && <a href={data.contact.portfolio} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline block truncate">Portfolio</a>}
                                        </div>
                                   </div>

                                   <div className="mb-6">
                                        <h3 className="text-[9pt] font-bold text-slate-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Education</h3>
                                        <div className="space-y-3">
                                            {(data.education || []).map((edu, i) => (
                                                <div key={i}>
                                                    <div className="font-bold text-slate-800 text-[9pt] leading-tight">{edu.institution}</div>
                                                    <div className="text-[9pt] text-sky-700 mt-0.5">{edu.degree}</div>
                                                </div>
                                            ))}
                                        </div>
                                   </div>

                                   <div className="flex-grow">
                                        <h3 className="text-[9pt] font-bold text-slate-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Skills</h3>
                                        <div className="flex flex-wrap justify-end gap-2">
                                            {skillsList.map(s => <span key={s} className="text-[8pt] text-slate-600 bg-slate-50 px-2 py-1 rounded text-right">{s}</span>)}
                                        </div>
                                   </div>
                               </div>
                          </div>
    
                          {/* Main Content */}
                          <div className="flex-1 pt-2 flex flex-col">
                               <div className="mb-8 border-b-2 border-sky-500 pb-4">
                                   <h1 className="text-[24pt] font-bold text-slate-900 leading-tight mb-1">{data.name}</h1>
                                   <p className="text-[12pt] text-sky-700 font-semibold uppercase tracking-wide">{data.jobTitle}</p>
                               </div>

                              {data.summary && (
                                  <div className="mb-6 flex-shrink-0">
                                      <p className="text-slate-600 leading-relaxed font-medium italic text-[10pt] border-l-4 border-sky-100 pl-4 py-1">{data.summary}</p>
                                  </div>
                              )}
                               
                               <h3 className="text-[10pt] font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-1 w-full">Experience</h3>
                               <div className="space-y-6 flex-grow">
                                    {(data.experience || []).map((exp, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-[11pt] text-slate-900">{exp.role}</h4>
                                                <span className="text-[9pt] font-mono text-slate-400 bg-slate-50 px-2 rounded whitespace-nowrap">{exp.dates}</span>
                                            </div>
                                            <div className="text-[10pt] font-semibold text-sky-700 mb-2 uppercase tracking-wide">{exp.company}</div>
                                            <ul className="space-y-1.5">
                                                {(exp.responsibilities || []).map((r,j) => (
                                                    <li key={j} className="text-[10pt] text-slate-600 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-sky-300 leading-relaxed">
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

              case 'swiss-grid':
                return (
                   // SWISS GRID (Strict Grid, Helvetica-ish, Heavy Header)
                   // Best for: Design, Architecture, European Markets
                   <div className="h-full flex flex-col font-sans text-slate-900 -m-[19mm] w-[210mm] h-[297mm]"> 
                      <header className="bg-slate-900 text-white p-[15mm] pt-[12mm] flex justify-between items-start flex-shrink-0 h-[50mm]">
                          <div>
                             <h1 className="text-[26pt] font-bold mb-1 leading-none tracking-tight">{data.name}</h1>
                             <div className="text-slate-300 text-[12pt] font-medium tracking-wide opacity-80">{data.jobTitle}</div>
                          </div>
                          <div className="text-right text-[9pt] text-slate-300 space-y-1 font-mono opacity-80">
                             {data.contact?.email && <div>{data.contact.email}</div>}
                             {data.contact?.phone && <div>{data.contact.phone}</div>}
                             {data.contact?.location && <div>{data.contact.location}</div>}
                             {data.contact?.linkedin && <div>LinkedIn Profile</div>}
                          </div>
                      </header>

                      <div className="flex-1 grid grid-cols-12 px-[15mm] py-[10mm] gap-8 bg-white h-full overflow-hidden">
                          {/* Main Left Col */}
                          <div className="col-span-8 space-y-8 pr-4 border-r border-slate-100">
                             {data.summary && (
                                <section>
                                   <h3 className="text-[9pt] font-bold uppercase tracking-widest mb-3 text-slate-400">01 Profile</h3>
                                   <p className="text-[10pt] leading-relaxed font-medium">{linkifyText(data.summary)}</p>
                                </section>
                             )}
                             
                             <section>
                                <h3 className="text-[9pt] font-bold uppercase tracking-widest mb-4 text-slate-400">02 Experience</h3>
                                <div className="space-y-6">
                                    {(data.experience || []).map((exp, i) => (
                                        <div key={i}>
                                            <div className="font-bold text-[11pt] mb-0.5">{exp.role}</div>
                                            <div className="text-[10pt] text-slate-500 mb-2 font-medium">{exp.company} <span className="mx-1">/</span> {exp.dates}</div>
                                            <ul className="list-disc ml-4 space-y-1 marker:text-slate-300">
                                                {(exp.responsibilities || []).map((r,j) => (
                                                    <li key={j} className="pl-1 text-[9.5pt] leading-relaxed text-slate-700">{linkifyText(r)}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                             </section>
                          </div>

                          {/* Right Meta Col */}
                          <div className="col-span-4 space-y-8">
                             {headshotImage && (
                                <div className="w-full aspect-square bg-slate-100 mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                                    <img src={headshotImage} alt="Profile" className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                             )}

                             <section>
                                <h3 className="text-[9pt] font-bold uppercase tracking-widest mb-3 text-slate-400">03 Education</h3>
                                <div className="space-y-4">
                                    {(data.education || []).map((edu, i) => (
                                        <div key={i} className="border-l-2 border-slate-900 pl-3">
                                            <div className="font-bold text-[9pt]">{edu.institution}</div>
                                            <div className="text-[9pt] text-slate-600 mt-1">{edu.degree}</div>
                                        </div>
                                    ))}
                                </div>
                             </section>

                             <section>
                                <h3 className="text-[9pt] font-bold uppercase tracking-widest mb-3 text-slate-400">04 Skills</h3>
                                <div className="flex flex-col gap-2">
                                    {skillsList.map((s, i) => (
                                        <div key={i} className="text-[9pt] font-medium border-b border-slate-100 pb-1">{s}</div>
                                    ))}
                                </div>
                             </section>
                          </div>
                      </div>
                   </div>
                );

              case 'minimal-sans':
              default:
                return (
                    // MINIMAL SANS (Clean, No-Nonsense, ATS Optimized)
                    // Best for: General, US Market
                    <div className="h-full flex flex-col font-sans text-gray-800">
                        <div className="mb-6 flex-shrink-0">
                            <h1 className="text-[24pt] font-semibold text-black mb-1">{data.name}</h1>
                            <div className="text-[10pt] text-gray-600 mb-2 font-medium uppercase tracking-wide">{data.jobTitle}</div>
                            <div className="text-[9pt] text-gray-500 flex flex-wrap gap-3">
                                {data.contact?.location && <span className="flex items-center gap-1"><LocationMarkerIcon className="w-3 h-3"/> {data.contact.location}</span>}
                                {data.contact?.email && <span className="flex items-center gap-1"><MailIcon className="w-3 h-3"/> {data.contact.email}</span>}
                                {data.contact?.phone && <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3"/> {data.contact.phone}</span>}
                                {data.contact?.linkedin && <span className="flex items-center gap-1"><LinkedInIcon className="w-3 h-3"/> LinkedIn</span>}
                            </div>
                        </div>

                        {data.summary && (
                            <div className="mb-6">
                                <p className="text-gray-700 leading-relaxed">{linkifyText(data.summary)}</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-[10pt] font-bold uppercase text-black mb-3 pb-1 border-b border-gray-200">Experience</h3>
                            <div className="space-y-5">
                                {(data.experience || []).map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between font-bold text-[10.5pt] text-black">
                                            <span>{exp.role}</span>
                                            <span>{exp.dates}</span>
                                        </div>
                                        <div className="text-[10pt] text-gray-600 mb-1.5 font-medium">{exp.company}</div>
                                        <ul className="list-disc ml-4 space-y-1 marker:text-gray-400">
                                            {(exp.responsibilities || []).map((r, j) => (
                                                <li key={j} className="pl-1 text-gray-700 leading-snug">{linkifyText(r)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-8">
                                <h3 className="text-[10pt] font-bold uppercase text-black mb-3 pb-1 border-b border-gray-200">Education</h3>
                                <div className="space-y-3">
                                    {(data.education || []).map((edu, i) => (
                                        <div key={i}>
                                            <div className="font-bold text-black">{edu.institution}</div>
                                            <div className="text-gray-600">{edu.degree}</div>
                                            {edu.details && <div className="text-gray-500 text-[9pt] mt-0.5">{edu.details}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-4">
                                <h3 className="text-[10pt] font-bold uppercase text-black mb-3 pb-1 border-b border-gray-200">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillsList.map((s, i) => (
                                        <span key={i} className="text-[9pt] bg-gray-100 text-gray-700 px-2 py-1 rounded">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
          })()}
          
          {/* Subtle Watermark - Absolute bottom of the A4 container */}
          <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none print:block opacity-30">
             <span className="text-[7pt] text-slate-400 font-sans tracking-widest uppercase">Created with AI Resume Artisan</span>
          </div>

        </div>
      </div>
    </div>
  );
};
