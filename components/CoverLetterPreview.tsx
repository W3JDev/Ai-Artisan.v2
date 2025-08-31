import React from 'react';
import { DownloadIcon } from './icons';
import { downloadCoverLetterAsPdf } from '../utils/downloadUtils';

interface CoverLetterPreviewProps {
  letter: string;
  resumeName?: string;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ letter, resumeName }) => {
  
  const handleDownload = () => {
    downloadCoverLetterAsPdf(letter, resumeName);
  };

  return (
    <div className="bg-white text-gray-800 p-6 sm:p-8 shadow-resume font-sans text-[10pt] leading-relaxed relative">
      <button
        onClick={handleDownload}
        title="Download Cover Letter as PDF"
        aria-label="Download Cover Letter as PDF"
        className="absolute top-4 right-4 p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      >
        <DownloadIcon className="w-5 h-5" />
      </button>
      <pre className="whitespace-pre-wrap font-sans text-justify">{letter}</pre>
    </div>
  );
};