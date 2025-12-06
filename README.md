# AI Resume Artisan™ | Enterprise-Grade Career Architect

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![AI Model](https://img.shields.io/badge/AI_Core-Gemini_3_Pro-blueviolet?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-React_19_%7C_TypeScript-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

> **Architect your career narrative with the precision of AI.**
>
> *AI Resume Artisan* is not just a resume builder. It is an intelligent career strategist that leverages **Google's Gemini 3.0 Pro** and **2.5 Flash** models to deconstruct your professional history, analyze target job descriptions, and engineer high-converting, ATS-optimized application materials.

---

## 🚀 Why AI Resume Artisan?

In an era of algorithmic hiring, generic resumes are invisible. **AI Resume Artisan** bridges the gap between human potential and machine parsing.

### 🌟 Unique Value Proposition (UVP)
*   **🧠 Cognitive Reasoning:** Unlike template fillers, our AI *understands* the nuance of your career using Gemini's "Thinking Mode", ensuring every bullet point lands with impact.
*   **🎯 Semantic Tailoring:** We don't just keyword stuff. The engine performs deep semantic analysis of job descriptions to align your profile with the core competencies employers seek.
*   **🔄 Iterative Strategy Loop:** Identified a gap? Our **AI Gap Analysis** doesn't just flag it—it suggests the exact verbiage to bridge it, allowing you to iterate your way to a 100% Match Score.
*   **📸 Nano Banana Pro Headshots:** Generates professional-grade, AI-synthesized executive headshots using `gemini-3-pro-image-preview` to complete your personal brand.
*   **🌐 Real-Time Grounding:** utilizes Google Search Grounding to inject real-time industry trends and keywords into your profile, ensuring you look cutting-edge.

---

## ⚡ Core Features

### 1. The Executive Strategy Deck
*   **Context-Aware Generation:** Ingests raw notes, LinkedIn exports, or old CVs.
*   **Smart Auto-Save:** Local-first persistence ensures your draft is never lost.
*   **Settings & Privacy:** robust data management to clear or reset your career profile.

### 2. Deep Match Analysis
*   **Quantifiable Scoring:** Real-time **0-100% Job Match Score**.
*   **Gap Detection:** Identifies missing hard/soft skills.
*   **Strategic Fixes:** One-click AI suggestions to rewrite sections and close qualification gaps.

### 3. Visual Identity Suite
*   **Enterprise Layouts:** Choose between 'Executive Gold' (Serif/Classic) and 'Modern Tech' (Sans/Clean) templates.
*   **Dynamic Typography:** Real-time font switching (Inter, Merriweather, JetBrains Mono).
*   **PDF Export Engine:** High-fidelity, vector-quality PDF generation (`jspdf` + `html2canvas`) with custom filename control.

---

## 🛠️ Technical Architecture

Built on a modern, performance-obsessed stack designed for scalability and developer experience.

*   **Frontend Framework:** **React 19** (Leveraging concurrent features).
*   **Language:** **TypeScript** (Strict mode for enterprise reliability).
*   **Styling:** **Tailwind CSS** (Utility-first, responsive, dark-mode native).
*   **AI Orchestration:**
    *   **Logic:** `@google/genai` SDK v1.4.0.
    *   **Models:**
        *   `gemini-3-pro-preview`: Complex reasoning, resume structuring, gap analysis.
        *   `gemini-2.5-flash`: High-speed drafting (Cover Letters), real-time suggestions.
        *   `gemini-3-pro-image-preview`: Visual asset generation.
*   **Client-Side Processing:** No backend database required. All state is local or transient.

---

## 🚀 Quick Start

**Prerequisites:**
You must have a Google Cloud Project with the Gemini API enabled and a valid API Key.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-org/ai-resume-artisan.git
    cd ai-resume-artisan
    ```

2.  **Environment Setup**
    *   The application requires an API Key.
    *   *Note: This project is configured to read `process.env.API_KEY`. Ensure your build environment injects this variable.*

3.  **Install & Run**
    ```bash
    npm install
    npm start
    ```

---

## 🔒 Privacy & Security

*   **Local-First Design:** Your raw resume data is stored in your browser's `localStorage` and is never sent to a proprietary backend database.
*   **Transient AI Processing:** Data is sent to the Gemini API solely for the purpose of generation and analysis.
*   **Enterprise Ready:** Designed to be easily containerized and deployed within secure corporate intranets or private clouds.

---

## 🤝 Contributing

We welcome contributions from the open-source community. Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

---

**© 2025 AI Resume Artisan.** Engineered for Excellence.
