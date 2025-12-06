
import React from 'react';

interface LoadingSpinnerProps {
  size?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'h-8 w-8', color = 'text-sky-400' }) => {
  return (
    <div className={`relative ${size}`}>
      <div className={`absolute inset-0 rounded-full border-2 border-t-transparent border-b-transparent border-l-sky-400 border-r-sky-500 animate-spin`}></div>
      <div className={`absolute inset-1 rounded-full border-2 border-t-transparent border-b-transparent border-l-purple-400 border-r-purple-500 animate-spin`} style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-neon"></div>
      </div>
    </div>
  );
};
