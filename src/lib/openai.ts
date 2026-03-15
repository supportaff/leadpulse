import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateReply(
  postContext: string,
  userProductDescription: string,
  brandName: string
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful sales assistant for ${brandName}. Write a genuine, helpful, non-spammy reply to a social media post. The reply should be conversational, empathetic, and naturally mention how the product can help. Keep it under 150 words.`,
      },
      {
        role: 'user',
        content: `Post:\n${postContext}\n\nOur product: ${userProductDescription}\n\nWrite a helpful reply:`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });
  return completion.choices[0].message.content ?? '';
}

export async function scoreIntent(
  postTitle: string,
  postBody: string,
  keywords: string[]
): Promise<{ intent_level: 'high' | 'medium' | 'low'; score: number; reasoning: string }> {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an intent scoring engine. Analyze a social media post and return a JSON object with: intent_level ("high", "medium", or "low"), score (0-100), and reasoning (one sentence). Respond with raw JSON only.',
      },
      {
        role: 'user',
        content: `Title: ${postTitle}\nBody: ${postBody}\nKeywords tracked: ${keywords.join(', ')}`,
      },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0].message.content ?? '{}');
}
