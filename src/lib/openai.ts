import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface IntentScoreResult {
  intent_level: 'high' | 'medium' | 'low';
  score: number;
  reasoning: string;
  matched_signals?: string[];
  is_competitor_mention?: boolean;
  competitor_name?: string | null;
}

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
        content: `You are a helpful sales assistant for ${brandName}. Write a genuine, helpful, non-spammy reply to a social media post. Keep it under 150 words.`,
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
): Promise<IntentScoreResult> {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: [
          'You are an intent scoring engine. Analyze a social media post and return a JSON object with:',
          '- intent_level: "high", "medium", or "low"',
          '- score: number 0-100',
          '- reasoning: one sentence explanation',
          '- matched_signals: array of matched keywords from the provided list',
          '- is_competitor_mention: boolean',
          '- competitor_name: string or null',
          'Respond with raw JSON only.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: `Title: ${postTitle}\nBody: ${postBody}\nKeywords: ${keywords.join(', ')}`,
      },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0].message.content ?? '{}') as IntentScoreResult;
}
