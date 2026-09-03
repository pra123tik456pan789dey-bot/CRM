"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function summarizeCall(transcript: string) {
  if (process.env.GEMINI_API_KEY === undefined || process.env.GEMINI_API_KEY === "") {
    return "AI Feature is disabled: Gemini API Key is missing in .env file.";
  }

  try {
    console.log("Using API Key:", process.env.GEMINI_API_KEY?.substring(0, 5) + "...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful sales assistant. Summarize the following sales call transcript in 3 bullet points focusing on client needs and next steps. Transcript:\n\n${transcript}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating summary. Make sure your Gemini API key is valid.";
  }
}

export async function analyzeWhatsAppMessage(messageText: string) {
  if (process.env.GEMINI_API_KEY === undefined || process.env.GEMINI_API_KEY === "") {
    return { intent: "NEUTRAL", summary: "AI Disabled" };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an AI assistant classifying incoming WhatsApp messages for a CRM.
    Read this message from a customer and classify their intent into ONE of these categories:
    - INTERESTED: They want to know more, buy, or ask about pricing/demos.
    - NOT_INTERESTED: They want you to stop messaging, they are not interested, or refuse.
    - NEUTRAL: Just saying hi, ok, thanks, or unclear.

    Also provide a very short 1-sentence summary of what they said.

    Message: "${messageText}"
    
    Respond EXACTLY in this JSON format, nothing else:
    {"intent": "INTERESTED", "summary": "customer wants pricing"}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Remove markdown code blocks if AI added them
    let cleanText = text;
    if (text.startsWith("\`\`\`json")) {
      cleanText = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (text.startsWith("\`\`\`")) {
      cleanText = text.replace(/\`\`\`/g, "").trim();
    }

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Classification Error:", error);
    return { intent: "NEUTRAL", summary: "Failed to classify" };
  }
}
