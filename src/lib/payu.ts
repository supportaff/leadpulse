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

function sha512(input: string): string {
  return crypto.createHash('sha512').update(input).digest('hex');
}

export function generatePayUCheckout(params: PayUParams) {
  const { txnid, amount, productinfo, firstname, email, phone, surl, furl } = params;
  const key = env.payu.merchantKey;
  const salt = env.payu.merchantSalt;

  // PayU hash: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  const hash = sha512(hashString);

  return {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    surl,
    furl,
    hash,
    paymentUrl: env.payu.baseUrl,
  };
}

export function verifyPayUHash(params: Record<string, string>): boolean {
  const { key, txnid, amount, productinfo, firstname, email, status, hash } = params;
  const salt = env.payu.merchantSalt;
  // Reverse hash for verification: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const computed = sha512(hashString);
  return computed === hash;
}
