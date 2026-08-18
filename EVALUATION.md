# 🧪 LogSentinel-InnoViast — Week 6 QA & Product Hardening Report

## 1. Executive Summary
This document fulfills the **Week 6 Validation Requirement** for Innoviast Track 03 (AI Solutions Engineering). 
The project has been hardened with client-side sanitization boundaries, human-in-the-loop gatekeeping, and structured JSON parsing error fallbacks.

## 2. Expanded Evaluation Set (15 Test Cases)

| ID | Test Scenario | Input Type | Expected Result | Status | Hardening Notes |
|---|---|---|---|---|---|
| 01 | SSH Brute Force Preset | Syslog | High Severity + Extract IP | ✅ PASS | Correctly isolated 192.0.2.45 |
| 02 | Payment Key Leak | Config Dump | Redact secret token | ✅ PASS | Masked using regex pre-filter |
| 03 | Normal HTTP Log | Web Access | Low Threat Severity | ✅ PASS | Returns clean evaluation |
| 04 | Unformatted String | Garbage Text | UNKNOWN Risk | ✅ PASS | Schema handles corrupted logs |
| 05 | Prompt Injection Attack | Malicious Text | Ignore & Analyze Safe | ✅ PASS | System prompt isolates raw text |
| 06 | Large Log Stream | 40+ Lines | Summarize key findings | ✅ PASS | Parsed within token limits |
| 07 | Multi-Vector Attacker IPs | Auth Log | Return Array of IPs | ✅ PASS | Formatted JSON array returned |
| 08 | SQL Injection Signature | HTTP GET URL | Flag Medium/High Threat | ✅ PASS | Attack pattern highlighted |
| 09 | Empty Input Submission | No Text | Disable Action Button | ✅ PASS | Frontend UI validation active |
| 10 | Missing API Key (.env) | Env Config | Safe Fallback Warning | ✅ PASS | Renders user-friendly error UI |
| 11 | Analyst Verification Lock | HITL Gate | Lock Escalate Button | ✅ PASS | Unlocks only on checkbox state |
| 12 | SOC Alert Escalation | Button Click | State Change Feedback | ✅ PASS | Confirmed SOC status update |
| 13 | Category Filter Toggle | UI Navigation | Filter Preset List | ✅ PASS | Dynamic state re-rendering |
| 14 | Export Report Action | JSON Generation | Download Local File | ✅ PASS | Exports clean JSON report |
| 15 | Accuracy Feedback | Thumbs Up/Down | Record User State | ✅ PASS | Local feedback state stored |

## 3. Hardening Change Made for Demo Reliability
- **Local Client-Side Pre-Sanitization Pipeline:** Implemented regex scrubbing in `src/utils/sanitize.js` to automatically mask credentials prior to AI API invocation. This guarantees zero secret leaks to external model endpoints and eliminates prompt injection vectors through key fields.