
import React, { useState } from 'react'; // Added useState
import type { ResumePreviewProps, ContactInfo, ExperienceItem, EducationItem, CertificationItem } from '../types';
import { MailIcon, PhoneIcon, LinkedInIcon, GlobeAltIcon, LocationMarkerIcon, DownloadIcon, ClipboardCopyIcon, CheckIcon } from './icons'; // Added ClipboardCopyIcon, CheckIcon
import { downloadResumeAsPdf } from '../utils/downloadUtils';
import { linkifyText, formatResumeDataAsText } from '../utils/textUtils'; // Added formatResumeDataAsText

const SectionTitleClassic: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-xs font-bold tracking-wider uppercase text-gray-500 pb-1.5 mb-3 border-b border-gray-300">
    {title}
  </h2>
);

const SectionTitleModern: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-sm font-semibold tracking-wider uppercase text-accent pb-1 mb-4">
    {title}
  </h2>
);

const ContactDetail: React.FC<{ icon: React.ReactNode, text?: string, href?: string, template: 'classic' | 'modern-compact' }> = ({ icon, text, href, template }) => {
  if (!text) return null;
  const textMarginClass = template === 'modern-compact' ? 'ml-2' : 'ml-1.5';
  const content = (
    <>
      {icon}
      <span className={`${textMarginClass} ${template === 'modern-compact' ? 'group-hover:underline' : ''}`}>{text}</span>
    </>
  );
  const baseClasses = `flex items-center group transition-colors ${template === 'modern-compact' ? 'text-gray-600 hover:text-accent' : 'text-gray-700 hover:text-accent'}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
        {content}
      </a>
    );
  }
  return <div className={baseClasses}>{content}</div>;
};


export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, fontGroup }) => {
  const { name, jobTitle, contact, summary, experience, education, licensesCertifications, skills } = data;
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = async () => {
    const resumeContentElement = document.getElementById('resume-inner-content-for-pdf'); 
    if (resumeContentElement) {
      await downloadResumeAsPdf(resumeContentElement, name || 'Resume');
    } else {
      console.error("Resume inner content element not found for PDF generation.");
      alert("Error preparing resume for download. Please try again.");
    }
  };

  const handleCopyToClipboard = () => {
    const resumeText = formatResumeDataAsText(data);
    navigator.clipboard.writeText(resumeText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy resume to clipboard. Please try again.');
    });
  };

  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      let display = urlObj.hostname.replace(/^www\./, '');
      if (urlObj.pathname !== '/' && urlObj.pathname.length < 20) display += urlObj.pathname;
      else if (urlObj.pathname.length >= 20) display += urlObj.pathname.substring(0,17) + "...";
      return display;
    } catch (e) {
      return url.length > 30 ? url.substring(0,27) + "..." : url;
    }
  };
  
  const getFullUrl = (urlCandidate: string) => {
    if (!urlCandidate) return '#';
    if (urlCandidate.startsWith('http://') || urlCandidate.startsWith('https://')) {
        return urlCandidate;
    }
    return `https://${urlCandidate}`;
  };

  const SectionTitleComponent = template === 'modern-compact' ? SectionTitleModern : SectionTitleClassic;
  const iconSize = template === 'modern-compact' ? "w-4 h-4" : "w-3.5 h-3.5";
  const commonButtonClasses = "p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 print:hidden";


  return (
    <div 
      id="resume-preview-content-area"
      className={`bg-white text-gray-800 p-6 sm:p-8 shadow-resume text-[10pt] leading-relaxed A4-aspect-ratio-approx relative template-${template} font-group-${fontGroup}`}
    >
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={handleCopyToClipboard}
          title={isCopied ? "Copied!" : "Copy Resume Text"}
          aria-label={isCopied ? "Resume text copied to clipboard" : "Copy resume text to clipboard"}
          className={`${commonButtonClasses} ${isCopied ? 'bg-green-500 hover:bg-green-600' : ''}`}
        >
          {isCopied ? <CheckIcon className="w-5 h-5" /> : <ClipboardCopyIcon className="w-5 h-5" />}
        </button>
        <button
          id="download-resume-pdf-button" 
          onClick={handleDownload}
          title="Download Resume as PDF"
          aria-label="Download Resume as PDF"
          className={commonButtonClasses}
        >
          <DownloadIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div id="resume-inner-content-for-pdf"> 
        {/* Header */}
        <div className={`text-center mb-4 ${template === 'modern-compact' ? 'modern-header pb-2' : 'classic-header'}`}>
          <h1 className={`font-bold text-primary ${template === 'modern-compact' ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>{name.toUpperCase()}</h1>
          {jobTitle && <p className={`font-medium ${template === 'modern-compact' ? 'text-lg text-accent' : 'text-md text-secondary'}`}>{jobTitle}</p>}
        </div>
        
        {/* Contact Info */}
        <div className={`flex flex-wrap justify-center items-center mb-4 pb-2 ${
          template === 'modern-compact' 
            ? 'gap-x-4 gap-y-2 modern-contact' 
            : 'text-xs gap-x-3 gap-y-1 text-gray-600 border-b border-gray-300'
        }`}>
          {contact.email && <ContactDetail template={template} icon={<MailIcon className={iconSize}/>} text={contact.email} href={`mailto:${contact.email}`} />}
          {contact.phone && <ContactDetail template={template} icon={<PhoneIcon className={iconSize}/>} text={contact.phone} href={`tel:${contact.phone}`} />}
          {contact.location && <ContactDetail template={template} icon={<LocationMarkerIcon className={iconSize}/>} text={contact.location} />}
          {contact.linkedin && <ContactDetail template={template} icon={<LinkedInIcon className={iconSize}/>} text={getDisplayUrl(contact.linkedin)} href={getFullUrl(contact.linkedin)} />}
          {contact.portfolio && <ContactDetail template={template} icon={<GlobeAltIcon className={iconSize}/>} text="Portfolio" href={getFullUrl(contact.portfolio)} />}
          {contact.website && !contact.portfolio && <ContactDetail template={template} icon={<GlobeAltIcon className={iconSize}/>} text="Website" href={getFullUrl(contact.website)} />}
        </div>

        {/* Summary */}
        {summary && (
          <section className="mb-4">
            <SectionTitleComponent title="Summary" />
            <p className="text-gray-700 text-justify">{linkifyText(summary)}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-4">
            <SectionTitleComponent title="Experience" />
            {experience.map((exp, index) => (
              <div key={index} className={`last:mb-0 ${template === 'modern-compact' ? 'mb-4' : 'mb-3.5'}`}>
                <div className="flex justify-between items-baseline">
                   <h3 className={`font-bold text-primary ${template === 'modern-compact' ? 'text-base mb-1' : 'text-sm mb-0.5'}`}>{exp.role}</h3>
                  <span className={`text-gray-500 font-medium whitespace-nowrap pl-2 ${template === 'modern-compact' ? 'text-sm' : 'text-xs'}`}>{exp.dates}</span>
                </div>
                <p className={`font-semibold italic ${template === 'modern-compact' ? 'text-sm text-gray-600 mb-1.5' : 'text-xs text-secondary mb-0.5'}`}>{exp.company}</p>
                <ul className={`list-disc list-outside ml-3.5 text-gray-700 ${template === 'modern-compact' ? 'space-y-1.5' : 'space-y-1'}`}>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="leading-normal">{linkifyText(resp.trim())}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-4">
            <SectionTitleComponent title="Education" />
            {education.map((edu, index) => (
              <div key={index} className={`last:mb-0 ${template === 'modern-compact' ? 'mb-3' : 'mb-2.5'}`}>
                 <div className="flex justify-between items-baseline">
                  <h3 className={`font-bold text-primary ${template === 'modern-compact' ? 'text-base' : 'text-sm'}`}>{edu.degree}</h3>
                   <span className={`text-gray-500 font-medium whitespace-nowrap pl-2 ${template === 'modern-compact' ? 'text-sm' : 'text-xs'}`}>
                     {edu.details.includes('Present') || edu.details.match(/\d{4}\s*-\s*\d{4}/) || (edu.details.match(/\d{4}/) && !edu.institution.includes(edu.details)) ? '' : edu.details.split('|')[0].trim()}
                   </span>
                </div>
                <p className={`italic ${template === 'modern-compact' ? 'text-sm text-gray-600' : 'text-xs text-secondary'}`}>
                  {edu.institution}
                  {' '}
                  {linkifyText(
                    (edu.details.includes('|') ? 
                    `| ${edu.details.split('|')[1].trim()}` : 
                    (edu.details.includes('Present') || edu.details.match(/\d{4}\s*-\s*\d{4}/) || edu.details.match(/\d{4}/) ? edu.details : '')).trim()
                  )}
                </p>
              </div>
            ))}
          </section>
        )}
        
        {/* Licenses & Certifications */}
        {licensesCertifications && licensesCertifications.length > 0 && (
          <section className="mb-4">
            <SectionTitleComponent title="Licenses & Certifications" />
            {licensesCertifications.map((cert, index) => (
              <div key={index} className={`last:mb-0 ${template === 'modern-compact' ? 'mb-2.5' : 'mb-2'}`}>
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-semibold text-primary ${template === 'modern-compact' ? 'text-base' : 'text-sm'}`}>{linkifyText(cert.name)}</h3>
                  {cert.date && <span className={`text-gray-500 whitespace-nowrap pl-2 ${template === 'modern-compact' ? 'text-sm' : 'text-xs'}`}>{cert.date}</span>}
                </div>
                <p className={`italic ${template === 'modern-compact' ? 'text-sm text-gray-600' : 'text-xs text-secondary'}`}>{linkifyText(cert.issuer)}</p>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className={template === 'modern-compact' ? 'skills-modern' : ''}>
            <SectionTitleComponent title="Skills" />
            {template === 'modern-compact' ? (
              <div className="flex flex-wrap">
                {skills.map((skill, index) => (
                  <span key={index} className="inline-block bg-sky-100 text-accent text-xs font-medium px-2.5 py-1 rounded-full mr-1.5 mb-1.5">
                    {linkifyText(skill.trim())}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 flex flex-wrap">
                {skills.map((skill, index) => (
                  <React.Fragment key={index}>
                    <span>{linkifyText(skill.trim())}</span>
                    {index < skills.length - 1 && <span className="mx-2 text-gray-400">&bull;</span>}
                  </React.Fragment>
                ))}
              </p>
            )}
          </section>
        )}

        {/* Footer - Page Number */}
        <div className={`mt-6 pt-2 text-center text-xs text-gray-400 print:block ${template === 'classic' ? 'border-t border-gray-300' : ''}`}>
          {name.toUpperCase()} - Page 1 of 1
        </div>
      </div> 

       <style>
        {`
          .A4-aspect-ratio-approx {
            width: 100%;
            max-width: 800px; 
            margin-left: auto;
            margin-right: auto;
          }
          
          .font-group-sans-serif {
            font-family: 'Lato', sans-serif;
          }
          .font-group-serif {
            font-family: 'Merriweather', serif;
          }
          .font-group-serif h1, .font-group-serif h2, .font-group-serif h3, .font-group-serif strong {
             font-family: 'Merriweather', serif; 
          }

          .template-modern-compact .modern-contact {
            border-bottom: 1px solid #e2e8f0; /* slate-200 */
          }
          .template-modern-compact p {
            font-size: 9.5pt; 
            line-height: 1.65; 
          }
          .template-modern-compact li { 
            font-size: 9.5pt;
            line-height: 1.65;
          }
          .template-modern-compact.font-group-serif h1,
          .template-modern-compact.font-group-serif h2,
          .template-modern-compact.font-group-serif h3 {
            font-family: 'Merriweather', serif;
          }
           .template-modern-compact.font-group-sans-serif h1,
           .template-modern-compact.font-group-sans-serif h2,
           .template-modern-compact.font-group-sans-serif h3 {
            font-family: 'Lato', sans-serif;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print\\:hidden { display: none !important; } 
            .print\\:block { display: block; }
            .shadow-resume { box-shadow: none; }
            .A4-aspect-ratio-approx { 
              max-width: 100%;
              margin: 0;
              padding: 0; 
            }
            #resume-inner-content-for-pdf {
                width: 100%;
                height: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};
