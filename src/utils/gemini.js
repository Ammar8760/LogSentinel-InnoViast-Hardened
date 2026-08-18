import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeLogsWithGemini = async (logText) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      data: null,
      error: "⚠️ Fallback Triggered: No Gemini API Key configured in environment variables (.env)."
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Updated to the current standard model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are an expert Cybersecurity Incident Response Analyst.
      Analyze the provided raw server/firewall/auth logs.
      Evaluate threat level, extract attack IPs or vectors, summarize key findings,
      and suggest explicit mitigation steps.
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

      Logs to analyze:
      ${logText}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return { data: parsedData, error: null };

  } catch (err) {
    return {
      data: null,
      error: `⚠️ Safe Fallback Active: AI analysis failed (${err.message}). Manual SOC review required.`
    };
  }
};