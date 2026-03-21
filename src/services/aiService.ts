import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateProfessionalSummary = async (jobTitle: string, skills: string[]): Promise<string> => {
  try {
    const prompt = `Write a professional resume summary for a ${jobTitle}. 
    ${skills.length > 0 ? `Incorporate some of these key skills: ${skills.join(', ')}.` : ''}
    The summary should be concise, impactful, and around 3-4 sentences long. Do not include any introductory or concluding remarks, just the summary text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || '';
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
};

export const generateExperienceDescription = async (jobTitle: string, company: string): Promise<string> => {
  try {
    const prompt = `Write 3-4 professional bullet points describing the responsibilities and achievements of a ${jobTitle} at ${company}.
    Focus on action verbs and measurable results.
    Do not include any introductory or concluding remarks, just the bullet points starting with a dash (-).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || '';
  } catch (error) {
    console.error("Error generating experience description:", error);
    throw new Error("Failed to generate description");
  }
};

export const generateProjectDescription = async (projectName: string, technologies: string): Promise<string> => {
  try {
    const prompt = `Write 3-4 professional bullet points describing a project named "${projectName}". 
    ${technologies ? `The project used the following technologies: ${technologies}.` : ''}
    Focus on action verbs, technical implementation, and measurable results.
    Do not include any introductory or concluding remarks, just the bullet points starting with a dash (-).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || '';
  } catch (error) {
    console.error("Error generating project description:", error);
    throw new Error("Failed to generate description");
  }
};
