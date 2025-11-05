

import React, { useState, useCallback, useEffect } from 'react';
import { ResumeInput } from './components/ResumeInput';
import { ResumePreview } from './components/ResumePreview';
import { CoverLetterPreview } from './components/CoverLetterPreview';
import { generateResumeFromText, generateCoverLetterStream, getSuggestionForGap, generateInterviewQuestions } from './services/geminiService';
import type { ResumeData, TemplateName, FontGroupName, TailoringStrength, CoverLetterTone } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LightBulbIcon, XMarkIcon } from './components/icons'; 
import { CheckBadgeIcon } from './components/icons'; // Assuming CheckBadgeIcon is available

const SAMPLE_RAW_TEXT = `
John Doe
Senior Software Engineer
john.doe@email.com | 555-123-4567 | linkedin.com/in/johndoe | San Francisco, CA

Professional Summary
Experienced Senior Software Engineer with over 8 years of expertise in designing, developing, and deploying scalable web applications. Proficient in JavaScript, React, Node.js, and cloud technologies. Passionate about building high-quality software and leading technical teams to success.

Experience
Tech Solutions Inc. - Senior Software Engineer | Jan 2018 - Present
- Led the development of a new microservices architecture, improving system scalability by 50%.
- Mentored a team of 4 junior engineers, fostering a culture of collaboration and code quality.
- Developed and maintained a high-traffic e-commerce platform using React, Redux, and Node.js.
- Implemented CI/CD pipelines using Jenkins and Docker, reducing deployment time by 75%.

Web Innovators - Software Engineer | Jun 2015 - Dec 2017
- Contributed to the development of a client-facing SaaS application.
- Wrote clean, maintainable, and well-tested code.
- Collaborated with product managers and designers to deliver new features.

Education
University of California, Berkeley - B.S. in Computer Science | 2011 - 2015

Skills
- Languages: JavaScript, TypeScript, Python
- Frontend: React, Redux, HTML5, CSS3, Webpack
- Backend: Node.js, Express, REST APIs
- Databases: PostgreSQL, MongoDB
- Cloud/DevOps: AWS, Docker, Jenkins, Kubernetes
`;

