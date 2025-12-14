
# Product Requirements Document (PRD)

**Product:** AI Resume Artisan (Enterprise Edition)
**Status:** Beta v2.0
**Owner:** Product Team

---

## 1. Problem Statement
Job seekers struggle to tailor resumes for Applicant Tracking Systems (ATS) and specific Job Descriptions (JD). The process is manual, time-consuming, and prone to "writer's block." Generic tools offer formatting but lack *strategic* content optimization.

## 2. Solution Vision
An intelligent, browser-based "Career Architect" that uses advanced LLMs (Gemini 3 Pro) to not just format, but *rewrite* and *strategize* application materials based on the specific requirements of a target role.

## 3. User Personas
*   **The Executive:** Needs a high-impact summary of 15+ years of experience on one page.
*   **The Pivot:** A career changer who needs to highlight transferable skills over linear history.
*   **The Techie:** Needs to ensure specific tech stack keywords are present for ATS parsing.

## 4. Functional Requirements

### 4.1. Core Generation
*   **FR-01:** System must accept raw text, PDF, or DOCX input.
*   **FR-02:** System must accept a Target Job Description.
*   **FR-03:** System must generate a JSON-structured resume using `gemini-3-pro-preview`.

### 4.2. Analysis & Feedback
*   **FR-04:** System must provide a 0-100% "Match Score".
*   **FR-05:** System must identify specific "Gaps" (missing skills).
*   **FR-06 (The Fix Loop):** User must be able to click a gap and get an AI-generated suggestion to truthfully add it to their resume.

### 4.3. Visual & Export
*   **FR-07:** System must render in A4 format (210mm x 297mm).
*   **FR-08:** System must export to PDF with selectable text.
*   **FR-09:** System must support theme switching (Serif/Sans, Compact/Spacious).

## 5. Non-Functional Requirements
*   **NFR-01 (Privacy):** No PII stored on servers. All state in `localStorage`.
*   **NFR-02 (Performance):** Resume generation under 15 seconds.
*   **NFR-03 (Reliability):** Robust error handling for API timeouts or malformed JSON.

## 6. Future Scope (v3.0)
*   LinkedIn OAuth Integration.
*   Voice Mode Interview Prep (Gemini Live).
