
export type TemplateName = 'enterprise-pro' | 'modern-compact' | 'classic-serif' | 'minimal-sans' | 'swiss-grid';
export type FontGroupName = 'sans-serif' | 'serif' | 'mono';
export type TailoringStrength = 'Excellent' | 'Good' | 'Fair';
export type CoverLetterTone = 'professional' | 'enthusiastic' | 'formal';

export interface ResumeSettings {
  margin: 'compact' | 'standard' | 'generous';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  fontSizeScale: 'small' | 'medium' | 'large';
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string; 
  website?: string; 
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
  matchScore?: number; 
  strengths?: string[]; 
  gaps?: string[]; 
}

export interface AtsAuditResult {
  parseabilityScore: number;
  missingCriticalKeywords: string[];
  formattingIssues: string[];
  sectionHeaderStandardization: 'Pass' | 'Fail';
  estimatedHumanReviewStatus: 'Auto-Reject' | 'Review' | 'Priority';
}

export interface ResumeData {
  name: string;
  jobTitle?: string; 
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  licensesCertifications?: CertificationItem[];
  skills: string[]; 
  tailoringKeywords?: string[]; 
  tailoringStrength?: TailoringStrength; 
  jobMatchAnalysis?: JobMatchAnalysis; 
  suggestedHeadshotPrompt?: string; 
}

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
  settings: ResumeSettings;
  onSettingsChange: (settings: ResumeSettings) => void;
  
  // New Props for Image & Research
  onGenerateHeadshot: (size: '1K' | '2K' | '4K') => void;
  isGeneratingHeadshot: boolean;
  onResearchTrends: () => void;
  isResearching: boolean;
  industryTrends: string | null;
}

export interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateName;
  fontGroup: FontGroupName;
  settings: ResumeSettings;
  headshotImage: string | null; 
}
