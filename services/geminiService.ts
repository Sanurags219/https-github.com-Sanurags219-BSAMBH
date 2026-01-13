import { GoogleGenAI, Type } from "@google/genai";
import { Token } from "../types.ts";

const getAIInstance = () => {
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const getSwapInsights = async (fromToken: Token, toToken: Token, amount: string): Promise<string> => {
  const prompt = `
    As a Web3 DeFi expert specializing in the Base Chain, analyze this swap:
    Swapping ${amount} ${fromToken.symbol} for ${toToken.symbol}.
    - ${fromToken.symbol} Price: $${fromToken.price}
    - ${toToken.symbol} Price: $${toToken.price}
    Provide a 2-sentence strategy insight.
  `;

  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Insight unavailable.";
  } catch (error) {
    console.warn("AI Service Error:", error);
    return "The AI Oracle is taking a break.";
  }
};

export interface TokenConcept {
  name: string;
  symbol: string;
  description: string;
  imagePrompt: string;
}

export const generateTokenConcept = async (vibe: string): Promise<TokenConcept> => {
  try {
    const ai = getAIInstance();
    const prompt = `Concept for Base chain token: "${vibe}". Return JSON with name, symbol, description (max 15 words), imagePrompt.`;
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
          },
          required: ['name', 'symbol', 'description', 'imagePrompt']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    throw new Error("Concept generation failed.");
  }
};

export const generateTokenImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Digital crypto token art: ${prompt}. Professional, vibrant.` }]
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return imagePart?.inlineData ? `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` : 'https://api.dicebear.com/7.x/identicon/svg?seed=fallback';
  } catch (error) {
    return "https://api.dicebear.com/7.x/identicon/svg?seed=fallback";
  }
};