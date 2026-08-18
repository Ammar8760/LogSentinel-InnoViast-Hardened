# LogSentinel Triage Evaluation Matrix (10 Test Cases) 🧪

| ID | Log Description / Type | Input Snippet | Expected Severity | AI Output | Result |
|---|---|---|---|---|---|
| **TC01** | SSH Brute Force Attack | `Failed password for root from 192.0.2.45 port 49152 ssh2` | HIGH | HIGH (Extracted IP: 192.0.2.45) | **PASS** |
| **TC02** | Payment Credential Leak | `Config Dump: { api_key="sk_live_9988776655" }` | MEDIUM / HIGH | HIGH (Redacted token prior to analysis) | **PASS** |
| **TC03** | Clean Web Server Access | `GET /index.html HTTP/1.1 200` | LOW | LOW (Normal HTTP request) | **PASS** |
| **TC04** | SQL Injection Attempt | `GET /user?id=1' UNION SELECT NULL, username, password FROM users--` | HIGH | HIGH (Identified SQLi Pattern) | **PASS** |
| **TC05** | Corrupted / Incomplete Log | `Jul 29 22:14:01 server [Garbled Text ###]` | UNKNOWN | UNKNOWN (Safely flagged incomplete data) | **PASS** |
| **TC06** | Windows Event Logoff | `Event ID 4647: User initiated logoff` | LOW | LOW (Standard OS event) | **PASS** |
| **TC07** | Firewall Port Scan | `SRC=203.0.113.5 DST=192.168.1.1 PROTO=TCP DPT=80,443,8080,22 SYN_SENT` | HIGH | HIGH (Identified Port Scanning) | **PASS** |
| **TC08** | Unauthorized API Access | `HTTP 403 Forbidden - Endpoint /v1/admin/delete` | MEDIUM | MEDIUM (Potential Privilege Escalation) | **PASS** |
| **TC09** | Application Memory Error | `java.lang.OutOfMemoryError: Java heap space` | LOW / MEDIUM | MEDIUM (Application Instability Alert) | **PASS** |
| **TC10** | Empty Input Submission | ` ` (Whitespace string) | N/A | Prevented execution on client UI | **PASS** |

### Summary
* **Total Evaluated Cases**: 10
* **Pass Rate**: 100%
* **Manual Correction Applied**: Added explicit regex for SQL Injection patterns and explicit whitespace validation on the input form.