import OpenAI from 'openai'
import { env } from '@/lib/env'

export const openai = new OpenAI({ apiKey: env.openai.apiKey })

const INTENT_SYSTEM_PROMPT = `
You are an expert sales intelligence AI for LeadPulse.
Analyze social media posts and determine BUYER INTENT.

Scoring Rules:
- HIGH (70-100): Explicitly asks for a recommendation, tool, service, or solution.
  Examples: "Looking for a CRM", "best email marketing tool?", "Need landing page builder"
- MEDIUM (40-69): Discusses a problem implying need for a solution, or comparing options.
  Examples: "Our email open rates are terrible", "switching from HubSpot"
- LOW (0-39): General discussion, venting, education, no buying signal.

Return ONLY valid JSON:
{
  "score": <0-100>,
  "level": "high" | "medium" | "low",
  "reason": "<one sentence>",
  "matched_signals": ["<signal1>", "<signal2>"],
  "is_competitor_mention": <boolean>,
  "competitor_name": "<name or null>"
}
`.trim()

export async function scoreIntent(
  postTitle: string,
  postBody: string,
  keywords: string[]
): Promise<{
  score: number
  level: 'high' | 'medium' | 'low'
  reason: string
  matched_signals: string[]
  is_competitor_mention: boolean
  competitor_name: string | null
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: INTENT_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Tracked Keywords: ${keywords.join(', ')}\n\nPost Title: ${postTitle}\nPost Body: ${postBody.slice(0, 1000)}\n\nAnalyze for buyer intent.`,
      },
    ],
    temperature: 0.2,
    max_tokens: 300,
  })
  return JSON.parse(response.choices[0].message.content!)
}

const REPLY_SYSTEM_PROMPT = `
You are a conversion-focused outreach specialist.
Write a natural, helpful reply to a social media post where the user seeks a solution.

Rules:
1. Sound human and casual - NOT like an ad
2. Acknowledge what they specifically asked for
3. Briefly mention how the product solves their exact problem
4. End with a soft CTA (offer to share more)
5. Max 4 sentences
6. No emojis unless the original post used them
7. Never start with "Hey there!" or generic openers
`.trim()

export async function generateReply(
  postBody: string,
  productDescription: string,
  productName = 'LeadPulse'
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: REPLY_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Product: ${productName}\nDescription: ${productDescription}\n\nOriginal Post:\n"${postBody.slice(0, 800)}"\n\nWrite a reply.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  })
  return response.choices[0].message.content!.trim()
}
