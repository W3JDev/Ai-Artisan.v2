
export type TemplateName = 'classic' | 'modern-compact' | 'modern-alt';
export type FontGroupName = 'sans-serif' | 'serif';
export type TailoringStrength = 'Excellent' | 'Good' | 'Fair';
export type CoverLetterTone = 'professional' | 'enthusiastic' | 'formal';

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string; 
  website?: string; // Generic website
}

export interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  responsibilities: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  details: string; 
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date?: string;
}

export interface JobMatchAnalysis {
  matchScore?: number; // e.g., 85 for 85%
  strengths?: string[]; // e.g., "Excellent alignment with required JavaScript skills."
  gaps?: string[]; // e.g., "Consider highlighting project management experience mentioned in the job description."
}

export interface ResumeData {
  name: string;
  jobTitle?: string; // Optional job title under name
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  licensesCertifications?: CertificationItem[];
  skills: string[]; // Can be an array of strings or a single string with separators
  tailoringKeywords?: string[]; // Keywords AI focused on from job description
  tailoringStrength?: TailoringStrength; // AI's assessment of tailoring quality
  jobMatchAnalysis?: JobMatchAnalysis; // AI's assessment of resume to job description match
}

// Props for ResumeInput component
export interface ResumeInputProps {
  rawText: string;
  onRawTextChange: (text: string) => void;
  jobDescription: string;
  onJobDescriptionChange: (text: string) => void;
  onGenerateResume: () => void;
  onGenerateCoverLetter: () => void;
  isGeneratingResume: boolean;
  isGeneratingCoverLetter: boolean;
  resumeGenerated: boolean;
  selectedTemplate: TemplateName;
  onTemplateChange: (template: TemplateName) => void;
  selectedFontGroup: FontGroupName;
  onFontGroupChange: (fontGroup: FontGroupName) => void;
  onTryExample: () => void;
  coverLetterTone: CoverLetterTone;
  onCoverLetterToneChange: (tone: CoverLetterTone) => void;
  onGenerateInterviewQuestions: () => void;
  isGeneratingInterviewQuestions: boolean;
}

// Props for ResumePreview component
export interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateName;
  fontGroup: FontGroupName;
}
