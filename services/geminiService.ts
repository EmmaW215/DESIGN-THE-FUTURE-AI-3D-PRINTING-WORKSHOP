
import { GoogleGenAI } from "@google/genai";

export const getProjectIdea = async (interest: string, levelName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as a Boutique 3D Printing & AI STEM Educator for kids aged 8-14. 
  A student is interested in "${interest}" and is in the "${levelName}" class. 
  
  Suggest ONE specific, printable 3D design project. 
  
  Context for suggestions:
  - LEVEL 1 (EXPLORER): Focus on 3D Pens or simple shapes.
  - LEVEL 2 (APPRENTICE): Focus on functional Tinkercad/CAD gear (tags, organizers).
  - LEVEL 3 (AI PRO INVENTOR): Mention using Generative AI tools like Meshy.ai or Luma AI to create a complex mesh.
  
  Keep it under 50 words. Be high-energy, futuristic, and encouraging!`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Let's build something futuristic together!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating idea. But trust us, it will be amazing!";
  }
};
