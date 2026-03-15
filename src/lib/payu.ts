import crypto from 'crypto';
import { env } from '@/lib/env';

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
  const key = env.payu.merchantKey;
  const salt = env.payu.merchantSalt;

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  return {
    action: env.payu.baseUrl,
    fields: { key, txnid, amount, productinfo, firstname, email, phone, surl, furl, hash },
  };
}

export function verifyPayUHash(params: Record<string, string>): boolean {
  const { key, txnid, amount, productinfo, firstname, email, status, hash, salt: _salt } = params;
  const salt = env.payu.merchantSalt;
  const reverseHash = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const computed = crypto.createHash('sha512').update(reverseHash).digest('hex');
  return computed === hash;
}
