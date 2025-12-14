
# AI Resume Artisan™ | Enterprise Edition

![AI Core](https://img.shields.io/badge/AI_Intelligence-Gemini_3_Pro-7c3aed?style=for-the-badge&logo=google)
![Visual Engine](https://img.shields.io/badge/Visual_Identity-Gemini_3_Pro_Image-f59e0b?style=for-the-badge&logo=googlelens)
![Tech Stack](https://img.shields.io/badge/Frontend-React_19_|_TypeScript-3b82f6?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-94a3b8?style=for-the-badge)

> **"Not just a resume builder. A cognitive career strategist."**

**AI Resume Artisan** is a client-side, privacy-first application that orchestrates Google's **Gemini 3.0 Pro** to deconstruct professional histories, analyze job descriptions, and engineer high-converting resumes.

---

## 📚 Documentation Center

We follow a strict "Docs-as-Code" philosophy. Detailed documentation is located in the `docs/` directory.

### 🚀 Getting Started
*   **[Quick Start & Setup](docs/engineering/SETUP_GUIDE.md)**: How to run the project locally.
*   **[Agents Directive (AGENTS.md)](AGENTS.md)**: **Critical** reading for AI Coding Assistants.

### 🏗️ Architecture & Engineering
*   **[System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)**: High-level design and data flow.
*   **[Decision Records (ADRs)](docs/architecture/adrs/)**: Why we made specific technical choices.
*   **[Tech Stack & Dependencies](docs/engineering/TECH_STACK.md)**: Detailed breakdown of libraries.

### 📦 Product & Business
*   **[Product Requirements (PRD)](docs/product/PRD.md)**: Features, User Stories, and Scope.
*   **[Success Metrics](docs/product/SUCCESS_METRICS.md)**: KPIs and Validation criteria.
*   **[Changelog](CHANGELOG.md)**: Version history.

---

## ⚡ Core Capabilities

1.  **Cognitive Resume Architecture**: Uses `gemini-3-pro` with extended thinking budgets to restructure bullet points based on seniority.
2.  **Gap Analysis Loop**: Identifies missing skills vs. the JD and generates specific "fix" suggestions.
3.  **Visual Identity**: Generates headshots (`gemini-3-pro-image`) and personal brand videos (`veo-3.1`).
4.  **Local-First Security**: Zero-knowledge backend. All data stays in `localStorage`.

---

## 🛠️ Quick Run

1.  **Clone**
    ```bash
    git clone https://github.com/w3jdev/ai-resume-artisan.git
    ```
2.  **Configure API Key**
    Ensure `process.env.API_KEY` is available or export it in your shell.
3.  **Install & Start**
    ```bash
    npm install
    npm start
    ```

---

## ✍️ Author & Credits

**Crafted by w3jdev**

*   🌐 [w3jdev.com](https://w3jdev.com)
*   💻 [github.com/w3jdev](https://github.com/w3jdev)
*   👔 [linkedin.com/in/w3jdev](https://linkedin.com/in/w3jdev)

**© 2025 AI Resume Artisan.** Engineered for Excellence.
