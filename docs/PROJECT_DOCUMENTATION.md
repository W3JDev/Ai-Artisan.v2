
# AI Resume Artisan - Detailed Project Documentation

**Version:** 1.0
**Date:** [Current Date]

## 1. Project Overview

*   **Project Name:** AI Resume Artisan
*   **Purpose:** An intelligent web application designed to empower job seekers by transforming raw resume text and optional job descriptions into polished, ATS-friendly, one-page resumes and compelling, tailored cover letters.
*   **Core Value Proposition:** AI Resume Artisan leverages the advanced capabilities of Google's Gemini API to provide not just document generation but also insightful analysis (tailoring insights, job match scores, strengths, and gaps) and actionable AI-driven suggestions to optimize application materials for specific job roles.

## 2. Technology Overview

### 2.1. Frontend

*   **Framework/Library:** React (v19) with TypeScript for robust type-safety and component-based architecture.
*   **Styling:** Tailwind CSS, configured directly within `index.html` via a `<script>` tag for rapid UI development and utility-first styling. Customizations include specific fonts (`Lato`, `Merriweather`) and a defined color palette.
*   **State Management:** Primarily uses React Hooks (`useState`, `useCallback`) for managing component and application-level state.
*   **Module System:** Utilizes native ES Modules, with dependencies managed via import maps defined in `index.html`. This allows for direct import of libraries like React, `@google/genai`, `jspdf`, and `html2canvas` from ESM-compatible CDNs (esm.sh).
*   **Rendering:** Client-side rendering, with the React application mounted to the `#root` div in `index.html`.

### 2.2. AI Services & Backend Logic

*   **AI Provider:** Google Gemini API.
*   **SDK:** `@google/genai` (specifically version `^1.4.0` as per import map). This SDK is used for all interactions with the Gemini models.
*   **Gemini Models Used:**
    *   `gemini-2.5-flash-preview-04-17`: This model is utilized for:
        *   Parsing raw text and generating structured resume data (`ResumeData` JSON).
        *   Analyzing job descriptions to tailor resume content.
        *   Providing `tailoringKeywords` and `tailoringStrength`.
        *   Conducting `jobMatchAnalysis` (score, strengths, gaps).
        *   Generating suggestions to address identified resume gaps (`getSuggestionForGap`).
        *   Generating cover letter content (`generateCoverLetter`).
*   **API Key Management:** The Google Gemini API key is **strictly** sourced from the environment variable `process.env.API_KEY`. The application code (`services/geminiService.ts`) directly uses this variable to initialize the `GoogleGenAI` client. **There is no UI or mechanism within the application for users to input or manage the API key.**

### 2.3. PDF Generation

*   **Libraries:**
    *   `jspdf` (v2.5.1): Used for creating PDF documents from scratch (for cover letters) and for structuring the PDF generated from the resume canvas.
    *   `html2canvas` (v1.4.1): Used to capture the rendered HTML of the resume preview (`#resume-inner-content-for-pdf` div) as a canvas image, which is then embedded into a PDF using `jspdf`.

### 2.4. Interaction Flow Summary