const SAMPLE_JOB_DESCRIPTION = `
Job Title: Senior Frontend Engineer
Location: San Francisco, CA

We are looking for a passionate Senior Frontend Engineer to join our dynamic team. You will be responsible for building and maintaining our user-facing web applications.

Responsibilities:
- Develop new user-facing features using React.js.
- Build reusable components and front-end libraries for future use.
- Translate designs and wireframes into high-quality code.
- Optimize components for maximum performance across a vast array of web-capable devices and browsers.
- Work closely with product managers, designers, and other engineers.

Qualifications:
- 5+ years of professional experience in software development.
- Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model.
- Thorough understanding of React.js and its core principles.
- Experience with popular React.js workflows (such as Flux or Redux).
- Familiarity with modern front-end build pipelines and tools.
- Experience with RESTful APIs.
- Knowledge of modern authorization mechanisms, such as JSON Web Token.
`;

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
  const [coverLetterTone, setCoverLetterTone] = useState<CoverLetterTone>('professional');
  const [interviewQuestions, setInterviewQuestions] = useState<string[] | null>(null);
  const [isLoadingInterviewQuestions, setIsLoadingInterviewQuestions] = useState<boolean>(false);


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
    setInterviewQuestions(null); // Reset interview questions on new resume
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
      const stream = await generateCoverLetterStream(resumeData, jobDescription, coverLetterTone);
      for await (const chunk of stream) {
        setCoverLetter((prev) => prev + chunk.text);
      }
    } catch (err: any) { 
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter.');
    } finally {
      setIsLoadingCoverLetter(false);
    }
  }, [resumeData, jobDescription, coverLetterTone]);
  
  const handleGenerateInterviewQuestions = useCallback(async () => {
    if (!resumeData || !jobDescriptionUsedForLastResume.trim()) {
      setError('Please generate a resume with a job description first.');
      return;
    }
    setIsLoadingInterviewQuestions(true);
    setError(null);
    setInterviewQuestions(null);
    try {
      const questions = await generateInterviewQuestions(resumeData, jobDescriptionUsedForLastResume);
      setInterviewQuestions(questions);
    } catch (err: any) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate interview questions.');
    } finally {
      setIsLoadingInterviewQuestions(false);
    }
  }, [resumeData, jobDescriptionUsedForLastResume]);

  const handleTryExample = useCallback(() => {
    setRawText(SAMPLE_RAW_TEXT);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  }, []);


  const handleGapClick = async (gapText: string, index: number) => {
    if (!resumeData || !jobDescriptionUsedForLastResume.trim()) return;

    // If clicking the same gap again, toggle it off.
    if (selectedGap && selectedGap.index === index) {
        dismissGapSuggestion();
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
                                (jobDescriptionUsedForLastResume || jobDescription).trim().length > 0;

  const strengthColorClasses: { [key in TailoringStrength]: string } = {
    Excellent: 'text-green-600 bg-green-100',
    Good: 'text-sky-600 bg-sky-100',
    Fair: 'text-yellow-600 bg-yellow-100',
  };
  
  const scoreProgressColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-sky-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Inputs & Controls */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-slate-800 text-white p-6 rounded-lg shadow-2xl">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold font-display text-sky-300">AI Resume Artisan</h2>
              </div>
              <ResumeInput
                rawText={rawText}
                onRawTextChange={setRawText}
                jobDescription={jobDescription}
                onJobDescriptionChange={setJobDescription}
                onGenerateResume={handleGenerateResume}
                onGenerateCoverLetter={handleGenerateCoverLetter}
                isGeneratingResume={isLoadingResume}
                isGeneratingCoverLetter={isLoadingCoverLetter}
                resumeGenerated={!!resumeData}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                selectedFontGroup={selectedFontGroup}
                onFontGroupChange={setSelectedFontGroup}
                onTryExample={handleTryExample}
                coverLetterTone={coverLetterTone}
                onCoverLetterToneChange={setCoverLetterTone}
                onGenerateInterviewQuestions={handleGenerateInterviewQuestions}
                isGeneratingInterviewQuestions={isLoadingInterviewQuestions}
              />
            </div>

            {error && (
              <div className="bg-red-200/90 border border-red-500 text-red-800 px-4 py-3 rounded-lg relative shadow-md" role="alert">
                <strong className="font-bold">An error occurred: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {/* AI Analysis Sections */}
            {showTailoringInsights && resumeData && (
              <div className="space-y-6 animate-fade-in-up">
                {/* AI Tailoring Insights */}
                {(resumeData.tailoringStrength || resumeData.tailoringKeywords) && (
                    <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">AI Tailoring Insights</h3>
                        {resumeData.tailoringStrength && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-700 mb-1">Overall Tailoring Fit</h4>
                                <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${strengthColorClasses[resumeData.tailoringStrength] || 'text-gray-600 bg-gray-100'}`}>{resumeData.tailoringStrength}</span>
                            </div>
                        )}
                        {resumeData.tailoringKeywords && resumeData.tailoringKeywords.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Prioritized Key Terms</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {resumeData.tailoringKeywords.map(keyword => (
                                        <span key={keyword} className="bg-sky-100 text-sky-800 text-xs font-medium px-2 py-0.5 rounded-full">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {/* Job Match Analysis */}
                {resumeData.jobMatchAnalysis && (
                    <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Job Match Analysis</h3>
                        
                        {resumeData.jobMatchAnalysis.matchScore !== undefined && (
                          <div className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-semibold text-gray-700">Job Alignment Score</h4>
                                <span className={`text-lg font-bold ${scoreProgressColor(resumeData.jobMatchAnalysis.matchScore).replace('bg-', 'text-')}`}>{resumeData.jobMatchAnalysis.matchScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className={`${scoreProgressColor(resumeData.jobMatchAnalysis.matchScore)} h-2.5 rounded-full`} style={{width: `${resumeData.jobMatchAnalysis.matchScore}%`}}></div>
                            </div>
                          </div>
                        )}
                        
                        {resumeData.jobMatchAnalysis.strengths && resumeData.jobMatchAnalysis.strengths.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Alignment Strengths</h4>
                                <ul className="space-y-1.5">
                                {resumeData.jobMatchAnalysis.strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start text-sm text-gray-600"><CheckBadgeIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/> {strength}</li>
                                ))}
                                </ul>
                            </div>
                        )}

                        {resumeData.jobMatchAnalysis.gaps && resumeData.jobMatchAnalysis.gaps.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Potential Gaps / Improvements</h4>
                            <ul className="space-y-2">
                              {resumeData.jobMatchAnalysis.gaps.map((gap, index) => (
                                <li key={index} className="bg-gray-50 border border-gray-200 rounded-lg transition-shadow hover:shadow-md">
                                  <div className="p-3 flex justify-between items-start">
                                    <p className="text-gray-700 pr-4">{gap}</p>
                                    <button
                                      onClick={() => handleGapClick(gap, index)}
                                      title="Get AI Suggestion"
                                      aria-label={`Get AI suggestion for gap: ${gap}`}
                                      className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${selectedGap?.index === index ? 'bg-sky-600 text-white' : 'bg-gray-200 hover:bg-sky-500 hover:text-white text-sky-800'}`}
                                    >
                                      <LightBulbIcon className="w-5 h-5" />
                                    </button>
                                  </div>

                                  {/* INLINE SUGGESTION BOX */}
                                  {selectedGap?.index === index && (
                                    <div className="border-t border-gray-200 p-4 bg-gray-50/50 rounded-b-lg">
                                      {isLoadingGapSuggestion ? (
                                        <div className="flex items-center text-sky-600">
                                            <LoadingSpinner size="h-5 w-5 mr-3" color="text-sky-600" />
                                            <span>Finding the best suggestion...</span>
                                        </div>
                                      ) : gapSuggestionError ? (
                                        <div className="text-red-700 bg-red-100 p-3 rounded-md">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-semibold">Error</p>
                                                <button onClick={dismissGapSuggestion} className="p-1 rounded-full hover:bg-red-200"><XMarkIcon className="w-4 h-4" /></button>
                                            </div>
                                            <p>{gapSuggestionError}</p>
                                        </div>
                                      ) : gapSuggestion ? (
                                        <div className="space-y-3">
                                            <p className="text-gray-800 font-semibold">AI Suggestion:</p>
                                            <blockquote className="bg-gray-100 p-3 rounded-md border-l-4 border-sky-500 text-gray-700 italic">
                                                {gapSuggestion}
                                            </blockquote>
                                            <div className="flex space-x-3 pt-2">
                                                <button
                                                    onClick={handleApplySuggestion}
                                                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                                                >
                                                    Apply Suggestion
                                                </button>
                                                <button
                                                    onClick={dismissGapSuggestion}
                                                    className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                )}
              </div>
            )}
            {isLoadingInterviewQuestions && (
              <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 flex items-center justify-center">
                  <LoadingSpinner color="text-sky-500" />
                  <span className="ml-3 text-gray-600">Generating interview questions...</span>
              </div>
            )}
            {interviewQuestions && !isLoadingInterviewQuestions && (
                <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">AI-Generated Interview Questions</h3>
                    <ul className="space-y-3">
                        {interviewQuestions.map((question, index) => (
                            <li key={index} className="flex items-start p-3 bg-gray-50 rounded-md border-l-4 border-sky-500">
                                <span className="font-semibold text-sky-700 mr-2">{index + 1}.</span>
                                <p className="text-gray-700">{question}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>

          {/* Right Column: Previews */}
          <div className="space-y-8">
            {isLoadingResume && (
              <div className="flex justify-center items-center p-10 bg-white rounded-lg shadow-md min-h-[500px]">
                <div className="text-center">
                    <LoadingSpinner color="text-sky-500" />
                    <p className="mt-2 text-gray-600">Crafting your resume...</p>
                </div>
              </div>
            )}
            {resumeData && !isLoadingResume && (
              <ResumePreview data={resumeData} template={selectedTemplate} fontGroup={selectedFontGroup} />
            )}
            {isLoadingCoverLetter && (
              <div className="flex justify-center items-center p-10 bg-white rounded-lg shadow-md min-h-[400px]">
                 <div className="text-center">
                    <LoadingSpinner color="text-sky-500" />
                    <p className="mt-2 text-gray-600">Writing your cover letter...</p>
                </div>
              </div>
            )}
            {coverLetter && !isLoadingCoverLetter && (
              <CoverLetterPreview letter={coverLetter} resumeData={resumeData} />
            )}
             {!resumeData && !isLoadingResume && (
                <div className="bg-white text-left p-8 rounded-lg shadow-md border-2 border-dashed border-gray-300 min-h-[500px] flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Welcome to AI Resume Artisan!</h3>
                    <p className="text-gray-500 mb-6 text-center">Your generated resume will appear here once you provide your details.</p>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Quick Start Guide:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                            <li>Paste your resume details in the input field on the left.</li>
                            <li>(Recommended) Add a job description to tailor your resume for a specific role.</li>
                            <li>Click "Generate Resume" to see the magic happen!</li>
                            <li>For a ready-made example, just click the "Try with an Example" button above.</li>
                        </ol>
                    </div>
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
