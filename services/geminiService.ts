import { GoogleGenAI, Type } from "@google/genai";
import { Token } from "../types.ts";

export interface TokenSuggestion {
  name: string;
  symbol: string;
}

/**
 * Rapidly generates a list of suggested token names and symbols based on a vibe.
 */
export const getTokenSuggestions = async (vibe: string): Promise<TokenSuggestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on this crypto project vibe: "${vibe}", suggest 4 catchy, professional, and unique token names and their 3-5 letter symbols. Return a JSON array of objects with 'name' and 'symbol' keys.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              symbol: { type: Type.STRING },
            },
            required: ['name', 'symbol']
          }
        }
      }
    });
    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Suggestions Error:", error);
    return [];
  }
};

export interface TokenConcept {
  name: string;
  symbol: string;
  description: string;
  imagePrompt: string;
  suggestedVaultDays?: number;
}

/**
 * Completes the token metadata (description, image prompt) for a specific name/symbol choice.
 */
export const completeTokenDetails = async (name: string, symbol: string, vibe: string): Promise<Omit<TokenConcept, 'name' | 'symbol'>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `The user chose the token name "${name}" (${symbol}) for their project with vibe: "${vibe}". 
    Complete the blueprint by providing:
    - description: A visionary summary (max 15 words) that sounds like a serious DeFi project description.
    - imagePrompt: A detailed visual description for a professional 3D crypto icon to be generated later.
    - suggestedVaultDays: A recommended lockup period (7-365 days).
    Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            suggestedVaultDays: { type: Type.INTEGER },
          },
          required: ['description', 'imagePrompt']
        }
      }
    });
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Details Error:", error);
    throw new Error("Failed to finalize protocol details.");
  }
};

/**
 * Provides strategic insights for a swap transaction.
 */
export const getSwapInsights = async (fromToken: Token, toToken: Token, amount: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    As a Web3 DeFi expert specializing in the Base Chain, analyze this swap:
    Swapping ${amount} ${fromToken.symbol} for ${toToken.symbol}.
    - ${fromToken.symbol} Price: $${fromToken.price}
    - ${toToken.symbol} Price: $${toToken.price}
    Provide a concise 2-sentence strategy insight or market context for a user on Base L2.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Insight unavailable at this moment.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Intelligence Oracle temporarily offline.";
  }
};

/**
 * Generates a professional token icon using Gemini 2.5 Flash Image.
 */
export const generateTokenImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A professional, premium crypto token logo, 3D render, minimalist background, centered, high quality, vibrant: ${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return "https://api.dicebear.com/7.x/identicon/svg?seed=fallback";
  } catch (error) {
    console.error("Image Gen Error:", error);
    return "https://api.dicebear.com/7.x/identicon/svg?seed=fallback";
  }
};