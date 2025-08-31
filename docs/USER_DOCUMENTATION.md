
# AI Resume Artisan - User Documentation

Welcome to AI Resume Artisan! This guide will walk you through using the application to create compelling, AI-powered resumes and cover letters.

## 1. Introduction

AI Resume Artisan is a smart web application designed to help you:
*   Transform your raw resume notes or existing resume into a polished, one-page document.
*   Tailor your resume effectively to specific job descriptions.
*   Generate professional cover letters quickly.
*   Receive AI-driven insights to improve your application materials.

## 2. Before You Begin

*   **Gather Your Information:** Have your current resume details, work history, skills, education, and any other relevant professional information ready. This can be in any text format.
*   **Find a Job Description (Highly Recommended):** For the best results, especially for resume tailoring and cover letter generation, have the job description of the role you're targeting.
*   **API Key:** This application requires a Google Gemini API key to function. This key must be pre-configured in the application's environment (`process.env.API_KEY`). The application itself does not provide a way to enter or manage this key.

## 3. Step-by-Step Guide

The AI Resume Artisan interface is designed to be intuitive. Here's how to navigate and use its features:

### 3.1. Input Your Information (Left Panel)

1.  **Paste Your Resume Details:**
    *   In the "Paste Your Resume Details" textarea, enter all your professional information. This can be copied from an old resume, your LinkedIn profile, or typed directly. Include sections like professional summary, work experience (company, role, dates, responsibilities), education, skills, licenses, and certifications.
    *   **Tip:** Include web links (e.g., LinkedIn profile, portfolio website) directly in the text. The AI can recognize and format these.
    *   To clear the input, click the **'X' icon** at the top right of the textarea.

2.  **Provide Job Description (Optional but Recommended):**
    *   In the "Job Description" textarea, paste the full text of the job description for the role you are applying for.
    *   Providing this allows the AI to:
        *   Tailor your resume content to match the job's requirements.
        *   Provide "AI Tailoring Insights" and "Job Match Analysis."
        *   Generate a more relevant cover letter.
    *   To clear the input, click the **'X' icon** at the top right of the textarea.

### 3.2. Select Styling Options

Below the text input areas, you'll find dropdown menus to customize the appearance of your generated resume:

*   **Resume Template:** Choose between:
    *   `Classic`: A traditional, widely accepted resume format.
    *   `Modern Compact`: A sleek, space-efficient design.
*   **Font Style:** Choose between:
    *   `Sans-Serif (Lato)`: A clean, modern font.
    *   `Serif (Merriweather)`: A more traditional, classic font.

### 3.3. Generate Your Resume

*   Once you've entered your resume details and (optionally) the job description, and selected your styles, click the **"Generate Resume"** button.
*   The button will show a loading state (e.g., "Crafting Resume..."). Please be patient as the AI processes your information.
*   If any errors occur (e.g., missing resume text, API key issue), an error message will appear below the input fields.

### 3.4. Review Your Generated Resume (Right Panel)

*   After successful generation, your formatted resume will appear in the "Generated Resume" preview area on the right side of the screen.
*   **Download as PDF:** Click the **Download Icon** (⬇️) at the top right of the resume preview to save your resume as a PDF file.
*   **Copy to Clipboard:** Click the **Copy Icon** (📋) to copy the entire resume content as plain text. This is useful for pasting into online application forms. The icon will change to a **Checkmark Icon** (✔️) briefly upon successful copy.

### 3.5. Understand AI Insights (Left Panel - Appears if Job Description was Used)

If you provided a job description when generating your resume, two new sections will appear in the left panel below the input area:

1.  **AI Tailoring Insights:**
    *   **Overall Tailoring Fit:** Shows a qualitative assessment (e.g., 'Excellent', 'Good', 'Fair') of how well the AI believes your resume is tailored to the job description.
    *   **Prioritized Key Terms:** Lists key terms from the job description that the AI focused on incorporating into your resume.

2.  **Job Match Analysis:**
    *   **Job Alignment Score:** A percentage (0-100%) indicating the AI's assessment of how well your resume aligns with the job description. A progress bar provides a visual representation.
    *   **Alignment Strengths:** Lists areas where your resume strongly matches the job requirements.
    *   **Potential Gaps / Improvements:** Highlights areas where your resume could be enhanced to better fit the job description, or points out missing elements.

### 3.6. Use AI Gap Suggestions for Iterative Improvement

The "Potential Gaps / Improvements" section is interactive, allowing you to refine your resume further:

1.  **Request a Suggestion:** For any listed gap, click the **Lightbulb Icon** (💡) next to it.
2.  **Review Suggestion:** The AI will generate a specific, actionable suggestion to address that gap. This suggestion will appear below the list of gaps, along with "Apply Suggestion" and "Dismiss" buttons. A loading spinner will show while the suggestion is being fetched. If an error occurs, it will be displayed here.
3.  **Apply Suggestion:** If you like the suggestion, click the **"Apply Suggestion"** button.
    *   This will automatically trigger a regeneration of your resume, with the AI attempting to incorporate the suggestion to address the identified gap.
    *   The resume preview and all analysis sections will update.
4.  **Dismiss Suggestion:** If you don't want to use the suggestion, or want to clear the suggestion display, click the **"Dismiss"** button (X icon).

### 3.7. Generate Your Cover Letter

*   After your resume has been generated, and if you have provided a job description, the **"Generate Cover Letter"** button becomes active.
*   Click this button. The AI will use your generated resume data and the job description to craft a tailored cover letter.
*   The button will show a loading state (e.g., "Writing Letter...").
*   The generated cover letter will appear in the "Generated Cover Letter" preview area on the right.
*   **Download as PDF:** Click the **Download Icon** (⬇️) at the top right of the cover letter preview to save it as a PDF.

## 4. Key Benefits

Using AI Resume Artisan offers several advantages:

*   **Save Time and Effort:** Automates the tedious parts of resume and cover letter writing.
*   **Professional Quality:** Produces well-structured, ATS-friendly documents in professional templates.
*   **AI-Powered Tailoring:** Adapts your resume to specific job descriptions, increasing relevance.
*   **Actionable Feedback:** Provides concrete insights (scores, strengths, gaps) and AI-generated suggestions for improvement.
*   **Iterative Refinement:** Allows you to improve your resume step-by-step using AI suggestions.
*   **Increased Confidence:** Empowers you with better application materials for your job search.

## 5. Tips for Best Results

*   **Be Comprehensive:** Provide as much relevant detail as possible in the "Resume Details" input. The AI works best with more information.
*   **Always Use a Job Description:** For the most powerful features (tailoring, job match analysis, gap suggestions, targeted cover letters), always input the job description.
*   **Review and Personalize:** AI is a powerful tool, but always review the generated content. Ensure it accurately reflects your experience and add your personal touch.
*   **Iterate:** Use the gap analysis and suggestion features to refine your resume for optimal impact.

## 6. Troubleshooting & Important Notes

*   **API Key:** Remember, a valid Google Gemini API key must be configured in the application's environment for it to work.
*   **Internet Connection:** An active internet connection is required for AI processing.
*   **Errors:** If you encounter errors:
    *   Ensure your API key is correctly configured and valid.
    *   Check your internet connection.
    *   Try rephrasing your input text if the AI struggles to understand it.
    *   If a specific feature fails (like a gap suggestion), you can often still use other parts of the application.

Happy job hunting with AI Resume Artisan!
