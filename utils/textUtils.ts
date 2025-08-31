
import React from 'react';
import type { ResumeData } from '../types';

// Enhanced URL regex:
// - Matches http, https, ftp, file protocols
// - Matches www. domains (and assumes http if no protocol)
// - Handles various URL characters including query params and fragments
// - Avoids matching email addresses by negative lookahead for @
const urlRegex = /(\b(?:(?:https?|ftp|file):\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?!@)/ig;

export const linkifyText = (text: string): React.ReactNode[] => {
  if (!text) return [text];

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const startIndex = match.index;

    // Add text part before the URL
    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }

    // Add the link
    let href = url;
    if (url.startsWith('www.')) {
      href = `http://${url}`; // Assume http for www links without protocol
    }
    
    parts.push(
      React.createElement('a', {
        href: href,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-accent hover:underline",
        key: `link-${keyCounter++}`
      }, url)
    );
    lastIndex = startIndex + url.length;
  }

  // Add remaining text part
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  // If no URLs found, return the original text in an array
  if (parts.length === 0 && text) {
      return [text];
  }

  return parts;
};

export function formatResumeDataAsText(data: ResumeData): string {
  let text = '';

  text += `${data.name.toUpperCase()}\n`;
  if (data.jobTitle) {
    text += `${data.jobTitle}\n`;
  }
  text += '\n'; 

  // Contact Info
  if (data.contact) {
    let contactDetails = '';
    if (data.contact.email) contactDetails += `Email: ${data.contact.email}\n`;
    if (data.contact.phone) contactDetails += `Phone: ${data.contact.phone}\n`;
    if (data.contact.location) contactDetails += `Location: ${data.contact.location}\n`;
    if (data.contact.linkedin) contactDetails += `LinkedIn: ${data.contact.linkedin}\n`;
    if (data.contact.portfolio) contactDetails += `Portfolio: ${data.contact.portfolio}\n`;
    if (data.contact.website && !data.contact.portfolio) contactDetails += `Website: ${data.contact.website}\n`; // Avoid duplicate if portfolio is also a website
    
    if(contactDetails) {
        text += 'CONTACT\n';
        text += contactDetails;
        text += '\n';
    }
  }
  

  // Summary
  if (data.summary) {
    text += 'SUMMARY\n';
    text += `${data.summary}\n\n`;
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    text += 'EXPERIENCE\n';
    data.experience.forEach(exp => {
      text += `${exp.role.toUpperCase()} | ${exp.company}\n`;
      text += `${exp.dates}\n`;
      exp.responsibilities.forEach(resp => {
        text += `- ${resp}\n`;
      });
      text += '\n';
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    text += 'EDUCATION\n';
    data.education.forEach(edu => {
      text += `${edu.degree} | ${edu.institution}\n`;
      text += `${edu.details}\n\n`;
    });
  }

  // Licenses & Certifications
  if (data.licensesCertifications && data.licensesCertifications.length > 0) {
    text += 'LICENSES & CERTIFICATIONS\n';
    data.licensesCertifications.forEach(cert => {
      text += `${cert.name} | ${cert.issuer}\n`;
      if (cert.date) text += `Date: ${cert.date}\n`;
      text += '\n';
    });
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    text += 'SKILLS\n';
    text += data.skills.join(' • ') + '\n';
  }

  return text.trim();
}
