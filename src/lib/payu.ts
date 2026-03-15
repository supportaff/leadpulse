import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// PAYU MODE SWITCH
// Set NEXT_PUBLIC_PAYU_MODE=live in Vercel env to go live.
// Defaults to 'test' so you never accidentally charge real money in dev.
// ─────────────────────────────────────────────────────────────────────────────
export const PAYU_MODE = (process.env.NEXT_PUBLIC_PAYU_MODE ?? 'test') as 'test' | 'live';
export const IS_PAYU_LIVE = PAYU_MODE === 'live';

export const PAYU_BASE_URL = IS_PAYU_LIVE
  ? 'https://secure.payu.in/_payment'
  : 'https://test.payu.in/_payment';

// Subscription portal base (PayU My Subscriptions)
export const PAYU_SUB_BASE = IS_PAYU_LIVE
  ? 'https://v.payu.in'
  : 'https://test.payu.in';

function getMerchantKey() {
  const key = IS_PAYU_LIVE
    ? process.env.PAYU_MERCHANT_KEY_LIVE
    : process.env.PAYU_MERCHANT_KEY_TEST;
  if (!key) throw new Error(`PayU merchant key not set for mode: ${PAYU_MODE}`);
  return key;
}

function getMerchantSalt() {
  const salt = IS_PAYU_LIVE
    ? process.env.PAYU_MERCHANT_SALT_LIVE
    : process.env.PAYU_MERCHANT_SALT_TEST;
  if (!salt) throw new Error(`PayU merchant salt not set for mode: ${PAYU_MODE}`);
  return salt;
}

interface PayUParams {
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

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  return {
    mode: PAYU_MODE,
    action: PAYU_BASE_URL,
    fields: { key, txnid, amount, productinfo, firstname, email, phone, surl, furl, hash, service_provider: 'payu_paisa' },
  };
}

export function verifyPayUHash(params: Record<string, string>): boolean {
  const { key, txnid, amount, productinfo, firstname, email, status, hash } = params;
  const salt = getMerchantSalt();
  const reverseHash = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const computed = crypto.createHash('sha512').update(reverseHash).digest('hex');
  return computed === hash;
}
