
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ResumeInput } from './components/ResumeInput';
import { ResumePreview } from './components/ResumePreview';
import { CoverLetterPreview } from './components/CoverLetterPreview';
import { SettingsModal } from './components/SettingsModal';
import { 
  generateResumeFromText, 
  generateCoverLetterStream, 
  getSuggestionForGap, 
  generateInterviewQuestions,
  generateHeadshot,
  researchIndustryTrends,
  runAtsAudit
} from './services/geminiService';
import type { ResumeData, TemplateName, FontGroupName, CoverLetterTone, ResumeSettings, AtsAuditResult } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { 
  LightBulbIcon, XMarkIcon, BriefcaseIcon, DocumentMagnifyingGlassIcon, 
  SparklesIcon, UserGroupIcon, CogIcon, CheckIcon, CpuChipIcon, ExclamationTriangleIcon
} from './components/icons';

// Sample Data
const SAMPLE_RAW_TEXT = `John Doe
Senior Product Lead
john@example.com | 555-0199 | San Francisco, CA

Innovative Product Leader with 8+ years driving SaaS growth.
Experience:
TechFlow Inc - Senior PM (2020-Present)
- Led AI integration boosting retention by 40%.
- Managed cross-functional team of 15.
StartupX - Product Manager (2016-2020)
- Scaled user base from 0 to 100k.
Education: MBA, Stanford.`;

const SAMPLE_JOB_DESCRIPTION = `Looking for a Senior Product Lead to drive AI initiatives. Must have experience with LLMs, agile methodologies, and team leadership.`;

const STORAGE_KEYS = {
    RAW_TEXT: 'artisan_raw_text',
    JOB_DESC: 'artisan_job_desc',
    THEME: 'artisan_theme'
};

