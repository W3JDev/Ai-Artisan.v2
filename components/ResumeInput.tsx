
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import type { ResumeInputProps, TemplateName, FontGroupName, CoverLetterTone } from '../types';
import { XMarkIcon } from './icons'; // Import the new icon

export const ResumeInput: React.FC<ResumeInputProps> = ({
  rawText,
  onRawTextChange,
  jobDescription,
  onJobDescriptionChange,
  onGenerateResume,
  onGenerateCoverLetter,
  isGeneratingResume,
  isGeneratingCoverLetter,
  resumeGenerated,
  selectedTemplate,
  onTemplateChange,
  selectedFontGroup,
  onFontGroupChange,
  onTryExample,
  coverLetterTone,
  onCoverLetterToneChange,
  onGenerateInterviewQuestions,
  isGeneratingInterviewQuestions,
}) => {
  const commonSelectClasses = "w-full p-3 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed";
  const commonTextareaWrapperClasses = "relative";
  const commonClearButtonClasses = "absolute top-2 right-2 p-1 text-slate-400 hover:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  const isAnyActionLoading = isGeneratingResume || isGeneratingCoverLetter || isGeneratingInterviewQuestions;


  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
            type="button"
            onClick={onTryExample}
            disabled={isAnyActionLoading}
            className="text-sm font-medium text-sky-400 hover:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            Try with an Example
        </button>
      </div>
      <div>
        <label htmlFor="rawText" className="block text-sm font-medium text-sky-300 mb-1">
          Paste Your Resume Details
        </label>
        <div className={commonTextareaWrapperClasses}>
          <textarea
            id="rawText"
            rows={10}
            className={`${commonSelectClasses} resize-y pr-8`} // Added pr-8 for button space
            placeholder="Paste your current resume, LinkedIn profile text, or just jot down your experience, skills, and education..."
            value={rawText}
            onChange={(e) => onRawTextChange(e.target.value)}
            disabled={isAnyActionLoading}
          />
          {rawText && (
            <button
              type="button"
              onClick={() => onRawTextChange('')}
              className={commonClearButtonClasses}
              aria-label="Clear resume details"
              title="Clear resume details"
              disabled={isAnyActionLoading}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-400">Tip: Include links to your LinkedIn, portfolio, or other relevant sites directly in the text.</p>
      </div>

      <div>
        <label htmlFor="jobDescription" className="block text-sm font-medium text-sky-300 mb-1">
          Job Description (Optional, for Resume Tailoring & Cover Letter)
        </label>
        <div className={commonTextareaWrapperClasses}>
          <textarea
            id="jobDescription"
            rows={5}
            className={`${commonSelectClasses} resize-y pr-8`} // Added pr-8 for button space
            placeholder="Paste the job description here to tailor your resume and cover letter..."
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            disabled={isAnyActionLoading}
          />
          {jobDescription && (
            <button
              type="button"
              onClick={() => onJobDescriptionChange('')}
              className={commonClearButtonClasses}
              aria-label="Clear job description"
              title="Clear job description"
              disabled={isAnyActionLoading}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="templateSelect" className="block text-sm font-medium text-sky-300 mb-1">
            Resume Template
          </label>
          <select
            id="templateSelect"
            value={selectedTemplate}
            onChange={(e) => onTemplateChange(e.target.value as TemplateName)}
            className={commonSelectClasses}
            disabled={isAnyActionLoading}
          >
            <option value="classic">Classic</option>
            <option value="modern-compact">Modern Compact</option>
            <option value="modern-alt">Modern Two-Column</option>
          </select>
        </div>
        <div>
          <label htmlFor="fontGroupSelect" className="block text-sm font-medium text-sky-300 mb-1">
            Font Style
          </label>
          <select
            id="fontGroupSelect"
            value={selectedFontGroup}
            onChange={(e) => onFontGroupChange(e.target.value as FontGroupName)}
            className={commonSelectClasses}
            disabled={isAnyActionLoading}
          >
            <option value="sans-serif">Sans-Serif (Lato)</option>
            <option value="serif">Serif (Merriweather)</option>
          </select>
        </div>
        <div>
          <label htmlFor="toneSelect" className="block text-sm font-medium text-sky-300 mb-1">
            Cover Letter Tone
          </label>
          <select
            id="toneSelect"
            value={coverLetterTone}
            onChange={(e) => onCoverLetterToneChange(e.target.value as CoverLetterTone)}
            className={commonSelectClasses}
            disabled={isAnyActionLoading}
          >
            <option value="professional">Professional</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="formal">Formal</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onGenerateResume}
          disabled={isAnyActionLoading || !rawText.trim()}
          className="flex-grow sm:flex-grow-0 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
        >
          {isGeneratingResume ? <LoadingSpinner size="h-5 w-5 mr-2" /> : null}
          {isGeneratingResume ? 'Crafting...' : 'Generate Resume'}
        </button>
        <button
          type="button"
          onClick={onGenerateCoverLetter}
          disabled={isAnyActionLoading || !resumeGenerated}
          className="flex-grow sm:flex-grow-0 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-sky-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-500 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGeneratingCoverLetter ? <LoadingSpinner size="h-5 w-5 mr-2" /> : null}
          {isGeneratingCoverLetter ? 'Writing...' : 'Generate Cover Letter'}
        </button>
         <button
          type="button"
          onClick={onGenerateInterviewQuestions}
          disabled={isAnyActionLoading || !resumeGenerated}
          className="flex-grow sm:flex-grow-0 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-sky-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-500 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGeneratingInterviewQuestions ? <LoadingSpinner size="h-5 w-5 mr-2" /> : null}
          {isGeneratingInterviewQuestions ? 'Prepping...' : 'Prep Interview Questions'}
        </button>
      </div>
    </div>
  );
};
