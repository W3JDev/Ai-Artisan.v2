
# Success Criteria & Validation

## 1. Business Metrics (User Value)
*   **Conversion Rate:** % of users who download a PDF after generating a resume. (Target: >60%).
*   **Engagement:** Average time spent in "Analysis" tab refining gaps. (Target: >3 mins).
*   **Retention:** % of users who return via the "History" tab (simulated via LocalStorage check).

## 2. Technical Metrics (Quality)
*   **Parseability Score:** Average score returned by the internal ATS Audit tool. (Target: >90/100).
*   **Generation Latency:**
    *   Flash Model (Cover Letter): < 5 seconds.
    *   Pro Model (Resume): < 20 seconds.
*   **Error Rate:** % of API calls resulting in 4xx/5xx or Malformed JSON. (Target: < 2%).

## 3. Validation Strategy

### A. Automated Tests
*   **Unit Tests:** Verify `textUtils` formatting and `geminiService` JSON parsing.
*   **Integration:** Mock API calls to verify State -> UI flow.

### B. User Acceptance Testing (UAT)
*   **The "One-Page" Test:** Does the generated content fit on a single A4 page without CSS overflow?
*   **The "Hallucination" Test:** Does the AI invent jobs? (Mitigated by Prompt Engineering requiring truthfulness).
*   **The "ATS" Test:** Export PDF -> Upload to standard parser (e.g., ResumeWorded/Jobscan) -> Verify extraction.
