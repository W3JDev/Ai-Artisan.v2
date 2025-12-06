
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ResumeData, TailoringStrength, JobMatchAnalysis, CoverLetterTone, AtsAuditResult } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not found. Gemini API calls will likely fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// --- MODEL CONFIGURATION ---
// Intelligence & Formatting
const RESUME_MODEL_NAME = "gemini-3-pro-preview"; 
// Speed & Tools (Search)
const FAST_MODEL_NAME = "gemini-2.5-flash"; 
// Image Generation
const IMAGE_MODEL_NAME = "gemini-3-pro-image-preview";


function parseJsonFromText(text: string): any {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; 
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON response after cleaning:", jsonStr, e);
    throw new Error("The AI returned an invalid JSON format. Please try rephrasing your input or try again.");
  }
}

/**
 * Generates a professional headshot using Gemini 3 Pro Image Preview.
 */
export async function generateHeadshot(description: string, imageSize: '1K' | '2K' | '4K' = '1K'): Promise<string> {
  const prompt = `Professional executive headshot, linkedin profile photo style, ${description}, studio lighting, neutral background, high definition, photorealistic, 8k.`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: imageSize
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini.");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw new Error("Failed to generate headshot.");
  }
}

/**
 * Uses Search Grounding to find industry trends.
 */
export async function researchIndustryTrends(jobTitle: string): Promise<string> {
    const prompt = `What are the top 3 current trends, keywords, and critical technologies for a "${jobTitle}" role in 2025? Provide a concise list of keywords that should be on a resume.`;
    
    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL_NAME,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        // Return the text directly (includes grounding)
        return response.text || "Could not retrieve trend data.";
    } catch (error) {
        console.error("Grounding Error:", error);
        return ""; // Fail silently to not block main flow
    }
}

