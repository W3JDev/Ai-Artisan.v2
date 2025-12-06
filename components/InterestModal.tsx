
import React, { useState } from 'react';
import { XMarkIcon, ShieldCheckIcon, UserGroupIcon } from './icons';

interface InterestModalProps {
  onClose: () => void;
  onSuccess: (name: string, email: string) => void;
}

// Updated Google Form details based on user's new form
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd0RtICidKlfDFcH4LvzLoyE51TriMlXnD-Rj0BSGQ0dklGUQ/formResponse';
const NAME_FIELD_ID = 'entry.1704232230';
const EMAIL_FIELD_ID = 'entry.1798341692';
const JOB_INDUSTRY_FIELD_ID = 'entry.191421293';
const DISCOVERY_SOURCE_FIELD_ID = 'entry.1012651034';
const COMMENTS_FIELD_ID = 'entry.1983057311';

const PASSCODE = '6728';

export const InterestModal: React.FC<InterestModalProps> = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  
  // Signup State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobIndustry, setJobIndustry] = useState('');
  const [discoverySource, setDiscoverySource] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signin State
  const [passcode, setPasscode] = useState('');

  // General State
  const [error, setError] = useState('');

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!discoverySource.trim()) {
        setError('Please let us know where you discovered us.');
        return;
    }
    
    // Safeguard check
    if (GOOGLE_FORM_ACTION_URL.includes('YOUR_GOOGLE_FORM')) {
        setError('Developer: Google Form details are not correctly configured.');
        return;
    }

    setError('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append(NAME_FIELD_ID, name);
    formData.append(EMAIL_FIELD_ID, email);
    formData.append(JOB_INDUSTRY_FIELD_ID, jobIndustry);
    formData.append(DISCOVERY_SOURCE_FIELD_ID, discoverySource);
    formData.append(COMMENTS_FIELD_ID, comments);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors', 
      });
    } catch (fetchError) {
      console.warn('Attempted to submit to Google Form. Error:', fetchError);
    } finally {
      setIsSubmitting(false);
      onSuccess(name, email); 
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === PASSCODE) {
      onSuccess('Returning User', 'signin@user.com');
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  return (
    <div
        className="fixed inset-0 bg-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="interest-modal-title"
    >
      <div
        className="bg-charcoal border border-glass-border p-0 rounded-2xl shadow-glass-xl w-full max-w-md relative animate-fade-in-up my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Header / Tabs */}
        <div className="bg-white/5 border-b border-white/10 p-2 flex">
            <button 
                onClick={() => { setActiveTab('signup'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'signup' ? 'bg-accent text-obsidian shadow-neon' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
                New User
            </button>
            <button 
                onClick={() => { setActiveTab('signin'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'signin' ? 'bg-accent text-obsidian shadow-neon' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
                Sign In
            </button>
        </div>

        <div className="p-8">
            <h2 id="interest-modal-title" className="text-2xl font-bold font-display mb-2 text-center text-white">
            {activeTab === 'signup' ? 'Get Early Access' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-slate-400 text-center mb-6">
            {activeTab === 'signup' 
                ? 'Join AI Resume Artisan to unlock premium career tools.' 
                : 'Enter your access code to continue.'}
            </p>

            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center animate-pulse">
                    {error}
                </div>
            )}

            {activeTab === 'signup' ? (
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name-modal" className="block text-xs font-semibold text-accent uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                    type="text"
                    id="name-modal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-obsidian border border-glass-border rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-slate-600"
                    placeholder="e.g., Jane Doe"
                    required
                    disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="email-modal" className="block text-xs font-semibold text-accent uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                    type="email"
                    id="email-modal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-obsidian border border-glass-border rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-slate-600"
                    placeholder="e.g., you@example.com"
                    required
                    disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="discovery-source-modal" className="block text-xs font-semibold text-accent uppercase tracking-wider mb-1.5">How did you find us?</label>
                    <select
                    id="discovery-source-modal"
                    value={discoverySource}
                    onChange={(e) => setDiscoverySource(e.target.value)}
                    className="w-full p-3 bg-obsidian border border-glass-border rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                    required
                    disabled={isSubmitting}
                    >
                    <option value="" disabled className="text-slate-500">Select an option</option>
                    <option value="Search Engine">Search Engine</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Friend or Colleague">Friend or Colleague</option>
                    <option value="Other">Other</option>
                    </select>
                </div>
                
                <button
                    type="submit"
                    className="w-full mt-4 bg-accent hover:bg-accent-glow text-obsidian font-bold py-3.5 rounded-xl shadow-neon transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Registering...' : 'Unlock Access'}
                </button>
                <p className="mt-4 text-[10px] text-slate-500 text-center">
                    Data sent to Google Forms for beta registration.
                </p>
                </form>
            ) : (
                <form onSubmit={handleSignInSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <ShieldCheckIcon className="w-8 h-8 text-accent" />
                        </div>
                        <label htmlFor="passcode-modal" className="block text-xs font-semibold text-accent uppercase tracking-wider mb-3">Enter 4-Digit Passcode</label>
                        <input
                            type="password"
                            id="passcode-modal"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            maxLength={4}
                            className="w-48 p-4 text-center text-3xl tracking-[0.5em] font-mono bg-obsidian border border-glass-border rounded-xl text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-slate-700"
                            placeholder="••••"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-glow text-obsidian font-bold py-3.5 rounded-xl shadow-neon transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Enter App
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
