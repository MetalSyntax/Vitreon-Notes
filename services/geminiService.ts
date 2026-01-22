import { GoogleGenAI, Type } from "@google/genai";
import { Note } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNoteSummaryAndTags = async (noteContent: string): Promise<{ summary: string; tags: string[] }> => {
    if (!process.env.API_KEY) {
        console.warn("No API Key found. Returning mock AI response.");
        return new Promise(resolve => setTimeout(() => resolve({
            summary: "AI Assistant is unavailable without an API Key. This is a placeholder summary.",
            tags: ["demo", "no-key", "placeholder"]
        }), 1000));
    }

    try {
        const model = "gemini-3-flash-preview"; 
        const prompt = `
        Analyze the following note content. 
        1. Provide a concise 1-sentence summary.
        2. Generate up to 4 relevant short tags (hashtags without the #).
        
        Note Content:
        ${noteContent.substring(0, 5000)}
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.STRING,
                            description: "The summary text."
                        },
                        tags: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            },
                            description: "The list of tags."
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("Empty response");
        
        const result = JSON.parse(text);
        return {
            summary: result.summary || "Could not generate summary.",
            tags: result.tags || []
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to consult AI Assistant.");
    }
};