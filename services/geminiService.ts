import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ResumeData, TailoringStrength, JobMatchAnalysis, CoverLetterTone } from '../types';

if (!process.env.API_KEY) {
  // This check is mostly for development. In a bundled app, process.env might behave differently.
  // The user is expected to have API_KEY set in their environment.
  console.warn("API_KEY environment variable not found. Gemini API calls will likely fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const RESUME_MODEL_NAME = "gemini-2.5-pro"; // Powerful model for complex analysis and generation with thinking.
const FAST_MODEL_NAME = "gemini-2.5-flash"; // Fast model for suggestions, cover letters, and interview questions.


function parseJsonFromText(text: string): any {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ``` or ``` ... ```
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


export async function generateResumeFromText(
  rawText: string, 
  jobDescription?: string,
  appliedSuggestionContext?: { originalGap: string; aiSuggestion: string; }
): Promise<ResumeData> {
  const jobDescriptionContext = jobDescription?.trim() 
    ? `
    --- RELEVANT JOB DESCRIPTION (for tailoring resume content and job match analysis) ---
    ${jobDescription}
    --- END JOB DESCRIPTION ---
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
    Ensure the resume remains concise, ATS-friendly, and on one page. 
    Critically, re-evaluate and update the 'tailoringKeywords', 'tailoringStrength', and 'jobMatchAnalysis' fields based on this revised version.
    --- END REVISION CONTEXT ---
    `;
  }

  const prompt = `
    You are an expert resume writer, ATS optimization specialist, and career analyst.
    ${revisionContext ? revisionContext : 'Analyze the following raw resume information provided by the user:'}
    --- RAW RESUME INFORMATION ---
    ${rawText}
    --- END RAW RESUME INFORMATION ---
    ${jobDescriptionContext}
    Transform this information into a concise, professional, and ATS-friendly one-page resume.
    The resume MUST be structured to fit on a single standard page. Prioritize the most impactful information.
    Your output MUST be a valid JSON object adhering to the following TypeScript interface structure:

    interface ContactInfo {
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      portfolio?: string;
      website?: string;
    }

    interface ExperienceItem {
      company: string;
      role: string; // Job title
      dates: string; // e.g., "Sep 2024 - Present" or "Jul 2022 - Feb 2024"
      responsibilities: string[]; // Array of concise bullet points (action verb first)
    }

    interface EducationItem {
      institution: string;
      degree: string; // e.g., "BSc (Hons) in Business Administration"
      details: string; // e.g., "2013 - Present" or "Graduated May 2017 | Relevant Honors"
    }

    interface CertificationItem {
      name: string;
      issuer: string;
      date?: string; // e.g., "Issued Aug 2023" or "2023"
    }

    interface JobMatchAnalysis {
      matchScore?: number; // Percentage (0-100) indicating resume alignment with the job description.
      strengths?: string[]; // 2-3 bullet points highlighting key alignments.
      gaps?: string[]; // 2-3 bullet points suggesting areas for improvement or missing elements relevant to the job.
    }

    interface ResumeData {
      name: string; // Full name
      jobTitle?: string; // Professional title, e.g., "Senior Frontend Developer"
      contact: ContactInfo;
      summary: string; // A concise professional summary (2-4 sentences).
      experience: ExperienceItem[]; // Most relevant 2-4 experiences. Summarize responsibilities.
      education: EducationItem[];
      licensesCertifications?: CertificationItem[];
      skills: string[]; // List of key skills.
      tailoringKeywords?: string[]; // If job description was provided, list 5-7 key skills/terms from it that you focused on for tailoring.
      tailoringStrength?: 'Excellent' | 'Good' | 'Fair'; // Your qualitative assessment of how well the resume was tailored to the job description.
      jobMatchAnalysis?: JobMatchAnalysis; // If job description was provided, include this analysis.
    }

    Key instructions for resume generation:
    1.  **Conciseness for One Page:** Aggressively summarize to ensure the entire resume can reasonably fit on a single page. If input is too long, select the most impactful and recent information. For experience, limit to 3-5 bullet points per role.
    2.  **ATS Optimization:** Use common keywords relevant to typical job roles.
    3.  **Professional Tone:** Maintain a formal and professional tone.
    4.  **Action Verbs:** Start bullet points in experience sections with strong action verbs.
    5.  **Quantify Achievements:** Where possible, include quantifiable achievements.
    6.  **Skills:** Extract a diverse list of technical and soft skills.

    Key instructions for Job Description Tailoring & Analysis (if job description is provided):
    1.  **Tailor Resume Content:**
        *   Analyze the job description to identify key skills, technologies, and qualifications. 
        *   Subtly and naturally weave these relevant keywords and concepts into the resume's summary, experience, and skills sections. This tailoring should enhance relevance without making the resume verbose or compromising the one-page limit.
        *   List 5-7 of the MOST IMPORTANT keywords/phrases from the job description used for tailoring in 'tailoringKeywords'.
        *   Based on the extent and quality of this integration, provide a 'tailoringStrength' value:
            *   'Excellent': Most important keywords from the job description are naturally integrated throughout multiple relevant sections.
            *   'Good': A significant number of important keywords are well-integrated in relevant sections.
            *   'Fair': Some key keywords are integrated, but perhaps less extensively or smoothly.
        *   If no job description was provided, or if meaningful tailoring wasn't possible, 'tailoringKeywords' can be omitted or be an empty array, and 'tailoringStrength' can be omitted.
    2.  **Perform Job Match Analysis (Populate 'jobMatchAnalysis'):**
        *   **matchScore:** Provide a numerical score (0-100) representing the overall alignment of the generated resume content with the job description. Higher scores mean better alignment.
        *   **strengths:** List 2-3 key areas where the resume strongly aligns with the job description's requirements. Be specific.
        *   **gaps:** List 2-3 specific areas where the resume could be improved to better match the job description, or identify crucial elements from the job description that are not sufficiently addressed in the resume.
        *   If no job description was provided, 'jobMatchAnalysis' can be omitted.

    **Strict JSON Adherence:** The entire output must be a single, valid JSON object. Do not include any text, explanations, or comments before or after the JSON. Critically, ensure no extraneous text, markers, or non-JSON characters (like the example 'सुर' which was a previous mistake you made and should be avoided) are present anywhere within the JSON structure itself, especially within or between elements of JSON arrays (e.g., in the 'experience' array) or objects. Each element in an array of objects must be a complete and valid JSON object. The response must be parsable by a standard JSON parser without any pre-processing beyond removing optional markdown fences (like \`\`\`json ... \`\`\`).

    Output JSON Only: Ensure the entire response is ONLY the JSON object.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: RESUME_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3, 
        thinkingConfig: { thinkingBudget: 32768 }, // Enable thinking mode for complex resume analysis.
      },
    });
    
    return parseJsonFromText(response.text) as ResumeData;

  } catch (error) {
    console.error("Error generating resume:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid API Key. Please check your API_KEY environment variable.");
    }
    throw new Error(`Failed to generate resume content from AI. Details: ${error instanceof Error ? error.message : String(error)}`);
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
    professional: "Maintain a professional and formal tone throughout.",
    enthusiastic: "Write with an enthusiastic and passionate tone, showing genuine excitement for the role.",
    formal: "Adopt a very formal and respectful business letter tone."
  };

  const prompt = `
    You are an expert career advisor and professional writer.
    Based on the following resume summary:
    --- RESUME SUMMARY ---
    ${resumeSummaryForPrompt}
    --- END RESUME SUMMARY ---

    And the following job description:
    --- JOB DESCRIPTION ---
    ${jobDescription}
    --- END JOB DESCRIPTION ---

    Generate a compelling, professional, and concise cover letter.
    Key instructions:
    1.  **Tone:** ${toneInstruction[tone]}
    2.  Address it generally (e.g., "Dear Hiring Manager,").
    3.  Briefly introduce the candidate and the purpose of the letter.
    4.  Highlight 2-3 key skills or experiences from the resume that are most relevant to the job description.
    5.  Express enthusiasm for the potential opportunity, according to the specified tone.
    6.  Conclude with a call to action (e.g., expressing eagerness for an interview).
    7.  Maintain a standard business letter format.
    8.  The entire output must be only the plain text for the cover letter. Do not include any meta-comments or JSON.
    9.  Keep the cover letter concise, ideally 3-4 paragraphs.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: FAST_MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7, 
      },
    });
    return response;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid API Key. Please check your API_KEY environment variable.");
    }
    throw new Error(`Failed to generate cover letter from AI. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getSuggestionForGap(currentResumeData: ResumeData, jobDescription: string, gapDescription: string): Promise<string> {
  const prompt = `
    You are an AI career assistant. You are reviewing a candidate's resume and a job description.
    A specific gap has been identified between the resume and the job description.

    Current Resume Summary (for context):
    Name: ${currentResumeData.name}
    ${currentResumeData.jobTitle ? `Title: ${currentResumeData.jobTitle}` : ''}
    Summary: ${currentResumeData.summary}
    Skills: ${currentResumeData.skills.join(', ')}
    Experience Highlights:
    ${currentResumeData.experience.map(exp => `- ${exp.role} at ${exp.company}: ${exp.responsibilities.slice(0,1).join(' ')}...`).slice(0, 2).join('\n')}

    Full Job Description:
    --- JOB DESCRIPTION ---
    ${jobDescription}
    --- END JOB DESCRIPTION ---

    Identified Gap:
    "${gapDescription}"

    Your task is to provide ONE concise, actionable suggestion to help the candidate address this specific gap in their resume.
    The suggestion should be practical. For example, it could be:
    - A rephrased bullet point for an existing experience.
    - A specific skill to add or highlight if it's likely the candidate possesses it based on their overall profile.
    - Advice on how to reframe a part of their summary.
    - A suggestion to add a specific type of quantifiable achievement if relevant.

    Focus on how to improve the *existing* resume structure based on the identified gap.
    The suggestion should be brief, ideally 1-2 sentences.
    Return only the plain text suggestion. Do not include any preamble like "Here's a suggestion:".
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: FAST_MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });
    return response.text.trim();
  } catch (err: any) { // Added 'err: any' to correctly define the caught error object
    console.error("Error getting suggestion for gap:", err);
     if (err instanceof Error && err.message.includes("API key not valid")) {
        throw new Error("Invalid API Key for suggestion. Please check your API_KEY environment variable.");
    }
    // Corrected to use 'err' instead of 'error'
    throw new Error(`Failed to get suggestion from AI. Details: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function generateInterviewQuestions(resumeData: ResumeData, jobDescription: string): Promise<string[]> {
    const resumeContext = `
    - Candidate Name: ${resumeData.name}
    - Role applying for: ${resumeData.jobTitle || 'Not specified'}
    - Key Skills: ${resumeData.skills.join(', ')}
    - Summary of Experience: ${resumeData.experience.map(exp => `${exp.role} at ${exp.company}`).join('; ')}
    `;

    const prompt = `
    You are an expert technical recruiter and career coach.
    Based on the provided resume context and job description, generate a list of likely interview questions.

    --- RESUME CONTEXT ---
    ${resumeContext}
    --- END RESUME CONTEXT ---

    --- JOB DESCRIPTION ---
    ${jobDescription}
    --- END JOB DESCRIPTION ---

    Your task is to create a list of 8-10 interview questions that cover:
    1.  **Behavioral Questions:** Probing into past experiences, teamwork, and problem-solving skills mentioned in the resume.
    2.  **Technical/Situational Questions:** Directly related to the key skills and responsibilities listed in the job description and reflected in the candidate's skills.
    3.  **Resume-Specific Questions:** Asking for more detail on specific projects or roles mentioned in the resume summary.

    Your output MUST be a valid JSON array of strings. Each string in the array should be a single interview question.
    Example format:
    [
        "Can you tell me about a challenging project you worked on at [Previous Company]?",
        "How would you approach designing a system that does X, given your experience with Y technology?",
        "Describe a time you had a conflict with a team member and how you resolved it."
    ]

    Output JSON Only: Ensure the entire response is ONLY the JSON array.
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: FAST_MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.5,
            },
        });
        
        const parsed = parseJsonFromText(response.text);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
            return parsed as string[];
        }
        throw new Error("AI returned data in an unexpected format.");

    } catch (error) {
        console.error("Error generating interview questions:", error);
        if (error instanceof Error && error.message.includes("API key not valid")) {
            throw new Error("Invalid API Key. Please check your API_KEY environment variable.");
        }
        throw new Error(`Failed to generate interview questions from AI. Details: ${error instanceof Error ? error.message : String(error)}`);
    }
}
