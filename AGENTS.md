
# AGENTS.md - Master Directive for AI Contributors

> **ATTENTION AI AGENTS:** This file represents the absolute source of truth for contributing to the AI Resume Artisan repository. Read this completely before scanning other files or suggesting changes.
>
> **Primary Maintainer:** w3jdev (w3jdev.com)

## 1. Project Context & Scope
**AI Resume Artisan** is an enterprise-grade, client-side React application that leverages Google's Gemini 3.0 Pro to architect high-impact resumes. 
*   **Core Philosophy:** Privacy-First (Local Storage only), No-Backend (Direct-to-API), and High-Fidelity Visuals (CSS3/Canvas).
*   **Architecture:** Single Page Application (SPA) using Native ES Modules via `esm.sh` (No heavy bundler like Webpack in the source logic, though simple serving is required).

## 2. Technology Stack & Constraints
*   **Frontend Library:** React 19 (Concurrent Mode).
*   **Language:** TypeScript 5.x (Strict Mode).
*   **Styling:** Tailwind CSS (via CDN injection for this specific architecture, or standard PostCSS if build step is added).
*   **AI Provider:** Google Gemini API (`@google/genai` v1.4.0).
*   **Persistence:** Browser `localStorage` only.
*   **PDF Generation:** `html2canvas` + `jspdf` (Client-side rendering).

## 3. Strict "Dos and Don'ts"

### ⛔ ABSOLUTELY FORBIDDEN
1.  **NO PII Storage:** Never suggest creating a backend database to store user names, emails, or resumes. Data must remain on the client.
2.  **NO API Key Hardcoding:** Never write API keys into code. Always refer to `process.env.API_KEY` (or the environment variable injection method used).
3.  **NO Class Components:** Use React Functional Components and Hooks only.
4.  **NO Heavy UI Libraries:** Do not introduce Material UI, Bootstrap, or AntD. Use Tailwind CSS and Headless UI patterns.
5.  **NO `any` Types:** Strictly define interfaces in `types.ts`.

### ✅ REQUIRED BEHAVIORS
1.  **Interface-First Development:** When modifying data structures, update `types.ts` *first*.
2.  **Robust Error Handling:** Every API call to Gemini must be wrapped in `try/catch` with user-facing error state updates.
3.  **Accessibility (a11y):** All buttons must have `aria-label`, inputs must have associated labels, and color contrast must meet WCAG AA.
4.  **Mobile Responsiveness:** All layouts must be fully responsive (Mobile -> Tablet -> Desktop).

## 4. Coding Standards

### File Structure
*   `components/`: UI components (Presentational).
*   `services/`: Business logic and API interaction (e.g., `geminiService.ts`).
*   `utils/`: Pure functions (e.g., `textUtils.ts`, `downloadUtils.ts`).
*   `types.ts`: Centralized type definitions.

### Naming Conventions
*   **Components:** PascalCase (e.g., `ResumeInput.tsx`).
*   **Functions:** camelCase (e.g., `generateResume`).
*   **Interfaces:** PascalCase (e.g., `ResumeData`).
*   **Constants:** UPPER_SNAKE_CASE (e.g., `STORAGE_KEYS`).

### AI Service Pattern
When calling Gemini:
1.  Define the model constant (`gemini-3-pro-preview` for logic, `gemini-2.5-flash` for speed).
2.  Use `thinkingConfig` for complex tasks.
3.  Sanitize JSON output using `parseJsonFromText` helper to handle Markdown fences.

## 5. Testing & Validation (Mental Check)
Before submitting code, the Agent must verify:
1.  Does this break the "One-Page" layout constraint?
2.  Does this expose user data?
3.  Is the Tailwind styling consistent with the "Obsidian & Gold" theme?
4.  Did I update `types.ts`?

## 6. Documentation
*   If you change architecture, update `docs/architecture/`.
*   If you change features, update `docs/product/PRD.md`.
*   Always log major changes in `CHANGELOG.md`.

---
**End of Directive.**
