import { GoogleGenAI } from "@google/genai";
import { Pollutant, ToxicityData } from "../types";

const API_KEY = process.env.API_KEY || ''; 

// Helper to check if key is available
export const isAiAvailable = () => !!API_KEY;

export const generatePollutantSummary = async (pollutant: Pollutant, toxicity: ToxicityData[]): Promise<string> => {
  if (!API_KEY) return "AI Service Unavailable: API Key not configured.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const toxSummary = toxicity.map(t => `- ${t.toxicityType} on ${t.testOrganism}: ${t.endpoint} = ${t.value} ${t.unit}`).join('\n');
    
    const prompt = `
      Act as an ecotoxicologist. Provide a concise risk assessment summary (max 150 words) for the following pollutant found in livestock farming:
      
      Name: ${pollutant.name}
      Category: ${pollutant.category}
      Usage: ${pollutant.usage}
      Risk Level: ${pollutant.riskLevel}
      
      Known Toxicity Data:
      ${toxSummary}

      Focus on environmental impact and potential risks to aquatic life or human health.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary. Please try again later.";
  }
};
