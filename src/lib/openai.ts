import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Enable browser usage
});

export async function generateContent(keyword: string, wordCount: number): Promise<string> {
  const prompt = `Write a comprehensive article about "${keyword}". The article should be informative, engaging, and approximately ${wordCount} words long. Include relevant details and maintain a professional tone.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  return completion.choices[0].message.content || 'Failed to generate content';
}