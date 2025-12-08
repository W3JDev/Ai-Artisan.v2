
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ResumeData, TailoringStrength, JobMatchAnalysis, CoverLetterTone, AtsAuditResult, TargetRegion } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not found. Gemini API calls will likely fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// --- MODEL CONFIGURATION ---
const RESUME_MODEL_NAME = "gemini-3-pro-preview"; 
const FAST_MODEL_NAME = "gemini-2.5-flash"; 
const IMAGE_MODEL_NAME = "gemini-3-pro-image-preview";
const VIDEO_MODEL_NAME = "veo-3.1-fast-generate-preview";


function parseJsonFromText(text: string): any {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; 
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsed = JSON.parse(jsonStr);
    
    // Robustness: Ensure 'skills' is an array. AI sometimes returns a string "Skill1, Skill2".
    if (parsed.skills) {
        if (typeof parsed.skills === 'string') {
            parsed.skills = parsed.skills.split(/,\s*/).filter(Boolean);
        } else if (!Array.isArray(parsed.skills)) {
            parsed.skills = []; // Fallback for unknown types
        }
    } else {
        parsed.skills = [];
    }

    // Ensure other critical arrays exist
    if (!parsed.experience || !Array.isArray(parsed.experience)) parsed.experience = [];
    if (!parsed.education || !Array.isArray(parsed.education)) parsed.education = [];

    return parsed;
  } catch (e) {
    console.error("Failed to parse JSON response after cleaning:", jsonStr, e);
    throw new Error("The AI returned an invalid JSON format. Please try rephrasing your input or try again.");
  }
}

export async function generateHeadshot(description: string, imageSize: '1K' | '2K' | '4K' = '1K'): Promise<string> {
  const prompt = `Professional executive headshot, linkedin profile photo style, ${description}, studio lighting, neutral background, high definition, photorealistic, 8k.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: imageSize } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned from Gemini.");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw new Error("Failed to generate headshot.");
  }
}

export async function generateBrandVideo(prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> {
  try {
    let operation = await ai.models.generateVideos({
      model: VIDEO_MODEL_NAME,
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Poll until completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s poll interval
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned from Veo.");

    // Append API key for client-side playback/download
    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error) {
    console.error("Video Gen Error:", error);
    throw new Error("Failed to generate brand video.");
  }
}

export async function researchIndustryTrends(jobTitle: string): Promise<string> {
    const prompt = `
    Using Google Search, find the top 3 current trends, 5 critical keywords, and 3 must-have technologies for a "${jobTitle}" role in 2025. 
    Output strictly in this format:
    🔥 TRENDS: [List]
    🔑 KEYWORDS: [List]
    💻 TECH STACK: [List]
    `;
    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL_NAME,
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
        return response.text || "Could not retrieve trend data.";
    } catch (error) {
        console.error("Grounding Error:", error);
        return ""; 
    }
}

export async function analyzeUploadedDocument(base64Data: string, mimeType: string): Promise<ResumeData> {
  // More robust base64 stripping
  const data = base64Data.includes('base64,') 
    ? base64Data.split('base64,')[1] 
    : base64Data;

  const prompt = `
    You are an elite Executive Career Strategist. The user has uploaded an existing resume (PDF).
    
    YOUR GOAL: REDESIGN FOR A STRICT ONE-PAGE LIMIT.
    
    1. **Extract & Audit**: Read the document, carefully parsing complex layouts, columns, and sidebars. Identify fluff, passive voice, and weak points.
    2. **Rewrite for Impact**: Convert responsibilities to quantitative achievements (e.g., "Managed team" -> "Led 15-person team to 20% growth").
    3. **Condense**: Aggressively summarize older roles. Focus on the last 5-7 years.
    4. **Structure**: Fit content into a dense, high-impact Executive Summary, Experience, Education, and Skills.
    
    Output structured JSON matching 'ResumeData'.
    Return ONLY valid JSON.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: RESUME_MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 },
      },
    });
    return parseJsonFromText(response.text) as ResumeData;
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw new Error("Failed to analyze document. Ensure it is a valid PDF and the API key is correct.");
  }
}

export async function analyzeUploadedImage(base64Data: string, mimeType: string): Promise<ResumeData> {
  const data = base64Data.includes('base64,') 
    ? base64Data.split('base64,')[1] 
    : base64Data;

  const prompt = `
    You are an elite Executive Career Strategist. The user has uploaded an image/photo of a resume (OCR Task).
    
    YOUR GOAL: EXTRACT ALL TEXT VIA VISUAL ANALYSIS AND REDESIGN FOR A STRICT ONE-PAGE LIMIT.
    
    1. **Visual Analysis (OCR)**: Scan the image layout. Handle columns, headers, and complex formatting. Extract all text accurately.
    2. **Interpret**: Infer hierarchy (Job Titles vs Company Names) based on visual cues (bolding, font size) if raw text is unstructured.
    3. **Rewrite for Impact**: Convert extracted content into high-impact bullet points.
    4. **Structure**: Organize into structured JSON matching 'ResumeData'.
    
    Output structured JSON matching 'ResumeData'.
    Return ONLY valid JSON.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: RESUME_MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 },
      },
    });
    return parseJsonFromText(response.text) as ResumeData;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze resume image. Ensure the text is legible.");
  }
}

export async function analyzeImportedResumeText(text: string): Promise<ResumeData> {
  const prompt = `
    You are an elite Executive Career Strategist. The user has uploaded an existing resume (converted from DOCX/Text).
    
    YOUR GOAL: REDESIGN FOR A STRICT ONE-PAGE LIMIT.
    
    1. **Analyze**: Read the resume text below.
    2. **Rewrite & Condense**: Rewrite bullet points to be high-impact and concise. Remove widow lines. Combine related points.
    3. **Prioritize**: Focus heavily on recent roles. Summarize older roles into 1-2 lines or remove if irrelevant.
    4. **ATS Optimization**: Ensure keywords are present but integrated naturally.
    
    RESUME TEXT:
    ${text}
    
    Output structured JSON matching 'ResumeData'.
    Return ONLY valid JSON.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: RESUME_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 },
      },
    });
    return parseJsonFromText(response.text) as ResumeData;
  } catch (error) {
    console.error("Error analyzing imported text:", error);
    throw new Error("Failed to analyze imported text.");
  }
}

