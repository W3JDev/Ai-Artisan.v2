import React, { useState, useCallback, useEffect } from 'react';
import { ResumeInput } from './components/ResumeInput';
import { ResumePreview } from './components/ResumePreview';
import { CoverLetterPreview } from './components/CoverLetterPreview';
import { generateResumeFromText, generateCoverLetter, getSuggestionForGap } from './services/geminiService';
import type { ResumeData, TemplateName, FontGroupName, TailoringStrength } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LightBulbIcon, XMarkIcon } from './components/icons'; 

const App = () => {
  const [rawText, setRawText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobDescriptionUsedForLastResume, setJobDescriptionUsedForLastResume] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isLoadingResume, setIsLoadingResume] = useState<boolean>(false);
  const [isLoadingCoverLetter, setIsLoadingCoverLetter] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>('classic');
  const [selectedFontGroup, setSelectedFontGroup] = useState<FontGroupName>('sans-serif');

  // State for gap suggestions
  const [selectedGap, setSelectedGap] = useState<{ text: string; index: number } | null>(null);
  const [gapSuggestion, setGapSuggestion] = useState<string | null>(null);
  const [isLoadingGapSuggestion, setIsLoadingGapSuggestion] = useState<boolean>(false);
  const [gapSuggestionError, setGapSuggestionError] = useState<string | null>(null);

  // Ensure body background is consistent with the app's theme
  useEffect(() => {
    document.body.classList.remove('bg-dark', 'text-gray-200', 'antialiased'); // Remove landing page styles
    document.body.classList.add('bg-gray-100'); // App's original body background
    return () => {
        // Potentially add back landing page styles if navigating back, though current flow doesn't support it
        // document.body.classList.remove('bg-gray-100');
    }
  }, []);


  const handleGenerateResume = useCallback(async (
    suggestionContext?: { originalGap: string; aiSuggestion: string; }
  ) => {
    if (!rawText.trim()) {
      setError('Please provide your resume information.');
      return;
    }
    setIsLoadingResume(true);
    setError(null);
    setResumeData(null); 
    if (!suggestionContext) { // Only reset these if not applying a suggestion
        setCoverLetter('');
        setJobDescriptionUsedForLastResume(jobDescription);
        setSelectedGap(null);
        setGapSuggestion(null);
        setGapSuggestionError(null);
    }


    try {
      const data = await generateResumeFromText(rawText, jobDescriptionUsedForLastResume || jobDescription, suggestionContext); 
      setResumeData(data);
       if (suggestionContext) { // If a suggestion was applied, clear the gap UI
        dismissGapSuggestion();
      }
    } catch (err: any) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate resume. Ensure your API key is configured.');
    } finally {
      setIsLoadingResume(false);
    }
  }, [rawText, jobDescription, jobDescriptionUsedForLastResume]);

  const handleGenerateCoverLetter = useCallback(async () => {
    if (!resumeData) {
      setError('Please generate a resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a job description to generate a tailored cover letter.');
      return;
    }
    setIsLoadingCoverLetter(true);
    setError(null);
    setCoverLetter('');
    try {
      const letter = await generateCoverLetter(resumeData, jobDescription);
      setCoverLetter(letter);
    } catch (err: any) { 
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter.');
    } finally {
      setIsLoadingCoverLetter(false);
    }
  }, [resumeData, jobDescription]);

  const handleGapClick = async (gapText: string, index: number) => {
    if (!resumeData || !jobDescriptionUsedForLastResume.trim()) return;

    if (selectedGap && selectedGap.index === index && (gapSuggestion || isLoadingGapSuggestion)) {
        return;
    }
    
    setSelectedGap({ text: gapText, index });
    setIsLoadingGapSuggestion(true);
    setGapSuggestion(null);
    setGapSuggestionError(null);

    try {
      const suggestion = await getSuggestionForGap(resumeData, jobDescriptionUsedForLastResume, gapText);
      setGapSuggestion(suggestion);
    } catch (err: any) {
      console.error(err);
      setGapSuggestionError(err instanceof Error ? err.message : 'Failed to get suggestion.');
    } finally {
      setIsLoadingGapSuggestion(false);
    }
  };

  const dismissGapSuggestion = () => {
    setSelectedGap(null);
    setGapSuggestion(null);
    setGapSuggestionError(null);
    setIsLoadingGapSuggestion(false);
  };

  const handleApplySuggestion = useCallback(async () => {
    if (!selectedGap || !gapSuggestion || !rawText.trim() || !jobDescriptionUsedForLastResume.trim()) {
      setGapSuggestionError("Cannot apply suggestion: missing context or resume details.");
      return;
    }
    // Call handleGenerateResume with the suggestion context
    await handleGenerateResume({ originalGap: selectedGap.text, aiSuggestion: gapSuggestion });
  }, [selectedGap, gapSuggestion, rawText, jobDescriptionUsedForLastResume, handleGenerateResume]);


  const showTailoringInsights = resumeData && 
                                !isLoadingResume && 
                                jobDescriptionUsedForLastResume.trim() && 
                                ( (resumeData.tailoringKeywords && resumeData.tailoringKeywords.length > 0) || resumeData.tailoringStrength );

  const showJobMatchAnalysis = resumeData &&
                               !isLoadingResume &&
                               jobDescriptionUsedForLastResume.trim() &&
                               resumeData.jobMatchAnalysis &&
                               (resumeData.jobMatchAnalysis.matchScore !== undefined || 
                                (resumeData.jobMatchAnalysis.strengths && resumeData.jobMatchAnalysis.strengths.length > 0) ||
                                (resumeData.jobMatchAnalysis.gaps && resumeData.jobMatchAnalysis.gaps.length > 0));

  const getTailoringStrengthColor = (strength?: TailoringStrength) => {
    switch (strength) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-sky-400';
      case 'Fair': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getMatchScoreColor = (score?: number) => {
    if (score === undefined) return 'bg-slate-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-sky-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-4 sm:p-8 font-sans text-gray-200">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
          AI Resume Artisan
        </h1>
        <p className="text-lg text-slate-400 mt-2">
          Craft your perfect one-page resume and cover letter with the power of AI.
        </p>
      </header>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
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
            />
            {error && <p className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
          </div>

          {showTailoringInsights && (
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
              <h3 className="text-xl font-semibold text-sky-400 mb-3">AI Tailoring Insights</h3>
              
              {resumeData?.tailoringStrength && (
                <p className="text-sm text-slate-300 mb-3">
                  Overall Tailoring Fit: <strong className={getTailoringStrengthColor(resumeData.tailoringStrength)}>{resumeData.tailoringStrength}</strong>
                </p>
              )}

              {resumeData?.tailoringKeywords && resumeData.tailoringKeywords.length > 0 && (
                <>
                  <p className="text-sm text-slate-400 mb-2">
                    The AI prioritized these key terms from the job description:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.tailoringKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-sky-700 text-sky-200 text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {showJobMatchAnalysis && resumeData?.jobMatchAnalysis && (
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
              <h3 className="text-xl font-semibold text-sky-400 mb-4">Job Match Analysis</h3>

              {resumeData.jobMatchAnalysis.matchScore !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-300 mb-1">
                    <span>Job Alignment Score:</span>
                    <span className="font-semibold">{resumeData.jobMatchAnalysis.matchScore}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2.5">
                    <div 
                      className={`${getMatchScoreColor(resumeData.jobMatchAnalysis.matchScore)} h-2.5 rounded-full transition-all duration-500 ease-out`} 
                      style={{ width: `${resumeData.jobMatchAnalysis.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {resumeData.jobMatchAnalysis.strengths && resumeData.jobMatchAnalysis.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-green-400 mb-2">Alignment Strengths:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                    {resumeData.jobMatchAnalysis.strengths.map((strength, index) => (
                      <li key={`strength-${index}`}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {resumeData.jobMatchAnalysis.gaps && resumeData.jobMatchAnalysis.gaps.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-yellow-400 mb-2">Potential Gaps / Improvements:</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {resumeData.jobMatchAnalysis.gaps.map((gap, index) => (
                      <li key={`gap-${index}`} className="group">
                        <button
                          onClick={() => handleGapClick(gap, index)}
                          className="flex items-start text-left w-full p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                          aria-label={`Get suggestion for: ${gap}`}
                        >
                          <LightBulbIcon className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${selectedGap?.index === index && (gapSuggestion || isLoadingGapSuggestion) ? 'text-yellow-300' : 'text-yellow-500 group-hover:text-yellow-300'}`} />
                          <span>{gap}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(isLoadingGapSuggestion || gapSuggestion || gapSuggestionError) && (
                <div className="mt-4 p-4 border border-slate-700 rounded-md bg-slate-800/50">
                  {isLoadingGapSuggestion && (
                    <div className="flex items-center text-slate-300">
                      <LoadingSpinner size="h-5 w-5 mr-2" />
                      <span>Fetching suggestion...</span>
                    </div>
                  )}
                  {gapSuggestionError && !isLoadingGapSuggestion && (
                    <div>
                      <p className="text-red-400 text-sm">{gapSuggestionError}</p>
                    </div>
                  )}
                  {gapSuggestion && !isLoadingGapSuggestion && (
                    <div>
                      <h5 className="text-sm font-semibold text-sky-300 mb-1">AI Suggestion:</h5>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{gapSuggestion}</p>
                      <div className="mt-3 flex space-x-3">
                        <button
                            onClick={handleApplySuggestion}
                            disabled={isLoadingResume}
                            className="text-xs text-sky-300 bg-sky-700 hover:bg-sky-600 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                            aria-label="Apply this suggestion and regenerate resume"
                          >
                            {isLoadingResume && selectedGap ? 'Applying...' : 'Apply Suggestion'}
                          </button>
                        <button
                          onClick={dismissGapSuggestion}
                          className="text-xs text-slate-400 hover:text-sky-300 underline focus:outline-none flex items-center"
                          aria-label="Dismiss suggestion"
                        >
                          <XMarkIcon className="w-3 h-3 mr-1" /> Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                   {(gapSuggestionError && !isLoadingGapSuggestion) && ( 
                    <button
                      onClick={dismissGapSuggestion}
                      className="mt-3 text-xs text-slate-400 hover:text-sky-300 underline focus:outline-none flex items-center"
                      aria-label="Dismiss suggestion"
                    >
                       <XMarkIcon className="w-3 h-3 mr-1" /> Dismiss
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        <div className="space-y-8">
          {isLoadingResume && (
            <div className="flex flex-col items-center justify-center bg-slate-800 p-6 rounded-xl shadow-2xl min-h-[300px]">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-slate-300">Generating your resume...</p>
            </div>
          )}
          {resumeData && !isLoadingResume && (
            <div className="bg-slate-800 p-2 sm:p-4 rounded-xl shadow-2xl">
               <h2 className="text-2xl font-semibold mb-4 text-sky-400 px-4 pt-2">Generated Resume</h2>
              <ResumePreview data={resumeData} template={selectedTemplate} fontGroup={selectedFontGroup} />
            </div>
          )}
          
          {isLoadingCoverLetter && (
             <div className="flex flex-col items-center justify-center bg-slate-800 p-6 rounded-xl shadow-2xl min-h-[200px]">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-slate-300">Generating cover letter...</p>
            </div>
          )}
          {coverLetter && !isLoadingCoverLetter && (
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4 text-sky-400">Generated Cover Letter</h2>
              <CoverLetterPreview letter={coverLetter} resumeName={resumeData?.name} />
            </div>
          )}
           <footer className="text-center py-6 text-slate-500 text-sm">
             Made with ❤️ by <a href="https://www.github.com/w3jdev" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 underline">W3JDEV</a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
