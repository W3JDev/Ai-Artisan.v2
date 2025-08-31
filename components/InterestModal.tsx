
import React, { useState } from 'react';
import { XMarkIcon } from './icons';

interface InterestModalProps {
  onClose: () => void;
  onSuccess: (name: string, email: string) => void; // Signature can remain, as specific data isn't used by LandingPage
}

// Updated Google Form details based on user's new form
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd0RtICidKlfDFcH4LvzLoyE51TriMlXnD-Rj0BSGQ0dklGUQ/formResponse';
const NAME_FIELD_ID = 'entry.1704232230';
const EMAIL_FIELD_ID = 'entry.1798341692';
const JOB_INDUSTRY_FIELD_ID = 'entry.191421293';
const DISCOVERY_SOURCE_FIELD_ID = 'entry.1012651034';
const COMMENTS_FIELD_ID = 'entry.1983057311';

export const InterestModal: React.FC<InterestModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobIndustry, setJobIndustry] = useState('');
  const [discoverySource, setDiscoverySource] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Basic check for discovery source if you want to make it required
    if (!discoverySource.trim()) {
        setError('Please let us know where you discovered us.');
        return;
    }
    
    // Check if form details are still placeholders (as a safeguard)
    if (GOOGLE_FORM_ACTION_URL.includes('YOUR_GOOGLE_FORM') || NAME_FIELD_ID.startsWith('entry.X')) {
        setError('Developer: Google Form details are not correctly configured in InterestModal.tsx.');
        console.error("Developer: Please configure GOOGLE_FORM_ACTION_URL and field IDs in components/InterestModal.tsx");
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

  return (
    <div
        className="fixed inset-0 bg-dark/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="interest-modal-title"
    >
      <div
        className="bg-dark-light p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative animate-fade-in-up my-auto" // max-w-lg for wider modal
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-sky-300 transition-colors"
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 id="interest-modal-title" className="text-2xl font-bold font-display mb-2 text-center text-sky-300">
          Unlock Your Access & Share Your Insights!
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Register your interest to try AI Resume Artisan and optionally provide feedback.
        </p>

        {error && <p className="mb-4 text-sm text-red-400 bg-red-900/30 p-3 rounded-md text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name-modal" className="block text-sm font-medium text-sky-400 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name-modal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-700 text-gray-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-highlight focus:border-highlight placeholder-slate-500"
              placeholder="e.g., Jane Doe"
              required
              aria-required="true"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="email-modal" className="block text-sm font-medium text-sky-400 mb-1">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email-modal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-700 text-gray-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-highlight focus:border-highlight placeholder-slate-500"
              placeholder="e.g., you@example.com"
              required
              aria-required="true"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="job-industry-modal" className="block text-sm font-medium text-sky-400 mb-1">
              Job Industry (Optional)
            </label>
            <input
              type="text"
              id="job-industry-modal"
              value={jobIndustry}
              onChange={(e) => setJobIndustry(e.target.value)}
              className="w-full p-3 bg-slate-700 text-gray-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-highlight focus:border-highlight placeholder-slate-500"
              placeholder="e.g., Technology, Healthcare, Education"
              disabled={isSubmitting}
            />
          </div>
           <div>
            <label htmlFor="discovery-source-modal" className="block text-sm font-medium text-sky-400 mb-1">
              Where did you first discover us? <span className="text-red-400">*</span>
            </label>
            {/* Using a select for better UX, can be text input too */}
            <select
              id="discovery-source-modal"
              value={discoverySource}
              onChange={(e) => setDiscoverySource(e.target.value)}
              className="w-full p-3 bg-slate-700 text-gray-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-highlight focus:border-highlight"
              required
              aria-required="true"
              disabled={isSubmitting}
            >
              <option value="" disabled>Select an option</option>
              <option value="Search Engine (Google, Bing, etc.)">Search Engine (Google, Bing, etc.)</option>
              <option value="Social Media (LinkedIn, Twitter, Facebook, etc.)">Social Media (LinkedIn, Twitter, Facebook, etc.)</option>
              <option value="Friend or Colleague">Friend or Colleague</option>
              <option value="Blog or Article">Blog or Article</option>
              <option value="Online Forum (Reddit, etc.)">Online Forum (Reddit, etc.)</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="comments-modal" className="block text-sm font-medium text-sky-400 mb-1">
              Comments & Suggestions or Any challenges you facing? (Optional)
            </label>
            <textarea
              id="comments-modal"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 bg-slate-700 text-gray-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-highlight focus:border-highlight placeholder-slate-500 resize-y"
              placeholder="Your feedback is valuable!"
              disabled={isSubmitting}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-highlight hover:bg-sky-400 text-white font-semibold py-3 px-6 rounded-lg shadow-cta transition-transform hover:scale-105 text-base disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Unlock Access & Submit Feedback'}
          </button>
        </form>
        <p className="mt-6 text-xs text-slate-500 text-center">
          Your information helps us improve. Submissions are sent to a Google Form.
        </p>
      </div>
    </div>
  );
};
