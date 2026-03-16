import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { LEAD_COST_INR } from '@/lib/wallet';

const AI_CREDIT_COST = 1;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'GEMINI_API_KEY not configured.' }, { status: 500 });

    const supabase = createSupabaseServerClient();
    const { data: wallet } = await supabase.from('wallets').select('credits').eq('user_id', userId).single();
    if (!wallet || wallet.credits < AI_CREDIT_COST)
      return NextResponse.json({ error: 'Insufficient credits. Please top up your wallet.' }, { status: 402 });

    const { lastPeriod, cycleLength, periodLength, symptoms } = await req.json();

    const next = new Date(lastPeriod);
    next.setDate(next.getDate() + Number(cycleLength));
    const ovulation = new Date(lastPeriod);
    ovulation.setDate(ovulation.getDate() + Number(cycleLength) - 14);

    const prompt = `You are a women's health advisor. Analyse this menstrual cycle data:
Last period: ${lastPeriod}
Cycle length: ${cycleLength} days
Period duration: ${periodLength} days
Symptoms: ${symptoms || 'none mentioned'}

Provide:
1. Next period date and fertile window
2. Ovulation date
3. 3 tips for symptoms mentioned
4. Foods to eat this cycle
5. When to see a doctor (red flags)
Be warm, concise, India-relevant. Max 200 words.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    );
    const geminiData = await geminiRes.json();
    if (!geminiRes.ok || geminiData?.error) return NextResponse.json({ error: `Gemini error: ${geminiData?.error?.message}` }, { status: 500 });
    const plan = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!plan) return NextResponse.json({ error: 'No response from AI.' }, { status: 500 });

    await supabase.from('wallets').update({ credits: wallet.credits - AI_CREDIT_COST }).eq('user_id', userId);
    await supabase.from('wallet_transactions').insert({ user_id: userId, amount_inr: -(AI_CREDIT_COST * LEAD_COST_INR), credits_added: -AI_CREDIT_COST, status: 'ai_usage', payu_txn_id: `AI_PERIOD_${userId}_${Date.now()}` });

    return NextResponse.json({ plan, creditsRemaining: wallet.credits - AI_CREDIT_COST, nextPeriod: next.toDateString(), ovulation: ovulation.toDateString() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
