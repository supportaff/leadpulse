import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { LEAD_COST_INR } from '@/lib/wallet';

const AI_CREDIT_COST = 1;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createSupabaseServerClient();

    const { data: wallet } = await supabase.from('wallets').select('credits').eq('user_id', userId).single();
    if (!wallet || wallet.credits < AI_CREDIT_COST)
      return NextResponse.json({ error: 'Insufficient credits. Please top up your wallet.' }, { status: 402 });

    const { answers } = await req.json();

    const prompt = `You are a certified Indian insurance advisor (IRDAI licensed). A user has provided the following information:

Age: ${answers.age || 'Not provided'}
Dependents: ${answers.dependents || 'Not provided'}
Annual Income: ₹${answers.income || 'Not provided'}
Existing Insurance: ${answers.existing || 'None'}
Health Conditions: ${answers.health || 'None'}
Total Liabilities: ₹${answers.liabilities || '0'}
Primary Goal: ${answers.goal || 'Family protection'}

Provide a detailed, practical insurance recommendation covering:
1. Term Life Insurance — recommended cover amount and why
2. Health Insurance — recommended cover, family floater vs individual
3. Critical Illness / Accident cover if needed
4. Investment-linked insurance (ULIP/endowment) — recommend or avoid and why
5. Suggested Indian insurance providers for each category (LIC, HDFC Life, Star Health, etc.)
6. Estimated annual premium for each
7. Priority order — what to buy first given their budget

Be specific, practical, and tailored for an Indian family. Give rupee amounts.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const geminiData = await geminiRes.json();
    const plan = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!plan) throw new Error('AI did not return a response');

    await supabase.from('wallets').update({ credits: wallet.credits - AI_CREDIT_COST }).eq('user_id', userId);
    await supabase.from('wallet_transactions').insert({
      user_id: userId,
      amount_inr: -(AI_CREDIT_COST * LEAD_COST_INR),
      credits_added: -AI_CREDIT_COST,
      status: 'ai_usage',
      payu_txn_id: `AI_INS_${userId}_${Date.now()}`,
    });

    return NextResponse.json({ plan, creditsRemaining: wallet.credits - AI_CREDIT_COST });
  } catch (err) {
    console.error('[Insurance Plan AI]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
