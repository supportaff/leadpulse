import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { LEAD_COST_INR } from '@/lib/wallet';

const AI_CREDIT_COST = 1; // 1 credit = ₹10 per AI response

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createSupabaseServerClient();

    // Check wallet balance
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

    // Call Gemini API
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

    // Deduct credit
    await supabase.from('wallets').update({ credits: wallet.credits - AI_CREDIT_COST }).eq('user_id', userId);

    // Log transaction
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