export async function analyzeResumeFromLink(url: string): Promise<ResumeData> {
  const prompt = `
    Go to: ${url}
    Scrape the profile. Rewrite it into a Top 1% One-Page Resume.
    Output JSON matching 'ResumeData'.
  `;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: RESUME_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }], 
        thinkingConfig: { thinkingBudget: 4000 },
      },
    });
    return parseJsonFromText(response.text) as ResumeData;
  } catch (error) {
    console.error("Error analyzing link:", error);
    throw new Error("Failed to extract data from link.");
  }
}

export async function performDeepMatchAnalysis(resumeData: ResumeData, jobDescription: string): Promise<JobMatchAnalysis> {
  const prompt = `
    Conduct a deep-dive "Gap Analysis" of the resume vs the Job Description.
    Identify semantic keywords missing in the resume.
    Return JSON: { "matchScore": number, "strengths": string[], "gaps": string[] }
    Resume: ${JSON.stringify(resumeData).substring(0, 3000)}
    JD: ${jobDescription.substring(0, 2000)}
  `;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: RESUME_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });
    return parseJsonFromText(response.text) as JobMatchAnalysis;
  } catch (error) {
    throw new Error("Failed to perform deep match analysis.");
  }
}

export async function generateResumeFromText(
  rawText: string, 
  jobDescription?: string,
  appliedSuggestionContext?: { originalGap: string; aiSuggestion: string; },
  industryTrends?: string,
  targetRegion: TargetRegion = 'US_CANADA'
): Promise<ResumeData> {
  
  let revisionContext = "";
  if (appliedSuggestionContext) {
    revisionContext = `REVISION TASK: Incorporate this suggestion to fix a gap: "${appliedSuggestionContext.aiSuggestion}" for gap "${appliedSuggestionContext.originalGap}". Update the whole resume JSON.`;
  }

  const prompt = `
    Role: Executive Career Strategist.
    Goal: Create a HIGH-CONVERTING, ONE-PAGE RESUME.
    Region: ${targetRegion}
    
    Context:
    ${revisionContext}
    Raw Info: ${rawText}
    Target JD: ${jobDescription || "None"}
    Trends: ${industryTrends || "None"}
    
    Instructions:
    1. Structure strictly for A4 One-Page.
    2. Use strong action verbs.
    3. Quantify results.
    4. Infer missing skills.
    
    Output JSON (ResumeData interface).
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: RESUME_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 }, 
      },
    });
    return parseJsonFromText(response.text) as ResumeData;
  } catch (error) {
    console.error("Error generating resume:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid API Key.");
    }
    throw new Error(`Failed to generate resume content.`);
  }
}

export async function runAtsAudit(resumeData: ResumeData, jobDescription: string): Promise<AtsAuditResult> {
  const prompt = `
    Act as an ATS (Taleo). Audit this resume JSON against this JD.
    Resume: ${JSON.stringify(resumeData)}
    JD: ${jobDescription.substring(0, 1000)}
    Output JSON: { "parseabilityScore": number, "missingCriticalKeywords": string[], "formattingIssues": string[], "sectionHeaderStandardization": "Pass"|"Fail", "estimatedHumanReviewStatus": "Auto-Reject"|"Review"|"Priority" }
  `;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: FAST_MODEL_NAME, 
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return parseJsonFromText(response.text) as AtsAuditResult;
  } catch (e) {
    throw new Error("ATS Audit Failed.");
  }
}

export async function generateCoverLetterStream(resumeData: ResumeData, jobDescription: string, tone: CoverLetterTone) {
  const prompt = `Write a ${tone} cover letter for ${resumeData.name} applying to ${jobDescription}. Match skills. <300 words.`;
  try {
    const response = await ai.models.generateContentStream({
      model: FAST_MODEL_NAME,
      contents: prompt,
      config: { temperature: 0.7 },
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to generate cover letter.`);
  }
}

export async function getSuggestionForGap(currentResumeData: ResumeData, jobDescription: string, gapDescription: string): Promise<string> {
  const prompt = `Suggest a 1-sentence resume revision to fix gap: "${gapDescription}".`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: FAST_MODEL_NAME,
      contents: prompt,
      config: { temperature: 0.5 },
    });
    return response.text.trim();
  } catch (err: any) {
    throw new Error(`Failed to get suggestion.`);
  }
}

export async function generateInterviewQuestions(resumeData: ResumeData, jobDescription: string): Promise<string[]> {
    const prompt = `Generate 5 interview questions for this candidate. Output JSON array of strings.`;
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
