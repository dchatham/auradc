import { GoogleGenAI, Type } from "@google/genai";
import { AuraReading } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        auraColorInsight: {
            type: Type.STRING,
            description: "A description of the user's dominant aura color and what it signifies. Should be mystical and insightful. e.g., 'Your aura glows with a vibrant indigo...'"
        },
        futureGlimpse: {
            type: Type.STRING,
            description: "A short, positive, and slightly vague glimpse into the user's near future. e.g., 'A wave of creative energy is approaching...'"
        },
        angelNumber: {
            type: Type.INTEGER,
            description: "A significant 3 or 4 digit 'angel number' for the user, like 444, 777, or 1111."
        },
        spiritualGuidance: {
            type: Type.STRING,
            description: "A piece of actionable spiritual advice or a mantra for the user to reflect on. e.g., 'Embrace spontaneity. Your spirit guides urge you to trust your intuition...'"
        },
        primaryColors: {
            type: Type.ARRAY,
            description: "An array of exactly three hex color codes (as strings, e.g., '#FF5733') representing the most dominant colors in the user's aura.",
            items: {
                type: Type.STRING
            }
        },
    },
    required: ["auraColorInsight", "futureGlimpse", "angelNumber", "spiritualGuidance", "primaryColors"]
};

export const getAuraReading = async (base64ImageData: string): Promise<AuraReading> => {
    const imagePart = {
        inlineData: {
            data: base64ImageData.split(',')[1],
            mimeType: 'image/jpeg'
        }
    };

    const textPart = {
        text: "You are a mystical aura reader. Analyze the colors, mood, and expression in this person's image to provide a spiritual reading. Identify the three most dominant aura colors and provide their hex codes. Then, generate the full aura reading in the requested JSON format. Be creative, positive, and majestic."
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            }
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation to ensure the parsed object matches the expected structure
        if (
            typeof parsedJson.auraColorInsight === 'string' &&
            typeof parsedJson.futureGlimpse === 'string' &&
            typeof parsedJson.angelNumber === 'number' &&
            typeof parsedJson.spiritualGuidance === 'string' &&
            Array.isArray(parsedJson.primaryColors) &&
            parsedJson.primaryColors.every((c: any) => typeof c === 'string')
        ) {
            return parsedJson as AuraReading;
        } else {
            throw new Error("Parsed JSON does not match AuraReading schema");
        }
    } catch (error) {
        console.error("Error generating aura reading from Gemini:", error);
        throw new Error("Failed to get aura reading from the generative model.");
    }
};
