
# AI Usage, Prompt Logs & Safety Guardrails Document

**Project:** LogSentinel-InnoViast

**Track:** AI Solutions Engineering (Track 03) — Week 6 Hardening

**Organization:** Innoviast

---

## 1. AI Infrastructure & Model Capabilities

LogSentinel-InnoViast integrates Google's generative AI models to provide real-time, automated incident response triage for raw cybersecurity log streams.

* **Primary LLM:** `gemini-2.5-flash` via official `@google/generative-ai` SDK
* **Response Format:** Deterministic JSON Enforcement (`responseMimeType: "application/json"`)
* **Execution Pipeline:** Local Client Pre-Processing ➔ Regex Sanitization ➔ Gemini API Call ➔ Structured Parsing ➔ Human Verification Gate ➔ Escalation

---

## 2. Core Prompt Design & System Directives

To prevent prompt injection, hallucinations, and unstructured output formatting, the Gemini model operates under a strict Incident Response Analyst system directive:

You are an expert Cybersecurity Incident Response Analyst.
Analyze the provided raw server/firewall/auth logs.
Evaluate threat level, extract attack IPs or vectors, summarize key findings, and suggest explicit mitigation steps.
If the log is clean, indicate LOW threat level.
If the log is incomplete or corrupted, explicitly state UNKNOWN in risk_score.

Return ONLY a JSON object matching this schema:
{
"risk_score": "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN",
"confidence": "High" | "Medium" | "Low",
"summary": "string",
"extracted_ips": ["string"],
"recommended_action": "string"
}

---

## 3. Hardening & Safety Guardrails

### 🔒 Privacy Guardrail: Client-Side Regex Pre-Filter

Before any raw log data leaves the user's browser, it passes through a local sanitization layer (`src/utils/sanitize.js`).

* **Scrubbing Scope:** Automatically redacts API keys (`api_key=...`), secret tokens, passwords, and Bearer authorization headers.
* **Redaction Replacement:** Replaces sensitive values with `[REDACTED_BY_LOGSENTINEL]` to prevent accidental credential exposure to cloud LLM endpoints.

### 👤 Governance Guardrail: Human-In-The-Loop (HITL) Protocol

* **Non-Autonomous Actions:** AI outputs are strictly advisory. The system does NOT automatically escalate or trigger downstream SIEM/SOAR actions.
* **Analyst Gatekeeping:** The "Approve & Escalate" workflow requires an analyst to manually review raw logs and check a verification box before SOC alert state changes.

### ⚠️ Reliability Guardrail: Safe Failure & Fallback Handling

* **Missing API Key:** If `VITE_GEMINI_API_KEY` is not present, the app gracefully degrades and displays an environment fallback warning without crashing.
* **Malformed Outputs:** Errors during API transmission or JSON parsing are caught via `try-catch` blocks, triggering a safe fallback state for manual SOC review.

---

## 4. Prompt Engineering & Iteration Log

* **v1.0 (Initial):** Free-text unstructured output request. Resulted in verbose markdown text that was hard to parse programmatically.
* **v1.1 (Structured):** Injected strict JSON schema requirements. Enabled reliable UI parsing into severity badges and IP vector pills.
* **v1.2 (Hardened):** Added `UNKNOWN` risk score fallback rule. Handles partial, corrupted, or non-log payloads gracefully without model hallucination.

---

## 5. Responsible AI & Data Privacy Compliance

* **No Credential Storage:** API keys and environment variables are client-managed and never stored in secondary databases.
* **Zero Raw Secret Transmission:** Sanitization pre-filters ensure zero-trust compliance prior to API payload dispatch.
* **Explainability:** Threat levels are paired with confidence ratings and source IP arrays to allow clear auditing by security teams.