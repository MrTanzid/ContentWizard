import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCVkkK2AST6hcnp-Yg-MnlME41DmS9pKqw');

export async function generateContent(
  keyword: string, 
  wordCount: number,
  tone: string = 'professional',
  format: string = 'article'
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Create a highly engaging, ${tone}-toned ${format} about "${keyword}" that's EXACTLY ${wordCount} words long. This is very important - the final output MUST be ${wordCount} words, no more, no less. Please follow these guidelines:

1. Write in a ${tone} tone while maintaining readability
2. Structure the content appropriately for a ${format} format
3. Include relevant LSI keywords and semantic variations
4. Break content into logical sections with proper transitions
5. Use personal pronouns (I, we, you) and active voice where appropriate
6. Add real-world examples and specific details
7. Incorporate rhetorical questions and dialogue-like elements
8. Vary paragraph lengths and writing rhythm
9. Add emotional triggers and personal insights
10. Maintain proper keyword density without stuffing
11. Ensure the final word count is exactly ${wordCount} words

Make it feel like it was written by a human expert in the field, and remember to make it exactly ${wordCount} words long.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content');
  }
}