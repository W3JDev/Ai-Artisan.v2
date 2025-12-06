
import React, { useState } from 'react';
import type { ResumeInputProps, TemplateName, FontGroupName, CoverLetterTone } from '../types';
import { CogIcon, SparklesIcon, DocumentMagnifyingGlassIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[10px] font-bold text-subtle uppercase tracking-widest mb-2">{children}</label>
);

export const ResumeInput: React.FC<ResumeInputProps> = ({
  rawText, onRawTextChange,
  jobDescription, onJobDescriptionChange,
  onGenerateResume, selectedTemplate, onTemplateChange,
  selectedFontGroup, onFontGroupChange, isGeneratingResume, onTryExample,
  settings, onSettingsChange,
  onGenerateHeadshot, isGeneratingHeadshot,
  onResearchTrends, isResearching, industryTrends
}) => {
  
  const [openSection, setOpenSection] = useState<'content' | 'settings' | 'ai'>('content');

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
                 <div className="flex justify-end">
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
                        {industryTrends && <span className="text-[10px] text-green-400 flex items-center"><SparklesIcon className="w-3 h-3 mr-1"/> Research Active</span>}
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
                                className="absolute bottom-3 right-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center backdrop-blur-md transition-all border border-white/5"
                             >
                                {isResearching ? <LoadingSpinner size="h-3 w-3" color="text-white"/> : <DocumentMagnifyingGlassIcon className="w-3 h-3 mr-1.5"/>}
                                {isResearching ? 'Searching...' : 'Deep Grounding'}
                             </button>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* 2. Visual Identity */}
      <div className={`border border-glass-border bg-charcoal rounded-lg overflow-hidden transition-all duration-300 ${openSection === 'settings' ? 'ring-1 ring-white/10 bg-surface' : 'opacity-80'}`}>
         <button 
            onClick={() => setOpenSection('settings')}
            className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
        >
            <span className="font-semibold text-sm text-white">2. Visual Identity</span>
            <CogIcon className="w-4 h-4 text-subtle" />
        </button>

        {openSection === 'settings' && (
            <div className="p-5 space-y-6 animate-fade-in-up border-t border-white/5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Template</Label>
                        <select 
                            value={selectedTemplate}
                            onChange={(e) => onTemplateChange(e.target.value as TemplateName)}
                            className="w-full bg-obsidian text-platinum text-xs border border-glass-border rounded p-2.5 focus:ring-1 focus:ring-accent outline-none"
                        >
                            <optgroup label="Enterprise">
                                <option value="enterprise-pro">Executive Suite (Gold)</option>
                                <option value="classic-serif">Harvard Classic (Serif)</option>
                                <option value="minimal-sans">Silicon Valley (Clean)</option>
                            </optgroup>
                            <optgroup label="Modern/Tech">
                                <option value="modern-compact">Modern Tech (Compact)</option>
                                <option value="swiss-grid">Swiss Grid (Technical)</option>
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <Label>Typography</Label>
                        <select 
                            value={selectedFontGroup}
                            onChange={(e) => onFontGroupChange(e.target.value as FontGroupName)}
                            className="w-full bg-obsidian text-platinum text-xs border border-glass-border rounded p-2.5 focus:ring-1 focus:ring-accent outline-none"
                        >
                            <option value="serif">Merriweather (Classic)</option>
                            <option value="sans-serif">Inter (Clean)</option>
                            <option value="mono">JetBrains (Tech)</option>
                        </select>
                    </div>
                </div>

                <div className="p-4 bg-white/5 rounded border border-white/5">
                     <div className="flex justify-between items-center mb-3">
                        <Label><span className="text-accent">Nano Banana Pro</span> Headshot</Label>
                        <span className="text-[10px] text-slate-500 bg-black/20 px-2 py-0.5 rounded">Gemini Image 3</span>
                     </div>
                     <div className="flex gap-2">
                         <button onClick={() => onGenerateHeadshot('1K')} disabled={isGeneratingHeadshot} className="flex-1 bg-charcoal hover:bg-slate-800 border border-white/10 text-xs py-2 rounded transition-colors text-slate-300">
                            {isGeneratingHeadshot ? 'Rendering...' : 'Generate 1K'}
                         </button>
                         <button onClick={() => onGenerateHeadshot('2K')} disabled={isGeneratingHeadshot} className="flex-1 bg-charcoal hover:bg-slate-800 border border-white/10 text-xs py-2 rounded transition-colors text-slate-300">
                            {isGeneratingHeadshot ? 'Rendering...' : 'Generate 2K'}
                         </button>
                     </div>
                </div>

                <div>
                    <Label>Page Fit (A4)</Label>
                    <div className="flex gap-2">
                        {['compact', 'standard', 'generous'].map((m) => (
                             <button
                                key={m}
                                onClick={() => onSettingsChange({...settings, margin: m as any})}
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all ${settings.margin === m ? 'bg-white text-obsidian border-white' : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30'}`}
                             >
                                {m}
                             </button>
                        ))}
                    </div>
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
