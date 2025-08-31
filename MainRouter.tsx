import React, { useState, useEffect, useCallback } from 'react';
import App from './App';
import { LandingPage } from './components/LandingPage';

const INTEREST_STORAGE_KEY = 'aiResumeArtisan_hasRegisteredInterest_v1';

const MainRouter: React.FC = () => {
  const [hasRegisteredInterest, setHasRegisteredInterest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedInterest = localStorage.getItem(INTEREST_STORAGE_KEY);
      if (storedInterest === 'true') {
        setHasRegisteredInterest(true);
      }
    } catch (error) {
      console.warn("Could not access localStorage for interest status:", error);
      // Fallback to showing landing page if localStorage is unavailable
    }
    setIsLoading(false);
  }, []);

  const handleInterestRegistered = useCallback(() => {
    try {
      localStorage.setItem(INTEREST_STORAGE_KEY, 'true');
    } catch (error) {
      console.warn("Could not save interest status to localStorage:", error);
    }
    setHasRegisteredInterest(true);
  }, []);

  if (isLoading) {
    // Optional: Add a brief loading spinner for initial check
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        {/* You can use your existing LoadingSpinner component here if desired */}
      </div>
    );
  }

  if (hasRegisteredInterest) {
    return <App />;
  }

  return <LandingPage onInterestRegistered={handleInterestRegistered} />;
};

export default MainRouter;
