import { GoogleGenAI, Type } from "@google/genai";
import { Token } from "../types.ts";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const cleanJson = (str: string) => {
  return str.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const getSwapInsights = async (fromToken: Token, toToken: Token, amount: string): Promise<string> => {
  const prompt = `
    As a Web3 DeFi expert specializing in the Base Chain, analyze this swap:
    Swapping ${amount} ${fromToken.symbol} for ${toToken.symbol}.
    - ${fromToken.symbol} Price: $${fromToken.price}
    - ${toToken.symbol} Price: $${toToken.price}
    Provide a concise 2-sentence strategy insight or market context.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Insight unavailable at this moment.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "DeFi Intelligence Oracle is temporarily offline.";
  }
};

export interface TokenConcept {
  name: string;
  symbol: string;
  description: string;
  imagePrompt: string;
  suggestedVaultDays?: number;
}

export const generateTokenConcept = async (vibe: string): Promise<TokenConcept> => {
  try {
    const ai = getAI();
    const prompt = `Generate a creative crypto token concept for a Clanker-style launch on Base Chain based on this vibe: "${vibe}". Return JSON with name, symbol, description (max 15 words), a detailed visual prompt for an image generator, and suggested vaultDays (7-365).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            symbol: { type: Type.STRING },
            description: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            suggestedVaultDays: { type: Type.INTEGER },
          },
          required: ['name', 'symbol', 'description', 'imagePrompt']
        }
      }
    });
    
    const rawText = response.text || "{}";
    const cleanedJsonStr = cleanJson(rawText);
    return JSON.parse(cleanedJsonStr);
  } catch (error) {
    console.error("Concept Gen Error:", error);
    throw new Error("Failed to materialize the concept.");
  }
};

export const generateTokenImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-quality, professional crypto token icon, 3D render, minimalist background, neon accents, centered: ${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return "https://api.dicebear.com/7.x/identicon/svg?seed=fallback";
  } catch (error) {
    console.error("Image Gen Error:", error);
    return "https://api.dicebear.com/7.x/identicon/svg?seed=fallback";
  }
};