import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { LEAD_COST_INR } from '@/lib/wallet';

const AI_CREDIT_COST = 1;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in environment variables.' }, { status: 500 });
    }

    const supabase = createSupabaseServerClient();

    const { data: wallet } = await supabase.from('wallets').select('credits').eq('user_id', userId).single();
    if (!wallet || wallet.credits < AI_CREDIT_COST)
      return NextResponse.json({ error: 'Insufficient credits. Please top up your wallet.' }, { status: 402 });

    const { income, expenses, loans } = await req.json();
    const surplus = Number(income) - Number(expenses) - loans.reduce((s: number, l: { emi: string }) => s + Number(l.emi || 0), 0);

    const prompt = `You are a certified Indian financial advisor. A user has shared their financial data:

Monthly Income: ₹${income}
Monthly Expenses (excl. EMIs): ₹${expenses}
Monthly Surplus after EMIs: ₹${surplus}

Loans:
${loans.map((l: { name: string; balance: string; emi: string; rate: string }, i: number) =>
  `${i + 1}. ${l.name}: Outstanding ₹${l.balance}, EMI ₹${l.emi}/month, Interest ${l.rate}% p.a.`
).join('\n')}

Provide a practical, step-by-step debt repayment plan. Include:
1. Which loan to close first and why (avalanche or snowball method recommendation)
2. Monthly allocation strategy for each loan
3. Estimated months to become debt-free
4. Specific actionable tips to accelerate repayment
5. What to do with surplus after debt-free

Be specific with rupee amounts. Keep it practical for an Indian salaried professional.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const geminiData = await geminiRes.json();
    console.log('[Debt Plan Gemini Response]', JSON.stringify(geminiData, null, 2));

    if (!geminiRes.ok || geminiData?.error) {
      const msg = geminiData?.error?.message || `Gemini API error ${geminiRes.status}`;
      return NextResponse.json({ error: `Gemini error: ${msg}` }, { status: 500 });
    }

    const finishReason = geminiData?.candidates?.[0]?.finishReason;
    if (finishReason === 'SAFETY') {
      return NextResponse.json({ error: 'Response blocked by Gemini safety filters. Try rephrasing your input.' }, { status: 500 });
    }

    const plan = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!plan) {
      return NextResponse.json({ error: `No response from Gemini. Finish reason: ${finishReason || 'unknown'}` }, { status: 500 });
    }

    await supabase.from('wallets').update({ credits: wallet.credits - AI_CREDIT_COST }).eq('user_id', userId);
    await supabase.from('wallet_transactions').insert({
      user_id: userId,
      amount_inr: -(AI_CREDIT_COST * LEAD_COST_INR),
      credits_added: -AI_CREDIT_COST,
      status: 'ai_usage',
      payu_txn_id: `AI_DEBT_${userId}_${Date.now()}`,
    });

    return NextResponse.json({ plan, creditsRemaining: wallet.credits - AI_CREDIT_COST });
  } catch (err) {
    console.error('[Debt Plan AI]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
