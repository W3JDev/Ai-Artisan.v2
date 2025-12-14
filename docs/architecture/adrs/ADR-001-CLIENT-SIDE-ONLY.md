
# ADR 001: Client-Side Only Architecture

**Date:** 2024-10-01
**Status:** Accepted

## Context
We need to build a resume generator that handles sensitive personal data (career history, phone, email). We also want to minimize hosting costs and complexity.

## Decision
We will build AI Resume Artisan as a **Client-Side Single Page Application (SPA)** with **No Backend Database**.

## Rationale
1.  **Privacy:** By not having a database, we eliminate the risk of a massive PII data breach. User data never leaves their device except to go to the Google AI API for processing.
2.  **Cost:** Hosting static files is free/cheap (Netlify/Vercel/GitHub Pages). We only pay for API usage.
3.  **Simplicity:** Reduces dev ops overhead. No SQL migrations, no auth servers.

## Consequences
*   **Positive:** High trust from privacy-conscious users. Zero latency for database reads.
*   **Negative:** Users cannot sync resumes between Desktop and Mobile easily (bound to browser LocalStorage).
*   **Mitigation:** We implement a JSON Export/Import feature (Strategy Deck) to allow manual moving of data.
