import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// PAYU MODE SWITCH
// NEXT_PUBLIC_PAYU_MODE = test   → uses test.payu.in
// NEXT_PUBLIC_PAYU_MODE = live   → uses secure.payu.in (real money)
// Defaults to 'test' for safety.
//
// Vercel env vars needed:
//   PAYU_MERCHANT_KEY      ← your PayU key (same var, just swap value when going live)
//   PAYU_MERCHANT_SALT     ← your PayU salt
//   NEXT_PUBLIC_PAYU_MODE  ← test | live
// ─────────────────────────────────────────────────────────────────────────────
export const PAYU_MODE = (process.env.NEXT_PUBLIC_PAYU_MODE ?? 'test') as 'test' | 'live';
export const IS_PAYU_LIVE = PAYU_MODE === 'live';

export const PAYU_BASE_URL = IS_PAYU_LIVE
  ? 'https://secure.payu.in/_payment'
  : 'https://test.payu.in/_payment';

export function getMerchantKey() {
  const key = process.env.PAYU_MERCHANT_KEY;
  if (!key) throw new Error('PAYU_MERCHANT_KEY env var not set');
  return key;
}

export function getMerchantSalt() {
  const salt = process.env.PAYU_MERCHANT_SALT;
  if (!salt) throw new Error('PAYU_MERCHANT_SALT env var not set');
  return salt;
}

export interface PayUParams {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
}

export function generatePayUCheckout(params: PayUParams) {
  const { txnid, amount, productinfo, firstname, email, phone, surl, furl } = params;
  const key  = getMerchantKey();
  const salt = getMerchantSalt();

  // PayU hash: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  console.log('[PayU] mode:', PAYU_MODE, '| url:', PAYU_BASE_URL, '| txnid:', txnid, '| amount:', amount);

  return {
    mode: PAYU_MODE,
    action: PAYU_BASE_URL,
    fields: { key, txnid, amount, productinfo, firstname, email, phone, surl, furl, hash },
  };
}

export function verifyPayUHash(params: Record<string, string>): boolean {
  const { key, txnid, amount, productinfo, firstname, email, status, hash } = params;
  const salt = getMerchantSalt();
  const reverseHash = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const computed = crypto.createHash('sha512').update(reverseHash).digest('hex');
  console.log('[PayU Webhook] hash match:', computed === hash);
  return computed === hash;
}
