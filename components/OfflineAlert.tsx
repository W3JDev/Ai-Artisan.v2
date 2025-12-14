
import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, CheckIcon } from './icons';

export const OfflineAlert: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center bg-red-500/90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border border-red-400 animate-fade-in-up">
        <ExclamationTriangleIcon className="w-5 h-5 mr-3" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">Offline Mode</p>
          <p className="text-xs opacity-90">AI features unavailable. Changes saved locally.</p>
        </div>
      </div>
    );
  }

  if (showBackOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center bg-green-500/90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border border-green-400 animate-fade-in-up">
        <CheckIcon className="w-5 h-5 mr-3" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">Connected</p>
          <p className="text-xs opacity-90">Syncing with cloud...</p>
        </div>
      </div>
    );
  }

  return null;
};
