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

    const { lmp, edd, name, age, firstPregnancy, concerns } = await req.json();
    const week = Math.floor((Date.now() - new Date(lmp).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const trimester = week <= 12 ? '1st' : week <= 27 ? '2nd' : '3rd';

    const prompt = `You are a caring Indian pregnancy health advisor. Details:
Mother: ${name || 'User'}, Age: ${age || 'not given'}, First pregnancy: ${firstPregnancy}
LMP: ${lmp}, EDD: ${edd}, Currently: Week ${week} (${trimester} trimester)
Concerns: ${concerns || 'none'}

Provide a warm, practical plan covering:
1. Baby development this week (size, milestones)
2. Doctor visits due now and next 4 weeks
3. Tests/scans due this trimester
4. Diet tips (Indian foods: dal, milk, spinach)
5. Warning signs to watch for
6. Self-care tip for this week
7. WhatsApp reminder schedule (what reminders to expect)
Be warm, simple, encouraging. Max 250 words. India-specific advice.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    );
    const geminiData = await geminiRes.json();
    if (!geminiRes.ok || geminiData?.error) return NextResponse.json({ error: `Gemini error: ${geminiData?.error?.message}` }, { status: 500 });
    const plan = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!plan) return NextResponse.json({ error: 'No response from AI.' }, { status: 500 });

    await supabase.from('wallets').update({ credits: wallet.credits - AI_CREDIT_COST }).eq('user_id', userId);
    await supabase.from('wallet_transactions').insert({ user_id: userId, amount_inr: -(AI_CREDIT_COST * LEAD_COST_INR), credits_added: -AI_CREDIT_COST, status: 'ai_usage', payu_txn_id: `AI_PREG_${userId}_${Date.now()}` });

    return NextResponse.json({ plan, creditsRemaining: wallet.credits - AI_CREDIT_COST, week, trimester, edd });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
