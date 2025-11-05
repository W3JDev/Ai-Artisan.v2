# AI Resume Artisan

[![AI Resume Artisan Logo](https://via.placeholder.com/150/0ea5e9/ffffff?text=AI+Resume+Artisan)](https://example.com/live-demo) <!-- Replace with actual logo and live demo link if available -->

**AI Resume Artisan** is an intelligent web application designed to empower job seekers by transforming raw resume text and job descriptions into polished, ATS-friendly, one-page resumes and compelling cover letters. Leveraging the advanced capabilities of Google's Gemini API, it provides not just generation but also insightful analysis and actionable suggestions to optimize your application materials.

**Live Demo:** [Link to Deployed Application (if available)] <!-- Add link here -->

## Key Features

*   **AI-Powered Resume Generation:** Converts your existing resume content, LinkedIn profile text, or unstructured notes into a professionally formatted, concise, one-page resume.
*   **Intelligent Cover Letter Creation:** Automatically generates personalized and targeted cover letters based on your newly crafted resume and an optional job description.
*   **Job Description Tailoring:** Analyzes a provided job description to dynamically tailor your resume content, highlighting the most relevant skills and experiences for the specific role.
*   **AI Tailoring Insights:** Offers valuable feedback on the resume's tailoring, including:
    *   A list of key terms from the job description that the AI prioritized.
    *   An overall "Tailoring Strength" assessment (Excellent, Good, Fair).
*   **In-Depth Job Match Analysis:** Provides a detailed breakdown of how well the generated resume aligns with the target job description, featuring:
    *   A numerical **Job Alignment Score** (0-100%).
    *   A list of **Alignment Strengths**, showcasing where your resume effectively meets job requirements.
    *   Identification of **Potential Gaps / Improvements**, pinpointing areas where your resume could better match the job.
*   **Actionable AI Gap Suggestions:** For each identified "gap," users can request an AI-generated suggestion. These suggestions are designed to be practical and can be directly applied to regenerate an improved version of the resume.
*   **Customizable Templates & Fonts:** Offers a selection of resume templates (e.g., 'Classic', 'Modern Compact') and font styles (e.g., 'Sans-Serif - Lato', 'Serif - Merriweather') to suit different preferences and industries.
*   **PDF Download:** Allows for easy downloading of both the generated resume and cover letter as professionally formatted PDF documents.
*   **Copy to Clipboard:** Provides a convenient option to copy the full resume content as plain text for use in online applications or other documents.
*   **ATS-Friendly Output:** The AI is instructed to generate resumes with a structure and content style that is generally well-parsed by Applicant Tracking Systems (ATS).
*   **Responsive Design:** Features a clean, intuitive, and responsive user interface accessible on desktops, tablets, and mobile devices.

## Technology Stack

*   **Frontend:**
    *   React
    *   TypeScript
    *   Tailwind CSS
*   **AI Engine & Services:**
    *   **Google Gemini API** (via `@google/genai` SDK)
        *   Resume Generation & Analysis Model: `gemini-2.5-pro` (utilizing Thinking Mode for complex tasks)
        *   Cover Letter & Suggestions Model: `gemini-2.5-flash` (for speed and efficiency)
*   **PDF Generation:**
    *   `jsPDF`
    *   `html2canvas`

## How It Works (User Workflow)

1.  **Input Resume Details:** Paste your current resume information, professional summary, work experience, educational background, skills, and any other relevant details into the "Paste Your Resume Details" text area.
2.  **Provide Job Description (Optional but Highly Recommended):** For the best results, paste the full job description of the role you're applying for into the "Job Description" text area. This enables AI-powered tailoring, detailed job match analysis, and a more targeted cover letter.
3.  **Select Styling Options:** Choose your preferred "Resume Template" and "Font Style" from the dropdown menus.
4.  **Generate Resume:** Click the "Generate Resume" button. The AI will process your input (and the job description, if provided) to create a structured, one-page resume.
5.  **Review, Analyze & Iterate:**
    *   The generated resume will appear in the preview pane.
    *   If a job description was used, review the "AI Tailoring Insights" and "Job Match Analysis" sections. These provide crucial feedback on keyword integration, overall fit, strengths, and areas for improvement.
    *   For any "Potential Gaps" identified, click the lightbulb icon next to a gap to receive an AI-generated suggestion.
    *   If you wish to use a suggestion, click "Apply Suggestion." This will regenerate the resume, incorporating the AI's advice.
6.  **Generate Cover Letter:** Once you are satisfied with the generated resume, click the "Generate Cover Letter" button. The AI will craft a cover letter based on your resume and the job description.
7.  **Download or Copy:**
    *   Use the download icon on the resume and cover letter previews to save them as PDF files.
    *   Use the copy icon on the resume preview to copy its content as plain text.

## API Key Configuration

AI Resume Artisan relies on the Google Gemini API for its intelligent features. To use the application, you **must** have a valid Google Gemini API key.

*   The application is designed to read this API key from an environment variable named `API_KEY`.
*   You need to ensure that `process.env.API_KEY` is set in the environment where the application is built or hosted.
*   **The application does not provide a UI for entering the API key; it must be pre-configured in the environment.**

## Project Rationale & Unique Value

In today's competitive job market, a generic resume is often insufficient. AI Resume Artisan was built to address the common challenges job seekers face:
*   Crafting compelling and concise resumes that stand out.
*   Tailoring applications effectively for each specific role.
*   Ensuring resumes are optimized for Applicant Tracking Systems (ATS).
*   Generating professional cover letters quickly.

While many resume builders exist, AI Resume Artisan differentiates itself through:
*   **Deep AI Integration:** Beyond simple formatting, it uses AI for intelligent content generation, summarization, and keyword integration.
*   **Data-Driven Feedback:** The Job Match Analysis and Tailoring Insights provide concrete, actionable feedback that users can implement.
*   **Iterative Improvement:** The "Gap Suggestion" feature allows users to actively refine their resume based on AI recommendations.
*   **Focus on One-Page Effectiveness:** Guides users towards creating impactful, single-page resumes, a common preference for recruiters.

## Benefits

*   **Save Significant Time & Effort:** Automates the most tedious parts of resume and cover letter writing.
*   **Enhance Document Quality:** Leverages AI to optimize content, structure, and keyword relevance.
*   **Improve Job Application Success Rate:** Increases the chances of your resume getting noticed by recruiters and passing ATS screening.
*   **Boost Confidence:** Provides data-driven insights and actionable suggestions, empowering users in their job search.
*   **Stay Competitive:** Helps create modern, professional, and tailored application materials.

## Disclaimer

AI-generated content is a powerful tool, but it's essential to review and personalize all generated documents. AI Resume Artisan provides a strong starting point, but your unique insights and experiences are crucial to making your application truly shine. Always double-check for accuracy and ensure the tone aligns with your personal brand.

## Contributing

[Details on how to contribute to the project, if open to contributions. e.g., Fork the repo, create a feature branch, submit a pull request.]

## License

[Specify the project's license, e.g., MIT, Apache 2.0. If not decided, can state "License to be determined."]]