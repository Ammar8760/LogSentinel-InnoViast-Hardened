
# 🛡️ LogSentinel-InnoViast — AI Security Operations Workspace

> **Week 6 Final Enhancement & Showcase Project** | **Track:** AI Solutions Engineering (Track 03)
> 
> 
> **Author:** Ammar
> **Internship:** AI Chatbot Developer Intern at Innoviast

LogSentinel-InnoViast is an enterprise-grade AI log triage and sanitization workspace built to help SOC analysts rapidly detect, scrub, and escalate security incidents while enforcing zero-trust data privacy boundaries.

---

## 🎥 Project Demo & Presentation

* **📺 Demo Video:** [Watch Local Demo Video](https://drive.google.com/file/d/1ZpYhhW7IxL9mGRPgZGYt1bTjMUfUH-7F/view?usp=sharing)
* **📊 Presentation Deck:** Available in repository as `LogSentinel_Presentation_Deck.pdf`


---

## 🔥 Key Hardening Features (Week 6)

* **Client-Side Regex Sanitization Boundary:** Automatically redacts sensitive API keys (`sk_live_...`), auth headers, and tokens before sending log payloads to external AI endpoints.


* **Human-in-the-Loop (HITL) Gatekeeping:** Requires explicit analyst confirmation via interactive UI controls before an alert can be escalated to the SOC.


* **Interactive Fleet Presets:** Pre-loaded real-world attack vectors (SSH Brute Force, Credential Leaks, Syslogs) for rapid testing.


* **Analyst Feedback & Export Engine:** Allows analysts to rate AI triage accuracy (Thumbs Up/Down) and download structured JSON analysis reports.


* **Built-in QA Audit Drawer:** Interactive modal displaying the 15-case evaluation matrix directly within the application.



---

## 💻 Tech Stack & Tools

* **Frontend:** React, Vite, Tailwind CSS


* **AI Model:** Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` SDK


* **Icons & Styling:** Lucide React, Custom Dark/Slate Cyber Theme


* **Deployment / Setup:** Local Node.js Development & Production Ready



---

## 🛠️ Local Setup & Installation

1. **Clone the Repository:**
git clone https://github.com/Ammar8760/LogSentinel-InnoViast-Hardened.git
cd LogSentinel-InnoViast
2. **Install Dependencies:**
npm install
3. **Configure Environment Variables:**
Create a `.env` file in the root directory and add your Gemini API Key:
VITE_GEMINI_API_KEY=your_gemini_api_key_here
4. **Run Local Development Server:**
npm run dev
Open `http://localhost:5173` in your browser.

---

## 🧪 QA & Evaluation Summary

The project has undergone an expanded **15-case evaluation test** covering prompt injection, credential masking, corrupted inputs, and UI gatekeeping logic.

* **Full Matrix Details:** See [`EVALUATION.md`]

* **Safety & AI Guardrails:** See [`AI_USAGE.md`]


---

## 📜 License & Acknowledgments

Built for the **Innoviast AI Development Internship (Week 6 Final Showcase)**.