const App = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter' | 'analysis'>('resume');
  
  const [rawText, setRawText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobDescriptionUsedForLastResume, setJobDescriptionUsedForLastResume] = useState<string>('');
  
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [interviewQuestions, setInterviewQuestions] = useState<string[] | null>(null);

  // New Feature States
  const [headshotImage, setHeadshotImage] = useState<string | null>(null);
  const [isGeneratingHeadshot, setIsGeneratingHeadshot] = useState<boolean>(false);
  const [industryTrends, setIndustryTrends] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState<boolean>(false);
  
  // ATS Audit State
  const [atsAuditResult, setAtsAuditResult] = useState<AtsAuditResult | null>(null);
  const [isAuditingAts, setIsAuditingAts] = useState<boolean>(false);

  const [isLoadingResume, setIsLoadingResume] = useState<boolean>(false);
  const [isLoadingCoverLetter, setIsLoadingCoverLetter] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Settings
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>('enterprise-pro');
  const [selectedFontGroup, setSelectedFontGroup] = useState<FontGroupName>('serif');
  const [coverLetterTone, setCoverLetterTone] = useState<CoverLetterTone>('professional');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Layout Settings
  const [layoutSettings, setLayoutSettings] = useState<ResumeSettings>({
    margin: 'standard',
    lineHeight: 'normal',
    fontSizeScale: 'medium'
  });

  // Gap Analysis
  const [selectedGap, setSelectedGap] = useState<{ text: string; index: number } | null>(null);
  const [gapSuggestion, setGapSuggestion] = useState<string | null>(null);
  const [isLoadingGapSuggestion, setIsLoadingGapSuggestion] = useState<boolean>(false);

  // Layout refs
  const previewRef = useRef<HTMLDivElement>(null);

  // --- Persistence Logic ---
  useEffect(() => {
    // Hydrate on mount
    const savedText = localStorage.getItem(STORAGE_KEYS.RAW_TEXT);
    const savedJd = localStorage.getItem(STORAGE_KEYS.JOB_DESC);
    if (savedText) setRawText(savedText);
    if (savedJd) setJobDescription(savedJd);
  }, []);

  useEffect(() => {
    // Auto-save debounce could be added here, but direct set for text inputs is usually fine for small data
    localStorage.setItem(STORAGE_KEYS.RAW_TEXT, rawText);
    setLastSaved(new Date());
  }, [rawText]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOB_DESC, jobDescription);
    setLastSaved(new Date());
  }, [jobDescription]);

  const handleClearData = () => {
    localStorage.removeItem(STORAGE_KEYS.RAW_TEXT);
    localStorage.removeItem(STORAGE_KEYS.JOB_DESC);
    setRawText('');
    setJobDescription('');
    setResumeData(null);
    setCoverLetter('');
    setShowSettingsModal(false);
    window.location.reload(); // Cleanest way to reset all state for now
  };

  // --- Handlers ---

  const handleResearchTrends = async () => {
    if (!jobDescription) {
        setError("Please enter a job description to research.");
        return;
    }
    setIsResearching(true);
    try {
        const trends = await researchIndustryTrends(jobDescription.substring(0, 100) + " Role"); // Infer title
        setIndustryTrends(trends);
    } catch (e) {
        console.error(e);
    } finally {
        setIsResearching(false);
    }
  };

  const handleGenerateHeadshot = async (size: '1K' | '2K' | '4K') => {
    if (!resumeData?.suggestedHeadshotPrompt) {
        setError("Generate a resume first to get a personalized headshot prompt.");
        return;
    }
    setIsGeneratingHeadshot(true);
    try {
        const img = await generateHeadshot(resumeData.suggestedHeadshotPrompt, size);
        setHeadshotImage(img);
    } catch (e) {
        setError("Failed to generate headshot. Try again.");
    } finally {
        setIsGeneratingHeadshot(false);
    }
  };

  const handleRunAtsAudit = async () => {
    if (!resumeData || !jobDescriptionUsedForLastResume) return;
    setIsAuditingAts(true);
    setAtsAuditResult(null);
    try {
        const result = await runAtsAudit(resumeData, jobDescriptionUsedForLastResume);
        setAtsAuditResult(result);
    } catch (e) {
        setError("Failed to run ATS Audit.");
    } finally {
        setIsAuditingAts(false);
    }
  };

  const handleGenerateResume = useCallback(async (suggestionContext?: { originalGap: string; aiSuggestion: string; }) => {
    if (!rawText.trim()) return setError('Please input resume details.');
    setIsLoadingResume(true);
    setError(null);
    if (!suggestionContext) {
        setResumeData(null);
        setJobDescriptionUsedForLastResume(jobDescription);
        setInterviewQuestions(null);
        setAtsAuditResult(null); // Reset audit on new resume
    }
    
    try {
      const jd = suggestionContext ? jobDescriptionUsedForLastResume : jobDescription;
      // Pass industry trends if available
      const data = await generateResumeFromText(rawText, jd, suggestionContext, industryTrends || undefined);
      setResumeData(data);
      if (suggestionContext) {
        setSelectedGap(null);
        setGapSuggestion(null);
      }
      setActiveTab('resume');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingResume(false);
    }
  }, [rawText, jobDescription, jobDescriptionUsedForLastResume, industryTrends]);

  const handleGenerateCoverLetter = useCallback(async () => {
    if (!resumeData || !jobDescription) return setError('Resume and Job Description required.');
    setIsLoadingCoverLetter(true);
    setCoverLetter('');
    setActiveTab('cover-letter');
    try {
      const stream = await generateCoverLetterStream(resumeData, jobDescription, coverLetterTone);
      for await (const chunk of stream) {
        setCoverLetter(prev => prev + chunk.text);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingCoverLetter(false);
    }
  }, [resumeData, jobDescription, coverLetterTone]);

  const handleGapAction = async (gap: string, idx: number) => {
    if (selectedGap?.index === idx) return setSelectedGap(null);
    setSelectedGap({ text: gap, index: idx });
    setIsLoadingGapSuggestion(true);
    setGapSuggestion(null); 
    try {
      const suggestion = await getSuggestionForGap(resumeData!, jobDescriptionUsedForLastResume, gap);
      setGapSuggestion(suggestion);
    } catch (e) { console.error(e); }
    setIsLoadingGapSuggestion(false);
  };

  const handleApplySuggestion = async () => {
    if (!selectedGap || !gapSuggestion) return;
    await handleGenerateResume({ originalGap: selectedGap.text, aiSuggestion: gapSuggestion });
  };

  // --- Render ---

  return (
    <div className="flex h-screen w-full bg-obsidian text-platinum overflow-hidden font-sans selection:bg-accent selection:text-white">
      
      {/* 1. Sidebar (Executive Rail) */}
      <nav className="w-20 lg:w-24 bg-charcoal border-r border-glass-border flex flex-col items-center py-8 z-20 flex-shrink-0 shadow-glass-xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-amber-600 flex items-center justify-center shadow-platinum mb-12">
          <SparklesIcon className="text-white w-7 h-7" />
        </div>
        
        <div className="space-y-6 w-full flex flex-col items-center">
          <NavButton 
            active={activeTab === 'resume'} 
            onClick={() => setActiveTab('resume')} 
            icon={<BriefcaseIcon />} 
            label="Resume" 
          />
          <NavButton 
            active={activeTab === 'cover-letter'} 
            onClick={() => setActiveTab('cover-letter')} 
            icon={<DocumentMagnifyingGlassIcon />} 
            label="Letter" 
            disabled={!resumeData}
          />
          <NavButton 
            active={activeTab === 'analysis'} 
            onClick={() => setActiveTab('analysis')} 
            icon={<UserGroupIcon />} 
            label="Insights" 
            disabled={!resumeData?.jobMatchAnalysis}
          />
        </div>

        <div className="mt-auto">
            <button 
                onClick={() => setShowSettingsModal(true)}
                className="p-3 text-slate-500 hover:text-white transition-colors"
            >
                <CogIcon className="w-6 h-6" />
            </button>
        </div>
      </nav>

      {/* 2. Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden bg-executive-gradient">
        
        {/* Left Panel: Strategy Deck */}
        <section className="w-full lg:w-[450px] xl:w-[500px] h-full overflow-y-auto custom-scrollbar bg-surface/50 backdrop-blur-md border-r border-glass-border flex flex-col z-10 relative">
          <div className="p-6 lg:p-8">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-white tracking-tight mb-1">Artisan<span className="text-accent">.</span></h1>
                    <p className="text-xs text-subtle uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                        Enterprise Suite <span className="w-1 h-1 bg-accent rounded-full"></span> Gemini 3 Pro
                    </p>
                </div>
                {lastSaved && (
                     <div className="flex items-center text-[10px] text-slate-500 opacity-60">
                        <CheckIcon className="w-3 h-3 mr-1" /> Auto-saved
                     </div>
                )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/10 border-l-2 border-red-500 rounded-r-lg text-red-200 text-sm flex items-start animate-fade-in-up">
                <XMarkIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-500" />
                {error}
              </div>
            )}

            {/* Resume Input Context */}
            <div className={`${activeTab !== 'resume' ? 'hidden' : 'block'} animate-fade-in-up`}>
                <ResumeInput 
                    rawText={rawText}
                    onRawTextChange={setRawText}
                    jobDescription={jobDescription}
                    onJobDescriptionChange={setJobDescription}
                    onGenerateResume={() => handleGenerateResume()}
                    onGenerateCoverLetter={handleGenerateCoverLetter}
                    isGeneratingResume={isLoadingResume}
                    isGeneratingCoverLetter={isLoadingCoverLetter}
                    resumeGenerated={!!resumeData}
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                    selectedFontGroup={selectedFontGroup}
                    onFontGroupChange={setSelectedFontGroup}
                    onTryExample={() => { setRawText(SAMPLE_RAW_TEXT); setJobDescription(SAMPLE_JOB_DESCRIPTION); }}
                    coverLetterTone={coverLetterTone}
                    onCoverLetterToneChange={setCoverLetterTone}
                    onGenerateInterviewQuestions={() => {}} 
                    isGeneratingInterviewQuestions={false}
                    settings={layoutSettings}
                    onSettingsChange={setLayoutSettings}
                    // New Props
                    onGenerateHeadshot={handleGenerateHeadshot}
                    isGeneratingHeadshot={isGeneratingHeadshot}
                    onResearchTrends={handleResearchTrends}
                    isResearching={isResearching}
                    industryTrends={industryTrends}
                />
            </div>
            
            {/* Analysis Panel */}
            {activeTab === 'analysis' && resumeData && (
                <div className="space-y-8 animate-fade-in-up">
                    
                    {/* Job Match Analysis */}
                    <div className="bg-glass border border-glass-border p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <SparklesIcon className="w-24 h-24 text-accent" />
                        </div>
                        <h3 className="text-white font-bold mb-6 flex items-center font-serif text-xl"><SparklesIcon className="w-5 h-5 mr-3 text-accent"/> Strategic Alignment</h3>
                        
                        <div className="flex items-end gap-3 mb-3">
                             <span className="text-5xl font-bold text-white tracking-tighter">{resumeData.jobMatchAnalysis?.matchScore || 0}%</span>
                             <span className="text-subtle mb-1.5 uppercase text-xs tracking-wider">Match Score</span>
                        </div>
                        <div className="w-full bg-charcoal h-1 rounded-full mb-8 overflow-hidden">
                            <div className="bg-accent h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{width: `${resumeData.jobMatchAnalysis?.matchScore}%`}}></div>
                        </div>

                        <div className="space-y-4">
                            {resumeData.jobMatchAnalysis?.gaps?.map((gap, i) => (
                                <div key={i} className="bg-charcoal/40 p-4 rounded-lg border-l-2 border-red-500/50 hover:border-red-500 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-platinum leading-relaxed pr-2">{gap}</p>
                                        <button onClick={() => handleGapAction(gap, i)} className="text-subtle hover:text-accent transition-colors">
                                            <LightBulbIcon className={`w-5 h-5 transition-all duration-300 ${selectedGap?.index === i ? 'text-accent drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`}/>
                                        </button>
                                    </div>
                                    {selectedGap?.index === i && (
                                        <div className="mt-4 animate-fade-in-up pl-4 border-l border-white/10">
                                            {isLoadingGapSuggestion ? (
                                                <div className="flex items-center py-2">
                                                    <LoadingSpinner size="h-4 w-4" color="text-accent" />
                                                    <span className="ml-3 text-xs text-subtle">Gemini analyzing strategy...</span>
                                                </div>
                                            ) : gapSuggestion ? (
                                                <div className="bg-surface border border-white/5 rounded-lg p-4 shadow-xl">
                                                    <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 flex items-center">
                                                        <SparklesIcon className="w-3 h-3 mr-2" /> Strategic Fix
                                                    </h4>
                                                    <p className="text-sm text-platinum italic mb-4 leading-relaxed">
                                                        "{gapSuggestion}"
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={handleApplySuggestion} 
                                                            className="flex-1 bg-green-600/90 hover:bg-green-500 text-white text-xs font-bold py-2 px-3 rounded shadow-lg transition-all"
                                                        >
                                                            Apply Fix
                                                        </button>
                                                        <button 
                                                            onClick={() => { setGapSuggestion(null); setSelectedGap(null); }} 
                                                            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-subtle text-xs font-bold rounded transition-colors"
                                                        >
                                                            Dismiss
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ATS Audit Panel */}
                    <div className="bg-glass border border-glass-border p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <h3 className="text-white font-bold mb-4 flex items-center font-serif text-xl">
                            <CpuChipIcon className="w-5 h-5 mr-3 text-sky-400"/> Technical ATS Audit
                        </h3>
                        {!atsAuditResult ? (
                             <div className="text-center py-6">
                                <p className="text-sm text-subtle mb-4">Run a simulation against a corporate-grade parser (Taleo/Greenhouse).</p>
                                <button 
                                    onClick={handleRunAtsAudit}
                                    disabled={isAuditingAts}
                                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-6 rounded-full text-xs uppercase tracking-wider transition-all flex items-center mx-auto"
                                >
                                    {isAuditingAts ? <LoadingSpinner size="h-3 w-3" color="text-white"/> : <CpuChipIcon className="w-4 h-4 mr-2"/>}
                                    {isAuditingAts ? 'Parsing...' : 'Run Simulation'}
                                </button>
                             </div>
                        ) : (
                             <div className="animate-fade-in-up">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-charcoal/50 p-4 rounded-lg text-center border border-white/5">
                                        <div className="text-3xl font-bold text-sky-400">{atsAuditResult.parseabilityScore}/100</div>
                                        <div className="text-[10px] text-subtle uppercase tracking-wider">Parseability</div>
                                    </div>
                                    <div className="bg-charcoal/50 p-4 rounded-lg text-center border border-white/5">
                                        <div className={`text-lg font-bold ${atsAuditResult.estimatedHumanReviewStatus === 'Auto-Reject' ? 'text-red-400' : 'text-green-400'}`}>
                                            {atsAuditResult.estimatedHumanReviewStatus}
                                        </div>
                                        <div className="text-[10px] text-subtle uppercase tracking-wider">Status</div>
                                    </div>
                                </div>
                                {atsAuditResult.formattingIssues.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center">
                                            <ExclamationTriangleIcon className="w-3 h-3 mr-1"/> Formatting Flags
                                        </h4>
                                        <ul className="list-disc ml-4 text-xs text-platinum space-y-1">
                                            {atsAuditResult.formattingIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {atsAuditResult.missingCriticalKeywords.length > 0 && (
                                    <div>
                                        <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Missing Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {atsAuditResult.missingCriticalKeywords.map((kw, i) => (
                                                <span key={i} className="bg-amber-900/30 text-amber-200 border border-amber-500/30 px-2 py-1 rounded text-[10px]">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-4 text-center">
                                    <button onClick={() => setAtsAuditResult(null)} className="text-xs text-subtle hover:text-white underline">Reset Audit</button>
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Cover Letter Context */}
            {activeTab === 'cover-letter' && (
                <div className="space-y-6 animate-fade-in-up text-center pt-20">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                         <DocumentMagnifyingGlassIcon className="w-8 h-8 text-accent opacity-50"/>
                    </div>
                    <p className="text-subtle max-w-xs mx-auto text-sm leading-relaxed">Gemini will draft a cover letter aligning your resume's strongest points with the job description.</p>
                    <div className="flex justify-center">
                        <button onClick={handleGenerateCoverLetter} disabled={isLoadingCoverLetter} className="bg-white text-obsidian hover:bg-platinum font-bold py-3 px-8 rounded shadow-xl transition-all hover:scale-105 disabled:opacity-50">
                            {isLoadingCoverLetter ? 'Drafting...' : 'Regenerate Letter'}
                        </button>
                    </div>
                </div>
            )}

          </div>
        </section>

        {/* Right Panel: Live Canvas */}
        <section className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-4 lg:p-10 perspective-stage bg-[#05080F]">
           
           {/* Cinematic Ambient Glow */}
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

           {/* Content Container */}
           <div 
             ref={previewRef}
             className={`
               relative w-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] preserve-3d
               ${!isLoadingResume && resumeData ? 'opacity-100 translate-y-0 rotate-x-0' : 'opacity-40 translate-y-10 rotate-x-6'}
             `}
             style={{ maxWidth: '850px' }} 
           >
             {isLoadingResume || isLoadingCoverLetter ? (
                 <div className="absolute inset-0 flex items-center justify-center z-50">
                    <div className="bg-charcoal/80 backdrop-blur-2xl border border-white/10 p-10 rounded-2xl shadow-2xl flex flex-col items-center border-t border-white/20">
                        <LoadingSpinner size="w-10 h-10" color="text-accent" />
                        <p className="mt-6 text-platinum font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                            {isLoadingResume ? 'Gemini 3 Pro Reasoning...' : 'Composing...'}
                        </p>
                    </div>
                 </div>
             ) : null}

             <div className={`
                 transition-transform duration-700 shadow-3d-float
                 ${activeTab === 'resume' ? 'hover:rotate-x-1 hover:rotate-y-1' : ''} 
             `}>
                {activeTab === 'resume' && resumeData && (
                    <ResumePreview 
                      data={resumeData} 
                      template={selectedTemplate} 
                      fontGroup={selectedFontGroup} 
                      settings={layoutSettings}
                      headshotImage={headshotImage}
                    />
                )}
                {activeTab === 'cover-letter' && coverLetter && (
                    <CoverLetterPreview letter={coverLetter} resumeData={resumeData} />
                )}
                
                {/* Empty State */}
                {!resumeData && !isLoadingResume && (
                    <div className="bg-charcoal/40 backdrop-blur-sm border border-white/5 rounded-xl p-12 text-center h-[600px] flex flex-col items-center justify-center dashed-border opacity-50">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <BriefcaseIcon className="w-8 h-8 text-subtle" />
                        </div>
                        <h2 className="text-2xl font-serif text-white mb-2">Executive Studio</h2>
                        <p className="text-subtle text-sm max-w-md mx-auto">
                            Awaiting strategy input. Use the panel on the left to initialize Gemini.
                        </p>
                    </div>
                )}
             </div>
           </div>
        </section>

      </main>

      {showSettingsModal && (
        <SettingsModal 
            onClose={() => setShowSettingsModal(false)}
            onClearData={handleClearData}
        />
      )}

    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, disabled = false }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300
      ${active ? 'bg-white text-obsidian shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}
      ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <div className="w-5 h-5">{icon}</div>
    <span className="absolute left-16 bg-surface text-platinum text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
      {label}
    </span>
    {active && <div className="absolute -left-4 w-1 h-6 bg-accent rounded-r-full shadow-[0_0_10px_#F59E0B]" />}
  </button>
);

export default App;
