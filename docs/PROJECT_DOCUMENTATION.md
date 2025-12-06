# 📘 AI Resume Artisan: Technical Whitepaper

**Version:** 2.0 (Enterprise Release)
**Date:** November 2025

---

## 1. Executive Summary

**AI Resume Artisan** is a client-side, single-page application (SPA) engineered to democratize access to elite career counseling. By leveraging the cognitive capabilities of **Google's Gemini 3.0 Pro**, the application transforms unstructured professional history into structured, optimized, and visually compelling application materials.

The architecture prioritizes **privacy (local-first data)**, **performance (React 19)**, and **intelligence (Multi-model AI orchestration)**.

---

## 2. System Architecture

### 2.1. Frontend Core
*   **Framework:** React 19.1.0
*   **Type System:** TypeScript 5.x (Strict)
*   **Build System:** ESM-based (No heavy bundler required for dev, optimized for edge delivery).
*   **Styling:** Tailwind CSS (configured via CDN/Script injection for rapid prototyping and themeability).

### 2.2. The AI Engine (`services/geminiService.ts`)
The application utilizes a **Multi-Model Strategy** to balance cost, latency, and intelligence:

| Task | Model | Rationale |
| :--- | :--- | :--- |
| **Resume Architecting** | `gemini-3-pro-preview` | Requires high "Thinking Budget" (4000 tokens) for semantic understanding, hierarchy, and ATS optimization. |
| **Gap Analysis** | `gemini-3-pro-preview` | Complex reasoning required to identify subtle missing qualifications. |
| **Cover Letter Drafting** | `gemini-2.5-flash` | High throughput, lower latency text generation. |
| **Live Suggestions** | `gemini-2.5-flash` | Instant feedback loops for interactive UI elements. |
| **Headshot Generation** | `gemini-3-pro-image-preview` | High-fidelity image synthesis for personal branding. |
| **Trend Research** | `gemini-2.5-flash` | Utilizes **Google Search Grounding** tool for real-time market data. |

### 2.3. Data Persistence Layer
To ensure enterprise-grade reliability, the application implements an **Auto-Save Strategy**:
*   **Mechanism:** `localStorage`
*   **Triggers:** Real-time on input change (debounced).
*   **Keys:** `artisan_raw_text`, `artisan_job_desc`.
*   **Management:** A dedicated **Settings Modal** allows users to purge local data, resetting the application state securely.

---

## 3. Key Functional Modules

### 3.1. The Strategy Deck (Left Panel)
Acts as the control center.
*   **Input Context:** Manages raw text and Job Description (JD).
*   **Grounding:** Integrates specific tools to research industry trends before generation.
*   **Insight Engine:** Displays `Match Score`, `Tailoring Strength`, and interactive `Gap Analysis`.

### 3.2. The Live Canvas (Right Panel)
A sophisticated rendering engine.
*   **3D Perspective:** CSS3 transforms provide a sleek, depth-based preview.
*   **Dynamic Templating:** Supports hot-swapping of layouts (Enterprise Gold vs. Modern Compact).
*   **Export Pipeline:**
    *   **PDF:** Uses `html2canvas` (v1.4) + `jspdf` (v2.5) for pixel-perfect A4 rendering.
    *   **Custom Filenaming:** Users can specify filenames via a popover for professional file management.

---

## 4. Security & Compliance

*   **API Security:** The application expects `process.env.API_KEY` to be injected at build/runtime. No hardcoded credentials.
*   **Data Sovereignty:** User data resides in the browser. No intermediate servers store personal identifiable information (PII).
*   **Auditing:** Console logging is minimized in production; error handling is robust (graceful degradation).

---

## 5. Future Roadmap

*   **v2.1:** Integration with LinkedIn API for one-click profile import.
*   **v2.2:** Multi-page resume support for academic CVs.
*   **v3.0:** "Interview Coach" – utilizing Gemini Live API for real-time voice interview practice based on the generated resume.

---

**Confidentiality:** This document contains internal architectural details of AI Resume Artisan.