1.  User interacts with the React frontend, inputting resume details, job descriptions, and selecting style preferences.
2.  On actions like "Generate Resume" or "Get Suggestion," frontend components (`App.tsx`) call asynchronous functions in `services/geminiService.ts`.
3.  `services/geminiService.ts` constructs specific prompts and sends requests to the Google Gemini API using the `@google/genai` SDK.
4.  The Gemini API processes the prompt and returns a response (JSON for resume data, plain text for cover letters and suggestions).
5.  `services/geminiService.ts` parses the API response. For JSON, it includes a step to clean potential markdown fences (e.g., \`\`\`json ... \`\`\`) before parsing.
6.  The parsed data or text is returned to `App.tsx`, which updates the application state.
7.  React re-renders the UI to display the generated content, insights, or error messages.
8.  For PDF downloads, `utils/downloadUtils.ts` uses `html2canvas` (for resume) and `jspdf` to create and trigger the download of PDF files.

## 3. AI Integration Details

The core intelligence of AI Resume Artisan stems from its interaction with the Google Gemini API, orchestrated by `services/geminiService.ts`.

### 3.1. Resume Generation (`generateResumeFromText`)

*   **Prompt Engineering:**
    *   The AI is instructed to act as an "expert resume writer, ATS optimization specialist, and career analyst."
    *   A detailed TypeScript interface for `ResumeData` is embedded in the prompt to enforce a structured JSON output. This interface includes fields for personal details, summary, experience, education, skills, and critically, fields for AI-driven analysis like `tailoringKeywords`, `tailoringStrength`, and `jobMatchAnalysis`.
    *   The prompt emphasizes conciseness (one-page limit), ATS-friendliness, professional tone, use of action verbs, and quantification of achievements.
*   **Inputs:**
    *   `rawText`: Unstructured resume information from the user.
    *   `jobDescription` (optional): If provided, it's included in the prompt for tailoring and analysis.
    *   `appliedSuggestionContext` (optional): If the user applies an AI-generated gap suggestion, this context (original gap, AI suggestion) is included in the prompt to guide the AI in revising the resume and updating the analysis fields accordingly.
*   **AI Tasks & Output:**
    *   The AI parses the `rawText`, structures it into the `ResumeData` JSON format.
    *   If `jobDescription` is present:
        *   **Content Tailoring:** Weaves relevant keywords from the job description into the resume.
        *   **`tailoringKeywords`:** Identifies and lists 5-7 key terms/skills from the job description that it prioritized.
        *   **`tailoringStrength`:** Provides a qualitative assessment ('Excellent', 'Good', 'Fair') of tailoring quality.
        *   **`jobMatchAnalysis`:**
            *   `matchScore`: A numerical score (0-100) of resume-to-job-description alignment.
            *   `strengths`: 2-3 bullet points on strong alignment areas.
            *   `gaps`: 2-3 bullet points on areas needing improvement or missing elements.
    *   The function uses `responseMimeType: "application/json"` in the API call and includes a `parseJsonFromText` utility to handle potential markdown code fences around the JSON output from the AI.
    *   A `temperature` of `0.3` is used to encourage more deterministic and factual output for resume data.

### 3.2. Cover Letter Generation (`generateCoverLetter`)

*   **Prompt Engineering:**
    *   The AI is instructed to act as an "expert career advisor and professional writer."
    *   The prompt includes a summary of the generated resume (`resumeData.name`, `jobTitle`, `summary`, `skills`, top experience) and the full `jobDescription` (if provided).
    *   Instructions guide the AI to write a concise (3-4 paragraphs), professional cover letter, highlighting 2-3 relevant skills/experiences, expressing enthusiasm, and including a call to action.
*   **Input:** `ResumeData` object, optional `jobDescription` string.
*   **Output:** Plain text string representing the cover letter.
*   A `temperature` of `0.7` is used to allow for more creativity in writing style while maintaining professionalism.

### 3.3. Gap Suggestion Generation (`getSuggestionForGap`)

*   **Prompt Engineering:**
    *   The AI acts as an "AI career assistant" reviewing the resume against a job description for a specific identified gap.
    *   Context provided includes a summary of the current resume, the full job description, and the specific `gapDescription` text.
    *   The AI is asked for ONE concise, actionable suggestion (1-2 sentences) to address the specific gap, focusing on practical improvements to the existing resume structure.
*   **Input:** `currentResumeData` (ResumeData object), `jobDescription` (string), `gapDescription` (string).
*   **Output:** Plain text string containing the AI's suggestion.
*   A `temperature` of `0.5` is used for a balance between focused advice and slight creativity.

### 3.4. API Error Handling

*   The `services/geminiService.ts` functions include `try...catch` blocks to handle errors during API calls.
*   Specific checks for API key validity (e.g., if error message includes "API key not valid") are present to provide more user-friendly error messages.
*   Errors related to JSON parsing are also caught and reported.

## 4. Capabilities & Features (Functional Breakdown)

### 4.1. User Inputs (`ResumeInput.tsx`)

*   **Raw Resume Details Textarea:** Accepts multi-line text for existing resume content, notes, LinkedIn profile data, etc. Includes an 'X' button to clear content.
*   **Job Description Textarea:** Optional input for the target job description to enable advanced tailoring and analysis. Includes an 'X' button to clear content.
*   **Resume Template Selector:** Dropdown to choose between 'Classic' and 'Modern Compact' visual styles for the resume.
*   **Font Style Selector:** Dropdown to choose between 'Sans-Serif (Lato)' and 'Serif (Merriweather)' font families.

### 4.2. Core Generation & Control Buttons (`ResumeInput.tsx`, `App.tsx`)

*   **"Generate Resume" Button:**
    *   Enabled when raw resume text is present.
    *   Triggers `handleGenerateResume` in `App.tsx`.
    *   Initiates API call to `generateResumeFromText`.
    *   Sets loading state, clears previous errors and outputs (unless applying a suggestion).
*   **"Generate Cover Letter" Button:**
    *   Enabled after a resume has been successfully generated.
    *   Triggers `handleGenerateCoverLetter` in `App.tsx`.
    *   Requires job description to be present.
    *   Initiates API call to `generateCoverLetter`.
    *   Sets loading state.

### 4.3. Resume Output & Display (`ResumePreview.tsx`)

*   **Dynamic Rendering:** The component renders the resume based on the `ResumeData` object received from the AI and the user-selected `template` and `fontGroup`.
*   **Structured Sections:** Displays standard resume sections: Name & Job Title, Contact Info, Summary, Experience, Education, Licenses & Certifications, and Skills.
*   **Styling & Templating:**
    *   CSS classes adapt the visual presentation for 'Classic' and 'Modern Compact' templates.
    *   Font styles are applied based on `fontGroup`.
    *   Layout designed for an A4-approximated aspect ratio.
*   **Interactive Links:** URLs within resume content (summary, responsibilities, etc.) are automatically converted to clickable links using `linkifyText` utility.
*   **PDF Download Button:**
    *   Triggers `handleDownload` which calls `downloadResumeAsPdf` utility.
    *   Uses `html2canvas` to capture the `#resume-inner-content-for-pdf` div as an image.
    *   Embeds this image into a PDF generated by `jspdf`.
*   **Copy to Clipboard Button:**
    *   Triggers `handleCopyToClipboard`.
    *   Uses `formatResumeDataAsText` utility to convert the structured `ResumeData` into a formatted plain text string.
    *   Copies this string to the user's clipboard using `navigator.clipboard.writeText`.
    *   Provides visual feedback (icon change) on successful copy.

### 4.4. Cover Letter Output & Display (`CoverLetterPreview.tsx`)

*   **Text Display:** Renders the plain text cover letter received from the AI within a `<pre>` tag to preserve formatting.
*   **PDF Download Button:**
    *   Triggers `handleDownload` which calls `downloadCoverLetterAsPdf` utility.
    *   `jspdf` is used to directly draw the text into a PDF, handling line splitting and pagination.

### 4.5. AI-Driven Feedback & Iteration (UI in `App.tsx`)

This is a key differentiator, providing users with actionable insights. These sections appear only if a job description was used for resume generation.

*   **AI Tailoring Insights Section:**
    *   **Overall Tailoring Fit:** Displays the `tailoringStrength` (e.g., 'Excellent', 'Good', 'Fair') from `ResumeData` with color-coded text (green, sky, yellow).
    *   **Prioritized Key Terms:** Lists the `tailoringKeywords` (from `ResumeData`) as styled badges.
*   **Job Match Analysis Section:**
    *   **Job Alignment Score:** Displays the `matchScore` (from `ResumeData.jobMatchAnalysis`) as a percentage and a color-coded progress bar (green, sky, yellow, red).
    *   **Alignment Strengths:** Lists strengths identified by the AI.
    *   **Potential Gaps / Improvements:**
        *   Lists gaps identified by the AI.
        *   Each gap has a **Lightbulb Icon**. Clicking it triggers `handleGapClick(gapText, index)`:
            *   Sets loading state for the specific gap suggestion.
            *   Calls `getSuggestionForGap` in `services/geminiService.ts`.
            *   Displays the AI's textual suggestion, a loading spinner, or an error message in a dedicated area below the gaps list.
        *   **"Apply Suggestion" Button:** Appears with a successful suggestion. Triggers `handleApplySuggestion`, which then calls `handleGenerateResume` with the `originalGap` and `aiSuggestion` as context. This re-generates the entire resume, aiming to incorporate the fix.
        *   **"Dismiss" Button:** Allows users to hide the current suggestion/error for a gap.

### 4.6. Application State Management (`App.tsx`)

*   Manages all critical state variables including: `rawText`, `jobDescription`, `resumeData`, `coverLetter`, loading states (`isLoadingResume`, `isLoadingCoverLetter`, `isLoadingGapSuggestion`), `error`, `selectedTemplate`, `selectedFontGroup`, and states related to gap suggestions (`selectedGap`, `gapSuggestion`, `gapSuggestionError`).
*   `useCallback` is used for memoizing handler functions to optimize performance and prevent unnecessary re-renders of child components.

### 4.7. Loading and Error States

*   Visual feedback (e.g., `<LoadingSpinner />` component, disabled buttons, "Crafting...", "Writing..." text) is provided during API calls.
*   Error messages from API calls or input validation are displayed in a noticeable (e.g., red-colored) section.

### 4.8. Responsiveness & Accessibility

*   **Responsiveness:** The UI is built with Tailwind CSS, ensuring it adapts to various screen sizes (desktop, tablet, mobile).
*   **Accessibility (Basic):** ARIA attributes like `aria-label` are used on interactive elements (buttons, icons). `htmlFor` is used on labels. Focus styles are present. Further detailed accessibility audit could identify areas for enhancement.

## 5. Tech Stack (Summary)

*   **Frontend:** React (v19), TypeScript, Tailwind CSS
*   **AI Engine:** Google Gemini API (Model: `gemini-2.5-flash-preview-04-17`)
*   **AI SDK:** `@google/genai` (v1.4.0)
*   **PDF Generation:** `jspdf` (v2.5.1), `html2canvas` (v1.4.1)
*   **Development Environment:** Assumes Node.js/npm (for type checking, linting, local dev servers if used), relies on `process.env.API_KEY` being set for API access. Deployed as static assets with ES Module imports from CDNs.

## 6. SDKs Used

*   **`@google/genai` (v1.4.0):** The primary SDK for all communications with the Google Gemini API. Used for:
    *   Initializing the `GoogleGenAI` client.
    *   Calling `ai.models.generateContent()` for resume, cover letter, and suggestion generation.
*   **`jspdf` (v2.5.1):** A client-side JavaScript PDF generation library. Used for:
    *   Creating new PDF documents.
    *   Adding text (cover letters) with line wrapping and pagination.
    *   Adding images (canvas from `html2canvas` for resumes) to PDFs.
    *   Setting document properties and saving PDFs.
*   **`html2canvas` (v1.4.1):** A JavaScript library to take "screenshots" of web pages or parts of it, directly on the users browser. Used for:
    *   Converting the HTML/CSS rendered `ResumePreview` component into a canvas element.
    *   Providing this canvas as an image source to `jspdf` for resume PDF generation.

## 7. Wireframe Concepts & User Flow (Descriptive)

The application primarily operates on a single-page interface with dynamic sections.

### 7.1. Main View Layout

*   **Global Header:** "AI Resume Artisan" title and a brief tagline.
*   **Two-Column Layout (Desktop):**
    *   **Left Column (Input & Controls Panel):**
        1.  **Resume Input Block (`ResumeInput.tsx`):**
            *   Textarea for "Paste Your Resume Details."
            *   Textarea for "Job Description."
            *   Dropdown for "Resume Template."
            *   Dropdown for "Font Style."
            *   "Generate Resume" button.
            *   "Generate Cover Letter" button (becomes active after resume generation).
        2.  **AI Tailoring Insights Block (Conditional):** Appears below the input block after a resume is generated *using a job description*. Displays "Overall Tailoring Fit" and "Prioritized Key Terms."
        3.  **Job Match Analysis Block (Conditional):** Appears below Tailoring Insights if applicable. Displays "Job Alignment Score," "Alignment Strengths," and "Potential Gaps / Improvements."
            *   Each "gap" item is interactive, allowing users to click a lightbulb icon to fetch an AI suggestion.
            *   The suggestion, loading state, or error for the selected gap appears within this block. Includes "Apply Suggestion" and "Dismiss" buttons.
    *   **Right Column (Output Previews & Footer):**
        1.  **Generated Resume Preview Block (`ResumePreview.tsx` - Conditional):** Appears/updates after successful resume generation. Displays the formatted resume. Contains "Copy to Clipboard" and "Download PDF" icon buttons.
        2.  **Generated Cover Letter Preview Block (`CoverLetterPreview.tsx` - Conditional):** Appears/updates after successful cover letter generation. Displays the letter text. Contains a "Download PDF" icon button.
        3.  **Footer:** Contains attribution/link.
*   **Single-Column Layout (Mobile):** The above sections stack vertically.

### 7.2. Core User Workflow (Resume Generation & Refinement with Job Description)

1.  **Input:** User pastes their resume details into the first textarea. User pastes a job description into the second textarea. User selects desired template and font style.
2.  **Generate Resume:** User clicks "Generate Resume."
    *   UI shows loading state (spinner, button text changes).
3.  **Display Resume & Analysis:**
    *   Resume preview appears in the right column.
    *   "AI Tailoring Insights" and "Job Match Analysis" sections populate in the left column.
4.  **Review Gaps:** User reviews "Potential Gaps / Improvements."
5.  **Get Suggestion:** User clicks the lightbulb icon next to a specific gap.
    *   UI shows loading state for the suggestion.
6.  **Display Suggestion:** The AI-generated suggestion (or an error) appears below the gap list. "Apply Suggestion" and "Dismiss" buttons become active.
7.  **Apply Suggestion:** User clicks "Apply Suggestion."
    *   UI shows loading state for resume regeneration. `handleGenerateResume` is called with the suggestion context.
8.  **Display Revised Resume:** The resume preview, tailoring insights, and job match analysis are updated based on the AI's revision. The suggestion UI for the applied gap is cleared.
9.  **Generate Cover Letter:** User clicks "Generate Cover Letter" (now enabled, and job description is present).
    *   UI shows loading state.
10. **Display Cover Letter:** Cover letter preview appears in the right column.
11. **Download/Copy:** User uses icon buttons on previews to download PDFs or copy resume text.

## 8. Code Structure & Key Modules

*   **`index.html`:** Entry point. Sets up Tailwind CSS, Google Fonts, and ES Module import maps. Contains the `<div id="root"></div>` for React.
*   **`index.tsx`:** Initializes and mounts the main React `<App />` component into the DOM.
*   **`App.tsx`:** The main application component.
    *   Manages primary application state (inputs, outputs, selections, loading flags, errors).
    *   Defines callback handlers for generating resume/cover letter and handling gap suggestions.
    *   Orchestrates the display of different UI sections based on application state.
*   **`components/`:** Directory for React UI components.
    *   **`ResumeInput.tsx`:** Form for resume/job description text, template/font selectors, and generation buttons.
    *   **`ResumePreview.tsx`:** Displays the formatted resume. Handles its PDF download and copy-to-clipboard functionality. Contains logic for template-specific rendering and styles.
    *   **`CoverLetterPreview.tsx`:** Displays the generated cover letter. Handles its PDF download.
    *   **`LoadingSpinner.tsx`:** A reusable SVG loading animation.
    *   **`icons.tsx`:** A collection of SVG icon components used throughout the UI.
*   **`services/geminiService.ts`:**
    *   The bridge to the Google Gemini API.
    *   Contains all prompt engineering logic for `generateResumeFromText`, `generateCoverLetter`, and `getSuggestionForGap`.
    *   Initializes the `GoogleGenAI` client with the API key from `process.env.API_KEY`.
    *   Includes `parseJsonFromText` helper to clean and parse JSON responses.
    *   Handles API errors and throws them for the UI to catch.
*   **`types.ts`:** Contains all TypeScript type definitions and interfaces (e.g., `ResumeData`, `TemplateName`, `JobMatchAnalysis`, component prop types) ensuring type safety across the application.
*   **`utils/`:** Directory for utility functions.
    *   **`downloadUtils.ts`:**
        *   `downloadResumeAsPdf()`: Uses `html2canvas` and `jspdf` for resume PDF generation.
        *   `downloadCoverLetterAsPdf()`: Uses `jspdf` for cover letter PDF generation.
    *   **`textUtils.ts`:**
        *   `linkifyText()`: Converts URLs in strings into clickable `<a>` tags (React elements).
        *   `formatResumeDataAsText()`: Converts the structured `ResumeData` object into a formatted plain text string, suitable for copying to the clipboard.
*   **`metadata.json`:** Standard metadata file for the application, including name, description, and permissions (currently none requested).

This detailed documentation should provide a solid understanding of AI Resume Artisan's architecture, functionality, and technical implementation.
Fill `[Current Date]` with today's date when finalizing.
    