
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ErrorCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model,
    contents: `Analyze the following text for grammatical errors, spelling mistakes, punctuation issues, and stylistic improvements. 
    Provide a detailed breakdown of each issue and a fully corrected version of the text.
    
    Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedFullText: { type: Type.STRING },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING, description: "The exact word or phrase that is incorrect" },
                replacement: { type: Type.STRING, description: "The corrected version" },
                explanation: { type: Type.STRING, description: "Syntactic explanation of the error" },
                category: { 
                  type: Type.STRING, 
                  enum: Object.values(ErrorCategory),
                  description: "The type of error" 
                },
                context: { type: Type.STRING, description: "Small snippet of text around the error for locating it" }
              },
              required: ["original", "replacement", "explanation", "category", "context"]
            }
          },
          statistics: {
            type: Type.OBJECT,
            properties: {
              wordCount: { type: Type.INTEGER },
              characterCount: { type: Type.INTEGER },
              readabilityScore: { type: Type.STRING },
              tone: { type: Type.STRING }
            },
            required: ["wordCount", "characterCount", "readabilityScore", "tone"]
          }
        },
        required: ["correctedFullText", "issues", "statistics"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return {
    ...result,
    originalText: text
  };
};
