
import React from 'react';
import { DownloadIcon } from './icons';
import { downloadCoverLetterAsPdf } from '../utils/downloadUtils';
import type { ResumeData } from '../types';

interface CoverLetterPreviewProps {
  letter: string;
  resumeData: ResumeData | null;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ letter, resumeData }) => {
  if (!resumeData) {
    // This case should ideally not be hit if App.tsx logic is correct, but it's a good safeguard.
    return (
      <div className="bg-white text-gray-800 p-8 shadow-resume font-sans">
        <p className="text-gray-500">Could not display cover letter: resume data is missing.</p>
      </div>
    );
  }

  const { name, contact } = resumeData;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Construct the full letter text for the PDF download
  const fullLetterTextForPdf = [
    name,
    contact.location,
    contact.phone,
    contact.email,
    '', // space
    currentDate,
    '', // space
    'Hiring Manager',
    '[Company Name]',
    '[Company Address]',
    '', // space
    letter,
  ].filter(Boolean).join('\n'); // filter(Boolean) removes any undefined/null/empty strings

  const handleDownload = () => {
    downloadCoverLetterAsPdf(fullLetterTextForPdf, name);
  };

  return (
    <div className="bg-white text-gray-800 p-6 sm:p-8 shadow-resume font-sans text-[10pt] leading-relaxed relative">
      <button
        onClick={handleDownload}
        title="Download Cover Letter as PDF"
        aria-label="Download Cover Letter as PDF"
        className="absolute top-4 right-4 p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 print:hidden"
      >
        <DownloadIcon className="w-5 h-5" />
      </button>
      
      <div className="space-y-4">
        {/* Sender's Info */}
        <div className="text-left">
          <p className="font-bold text-lg text-primary">{name}</p>
          {contact.location && <p className="text-sm text-gray-600">{contact.location}</p>}
          {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
          {contact.email && <p className="text-sm text-gray-600">{contact.email}</p>}
        </div>

        {/* Date */}
        <div className="text-left pt-4">
          <p>{currentDate}</p>
        </div>

        {/* Recipient's Info */}
        <div className="text-left pt-4">
          <p className="font-semibold">Hiring Manager</p>
          <p className="text-gray-500 italic">[Company Name]</p>
          <p className="text-gray-500 italic">[Company Address]</p>
        </div>
        
        {/* Letter Body */}
        <pre className="whitespace-pre-wrap font-sans text-justify pt-4">{letter}</pre>
      </div>
    </div>
  );
};