export async function generateResumeFromText(
  rawText: string, 
  jobDescription?: string,
  appliedSuggestionContext?: { originalGap: string; aiSuggestion: string; },
  industryTrends?: string
): Promise<ResumeData> {
  
  const jobDescriptionContext = jobDescription?.trim() 
    ? `
    --- RELEVANT JOB DESCRIPTION (for tailoring resume content and job match analysis) ---
    ${jobDescription}
    --- END JOB DESCRIPTION ---
    ` 
    : "";

  const trendsContext = industryTrends 
    ? `
    --- REAL-TIME INDUSTRY TRENDS (Google Search Grounding) ---
    Use these keywords if relevant to the candidate's experience: ${industryTrends}
    --- END TRENDS ---
    `
    : "";

  let revisionContext = "";
  if (appliedSuggestionContext) {
    revisionContext = `
    --- REVISION CONTEXT ---
    You are revising a previously generated resume based on an AI suggestion.
    The original identified gap was: "${appliedSuggestionContext.originalGap}"
    The AI-generated suggestion to address this gap was: "${appliedSuggestionContext.aiSuggestion}"
    Please regenerate the entire resume, effectively incorporating this suggestion to address the original gap. 
    Ensure the resume remains concise, ATS-friendly, and fits a premium executive layout.
    Critically, re-evaluate and update the 'tailoringKeywords', 'tailoringStrength', and 'jobMatchAnalysis' fields based on this revised version.
    --- END REVISION CONTEXT ---
    `;
  }

  const prompt = `
    You are an elite Executive Career Strategist and ATS Algorithm Expert.
    Your goal is to create a **high-converting, top 1% resume** that is strictly optimized for a **SINGLE PAGE**.

    ${revisionContext ? revisionContext : 'Analyze the following raw resume information provided by the user:'}
    --- RAW RESUME INFORMATION ---
    ${rawText}
    --- END RAW RESUME INFORMATION ---
    ${jobDescriptionContext}
    ${trendsContext}
    
    ### CRITICAL INSTRUCTIONS FOR ATS (APPLICANT TRACKING SYSTEM) COMPLIANCE:
    1.  **Standard Headers:** You MUST use standard section headers in the output data (e.g., "Experience", "Education", "Skills", "Summary"). Do not use creative headers like "My Journey" or "Professional History".
    2.  **Keyword Optimization:** Seamlessly integrate keywords from the provided Job Description into the bullet points.
    3.  **Strict 1-Page Constraint:** Prioritize ruthlessly.
    4.  **Bullet Point Structure:** Every bullet point must follow the **Action + Context + Result (Metric)** structure. Start with a strong power verb.
    5.  **Infer Missing Skills:** If the experience implies a skill (e.g., "Managed project budget" -> "Budgeting & Cost Control"), add it to the Skills array.
    6.  **Headshot Prompt:** Create a prompt for an AI image generator to create a professional headshot.

    Your output MUST be a valid JSON object adhering to the following structure:

    interface ResumeData {
      name: string; 
      jobTitle?: string; 
      contact: ContactInfo; // email, phone, location, linkedin, portfolio
      summary: string; // Max 2-3 lines.
      experience: ExperienceItem[]; // company, role, dates, responsibilities[]
      education: EducationItem[]; // institution, degree, details
      licensesCertifications?: CertificationItem[];
      skills: string[]; // Limit to top 12-15 most relevant hard skills.
      tailoringKeywords?: string[]; 
      tailoringStrength?: 'Excellent' | 'Good' | 'Fair'; 
      jobMatchAnalysis?: JobMatchAnalysis; // matchScore (0-100), strengths[], gaps[]
      suggestedHeadshotPrompt?: string; 
    }

    Output JSON Only. No markdown text outside the JSON block.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: RESUME_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Using thinking budget for the 3.0 Pro model to ensure deep analysis
        thinkingConfig: { thinkingBudget: 4000 }, 
      },
    });
    
    return parseJsonFromText(response.text) as ResumeData;

  } catch (error) {
    console.error("Error generating resume:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid API Key. Please check your API_KEY environment variable.");
    }
    throw new Error(`Failed to generate resume content. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Simulates a strict ATS parse to audit the resume for parseability and keyword density.
 */
export async function runAtsAudit(resumeData: ResumeData, jobDescription: string): Promise<AtsAuditResult> {
  const prompt = `
    ACT AS A STRICT APPLICANT TRACKING SYSTEM (ATS) (e.g., Taleo, Greenhouse).
    
    Analyze the following structured resume data against the target job description.
    Resume JSON: ${JSON.stringify(resumeData)}
    Job Description: ${jobDescription.substring(0, 1000)}...

    Conduct a technical audit:
    1. **Parseability Score:** Rate from 0-100 how easily a machine can extract the core entities (Name, Contact, Role, Skills). 
       - Since the input is JSON, base this on the *content* quality (e.g., are dates in standard formats? are headers standard?).
    2. **Keyword Match:** Identify critical keywords from the JD that are MISSING in the resume.
    3. **Formatting Check:** Identify any potential red flags in the text content (e.g., use of non-standard characters, vague dates).
    4. **Human Review Status:** Based on the score, will this be "Auto-Reject", "Review", or "Priority"?

    Output JSON only:
    {
      "parseabilityScore": number,
      "missingCriticalKeywords": string[],
      "formattingIssues": string[],
      "sectionHeaderStandardization": "Pass" | "Fail",
      "estimatedHumanReviewStatus": "Auto-Reject" | "Review" | "Priority"
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: FAST_MODEL_NAME, // Fast model is sufficient for auditing
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return parseJsonFromText(response.text) as AtsAuditResult;
  } catch (e) {
    console.error("ATS Audit Failed", e);
    throw new Error("Could not complete ATS Audit.");
  }
}

export async function generateCoverLetterStream(resumeData: ResumeData, jobDescription: string, tone: CoverLetterTone) {
  const resumeSummaryForPrompt = `
    Name: ${resumeData.name}
    ${resumeData.jobTitle ? `Title: ${resumeData.jobTitle}` : ''}
    Summary: ${resumeData.summary}
    Skills: ${resumeData.skills.join(', ')}
    Experience Highlights:
    ${resumeData.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.dates})`).slice(0, 3).join('\n')}
  `;

  const toneInstruction = {
    professional: "Confident, competent, and polished.",
    enthusiastic: "Energetic, forward-looking, and eager.",
    formal: "Respectful, traditional, and reserved."
  };

  const prompt = `
    Write a modern, impactful cover letter.
    Candidate: ${resumeSummaryForPrompt}
    Job: ${jobDescription}
    Tone: ${toneInstruction[tone]}
    
    Structure:
    1. Hook: Why I am writing and why I am unique.
    2. The "Meat": Specific proof I can do the job (mapping resume skills to job needs).
    3. Closing: Call to action.
    
    Keep it under 300 words. Return plain text only.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: FAST_MODEL_NAME,
      contents: prompt,
      config: { temperature: 0.7 },
    });
    return response;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error(`Failed to generate cover letter. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getSuggestionForGap(currentResumeData: ResumeData, jobDescription: string, gapDescription: string): Promise<string> {
  const prompt = `
    Gap Analysis Task.
    Resume Context: ${currentResumeData.jobTitle} - ${currentResumeData.skills.slice(0,5).join(', ')}
    Gap: "${gapDescription}"
    Job Requirement: Inferred from gap.
    
    Provide ONE high-impact revision or addition (1-2 sentences) to close this gap. 
    It could be a new bullet point, a skill addition, or a summary tweak.
    Return ONLY the suggestion text.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: FAST_MODEL_NAME,
      contents: prompt,
      config: { temperature: 0.5 },
    });
    return response.text.trim();
  } catch (err: any) {
    throw new Error(`Failed to get suggestion. Details: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function generateInterviewQuestions(resumeData: ResumeData, jobDescription: string): Promise<string[]> {
    const prompt = `
    Generate 5 tough, role-specific interview questions based on:
    Resume: ${resumeData.jobTitle}, Skills: ${resumeData.skills.join(', ')}
    Job: ${jobDescription.substring(0, 500)}...
    
    Output JSON array of strings.
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: FAST_MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.5 },
        });
        return parseJsonFromText(response.text) as string[];
    } catch (error) {
        throw new Error(`Failed to generate questions.`);
    }
}
