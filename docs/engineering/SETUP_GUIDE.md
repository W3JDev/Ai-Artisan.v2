
# Developer Setup Guide

## Prerequisites
*   Node.js v18+
*   Google Cloud Project with Gemini API enabled.
*   A valid API Key.

## Installation

1.  **Clone the Repository**
    ```bash
    git clone [repo-url]
    cd ai-resume-artisan
    ```

2.  **Install Dependencies**
    Note: We use `esm.sh` for runtime imports, but you may need local types or dev tools.
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root:
    ```bash
    # .env
    API_KEY="AIzaSy..."
    ```
    *Note: In a pure client-side build without a bundler that supports `.env`, you may need to export this in your terminal session or hardcode strictly for local dev (never commit).*

4.  **Run Locally**
    ```bash
    npm start
    ```
    Open `http://localhost:3000` (or the port specified).

## Contributing Workflow
1.  Read `AGENTS.md`.
2.  Create a feature branch (`feat/new-template`).
3.  Make changes.
4.  Verify no Type errors.
5.  Submit PR.
