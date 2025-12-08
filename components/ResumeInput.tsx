
import React, { useState, useRef } from 'react';
import type { ResumeInputProps, TemplateName, FontGroupName, CoverLetterTone, TargetRegion, ResumeData } from '../types';
import { CogIcon, SparklesIcon, DocumentMagnifyingGlassIcon, GlobeAltIcon, CloudArrowUpIcon, CheckIcon, FloppyDiskIcon, LinkIcon, DocumentIcon, ArrowTrendingUpIcon, VideoCameraIcon, PlayCircleIcon, PhotoIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import { analyzeUploadedDocument, analyzeImportedResumeText, analyzeResumeFromLink, analyzeUploadedImage } from '../services/geminiService';
import * as mammoth from 'mammoth';

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[10px] font-bold text-subtle uppercase tracking-widest mb-2">{children}</label>
);

// New interface extension for passing the analysis handler from App.tsx without breaking existing props
interface ExtendedResumeInputProps extends ResumeInputProps {
    onAnalysisComplete?: (data: ResumeData) => void;
    onSaveVersion: () => void;
    onGenerateVideo: (prompt: string, aspectRatio: '16:9' | '9:16') => void;
    isGeneratingVideo: boolean;
    generatedVideoUrl: string | null;
}

export const ResumeInput: React.FC<ExtendedResumeInputProps> = ({
  rawText, onRawTextChange,
  jobDescription, onJobDescriptionChange,
  onGenerateResume, selectedTemplate, onTemplateChange,
  selectedFontGroup, onFontGroupChange, isGeneratingResume, onTryExample,
  targetRegion, onTargetRegionChange,
  settings, onSettingsChange,
  onGenerateHeadshot, isGeneratingHeadshot,
  onResearchTrends, isResearching, industryTrends,
  onAnalysisComplete,
  onSaveVersion,
  onGenerateVideo,
  isGeneratingVideo,
  generatedVideoUrl
}) => {
  
  const [openSection, setOpenSection] = useState<'content' | 'settings' | 'ai'>('content');
  const [importMode, setImportMode] = useState<'file' | 'link'>('file');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Video State
  const [videoPrompt, setVideoPrompt] = useState("Cinematic intro of a professional leader working in a modern office.");
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const handleSaveClick = () => {
      onSaveVersion();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
  };

  // Logic to auto-suggest templates based on region
  const handleRegionChange = (region: TargetRegion) => {
    onTargetRegionChange(region);
    // Smart Defaults
    if (region === 'US_CANADA' && selectedTemplate === 'swiss-grid') {
        onTemplateChange('minimal-sans'); // US prefers cleaner, list-based
    } else if (region === 'EUROPE_UK' && selectedTemplate === 'enterprise-pro') {
        onTemplateChange('swiss-grid'); // EU prefers structured grids
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);

    try {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                try {
                    // Explicitly force application/pdf if detecting via extension
                    const analyzedData = await analyzeUploadedDocument(base64String, 'application/pdf');
                    if (onAnalysisComplete) {
                        onAnalysisComplete(analyzedData);
                    }
                } catch (error) {
                    setScanError('Failed to analyze PDF. Ensure it is a valid, readable document.');
                    console.error(error);
                } finally {
                    setIsScanning(false);
                    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset
                }
            };
            reader.readAsDataURL(file);
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.name.toLowerCase().endsWith('.docx')
        ) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                try {
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    const text = result.value;
                    if (!text.trim()) {
                        throw new Error("No text found in DOCX");
                    }
                    const analyzedData = await analyzeImportedResumeText(text);
                    if (onAnalysisComplete) {
                        onAnalysisComplete(analyzedData);
                    }
                } catch (error) {
                    setScanError('Failed to analyze DOCX. Ensure it is not corrupted and contains text.');
                    console.error(error);
                } finally {
                    setIsScanning(false);
                    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (file.type.startsWith('image/') || /\.(png|jpg|jpeg|webp|heic|heif)$/i.test(file.name)) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                try {
                    // Normalize mimeType for common image extensions if implicit type is missing
                    let mimeType = file.type;
                    if (!mimeType) {
                        if (file.name.toLowerCase().endsWith('.png')) mimeType = 'image/png';
                        else if (file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) mimeType = 'image/jpeg';
                        else if (file.name.toLowerCase().endsWith('.webp')) mimeType = 'image/webp';
                        else mimeType = 'image/jpeg'; // Fallback
                    }

                    const analyzedData = await analyzeUploadedImage(base64String, mimeType);
                    if (onAnalysisComplete) {
                        onAnalysisComplete(analyzedData);
                    }
                } catch (error) {
                    setScanError('Failed to analyze image. Ensure text is clear.');
                    console.error(error);
                } finally {
                    setIsScanning(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            };
            reader.readAsDataURL(file);
        } else {
            setScanError('Please upload a valid PDF, DOCX, or Image.');
            setIsScanning(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    } catch (e) {
        setScanError('An unexpected error occurred during upload.');
        setIsScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLinkImport = async () => {
    if (!linkInput.trim()) return;
    setIsScanning(true);
    setScanError(null);
    try {
        const analyzedData = await analyzeResumeFromLink(linkInput);
        if (onAnalysisComplete) {
            onAnalysisComplete(analyzedData);
        }
    } catch (error) {
        setScanError('Failed to import from link. Ensure the profile is public.');
        console.error(error);
    } finally {
        setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Strategy & Content */}
      <div className={`border border-glass-border bg-charcoal rounded-lg overflow-hidden transition-all duration-300 ${openSection === 'content' ? 'ring-1 ring-white/10 bg-surface' : 'opacity-80'}`}>
        <button 
            onClick={() => setOpenSection('content')}
            className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
        >
            <span className="font-semibold text-sm text-white">1. Core Strategy</span>
            <div className={`w-1.5 h-1.5 rounded-full ${rawText ? 'bg-green-500 shadow-[0_0_8px_#10B981]' : 'bg-slate-700'}`} />
        </button>
        
        {openSection === 'content' && (
            <div className="p-5 space-y-6 animate-fade-in-up border-t border-white/5">
                 
                 {/* SMART IMPORT TABS */}
                 <div className="bg-white/5 p-1 rounded-lg flex mb-2">
                    <button 
                        onClick={() => setImportMode('file')}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center ${importMode === 'file' ? 'bg-charcoal shadow text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <DocumentIcon className="w-4 h-4 mr-2" /> Upload Document
                    </button>
                    <button 
                        onClick={() => setImportMode('link')}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center ${importMode === 'link' ? 'bg-charcoal shadow text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <LinkIcon className="w-4 h-4 mr-2" /> Import URL
                    </button>
                 </div>

                 {/* IMPORT AREA */}
                 {importMode === 'file' ? (
                     <div className="mb-6 p-4 border border-dashed border-slate-600 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center relative group">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            // Removed .doc, stick to .docx for mammoth support.
                            accept=".pdf,.docx,.png,.jpg,.jpeg,.webp,.heic,.heif" 
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isScanning}
                        />
                        <div className="flex flex-col items-center justify-center py-4">
                            {isScanning ? (
                                <>
                                    <LoadingSpinner size="h-6 w-6" color="text-accent" />
                                    <span className="mt-2 text-xs text-accent font-bold animate-pulse">Gemini 3 Pro Vision Analysis...</span>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-2 mb-2">
                                        <CloudArrowUpIcon className="w-8 h-8 text-subtle group-hover:text-accent transition-colors" />
                                        <PhotoIcon className="w-8 h-8 text-subtle group-hover:text-accent transition-colors" />
                                    </div>
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Smart Scan Resume</span>
                                    <span className="text-[10px] text-slate-500 mt-1">Supports PDF, DOCX & Images (OCR)</span>
                                </>
                            )}
                        </div>
                     </div>
                 ) : (
                     <div className="mb-6">
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                placeholder="https://linkedin.com/in/..."
                                value={linkInput}
                                onChange={(e) => setLinkInput(e.target.value)}
                                className="flex-1 bg-obsidian border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-accent outline-none"
                                disabled={isScanning}
                            />
                            <button 
                                onClick={handleLinkImport}
                                disabled={isScanning || !linkInput}
                                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold px-4 py-2 rounded-lg text-xs disabled:opacity-50 transition-colors"
                            >
                                {isScanning ? 'Scanning...' : 'Fetch'}
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 ml-1">Paste a public LinkedIn URL or personal website.</p>
                     </div>
                 )}

                 {scanError && <div className="text-red-400 text-xs text-center">{scanError}</div>}

                 <div className="flex justify-between">
                    <button 
                        onClick={handleSaveClick} 
                        disabled={!rawText} 
                        className={`text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center disabled:opacity-50 ${isSaved ? 'text-green-400' : 'text-subtle hover:text-green-400'}`}
                    >
                        {isSaved ? <CheckIcon className="w-3 h-3 mr-1"/> : <FloppyDiskIcon className="w-3 h-3 mr-1"/>}
                        {isSaved ? 'Saved!' : 'Save Snapshot'}
                    </button>
                    <button onClick={onTryExample} className="text-[10px] text-subtle hover:text-accent uppercase tracking-wider font-bold transition-colors">Load Persona</button>
                </div>

                <div>
                    <Label>Candidate Profile / Raw Data</Label>
                    <textarea
                        className="w-full h-40 bg-obsidian border border-glass-border rounded p-3 text-sm text-platinum focus:ring-1 focus:ring-accent focus:border-transparent outline-none resize-none custom-scrollbar transition-all placeholder-slate-700"
                        placeholder="Paste experience, skills, and bio..."
                        value={rawText}
                        onChange={(e) => onRawTextChange(e.target.value)}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label>Target Job Description</Label>
                    </div>
                    <div className="relative">
                        <textarea
                            className="w-full h-28 bg-obsidian border border-glass-border rounded p-3 text-sm text-platinum focus:ring-1 focus:ring-accent focus:border-transparent outline-none resize-none custom-scrollbar transition-all placeholder-slate-700"
                            placeholder="Paste job description..."
                            value={jobDescription}
                            onChange={(e) => onJobDescriptionChange(e.target.value)}
                        />
                        {jobDescription && (
                             <button 
                                onClick={onResearchTrends}
                                disabled={isResearching}
                                className="absolute bottom-3 right-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center backdrop-blur-md transition-all border border-white/5 shadow-lg"
                             >
                                {isResearching ? <LoadingSpinner size="h-3 w-3" color="text-white"/> : <DocumentMagnifyingGlassIcon className="w-3 h-3 mr-1.5"/>}
                                {isResearching ? 'Searching...' : 'Deep Grounding'}
                             </button>
                        )}
                    </div>
                    
                    {/* Market Intelligence Panel */}
                    {industryTrends && (
                      <div className="mt-4 p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-lg animate-fade-in-up">
                        <div className="flex items-center mb-3 border-b border-emerald-500/20 pb-2">
                          <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400 mr-2" />
                          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Market Intelligence</h3>
                        </div>
                        <div className="text-xs text-emerald-100 leading-relaxed whitespace-pre-wrap font-mono">
                          {industryTrends}
                        </div>
                      </div>
                    )}
                </div>
            </div>
        )}
      </div>

      <button
        onClick={onGenerateResume}
        disabled={isGeneratingResume || !rawText}
        className="w-full group relative overflow-hidden bg-accent hover:bg-accent-glow text-obsidian font-bold py-4 rounded-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        <span className="relative z-10 flex items-center justify-center tracking-wide">
            {isGeneratingResume ? 'Gemini 3 Pro Processing...' : 'INITIALIZE GENERATION'}
        </span>
        <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
      </button>

    </div>
  );
};
