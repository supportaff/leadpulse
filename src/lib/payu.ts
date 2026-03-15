import CryptoJS from 'crypto-js'
import { env } from '@/lib/env'

interface PayUOrderParams {
  txnid: string
  amount: string
  productinfo: string
  firstname: string
  email: string
  phone?: string
  surl: string
  furl: string
}

export function generatePayUHash(params: PayUOrderParams): string {
  const hashString = [
    env.payu.merchantKey,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    '', '', '', '', '', '', '', '', '', // udf1-udf10 (empty)
    env.payu.merchantSalt,
  ].join('|')

  return CryptoJS.SHA512(hashString).toString()
}

export function generateTxnId(): string {
  return `LP_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export function verifyPayUHash(params: Record<string, string>): boolean {
  const hashString = [
    env.payu.merchantSalt,
    params.status,
    '', '', '', '', '', '', '', '', '', // udf10-udf1 reversed (empty)
    params.email,
    params.firstname,
    params.productinfo,
    params.amount,
    params.txnid,
    env.payu.merchantKey,
  ].join('|')

  const computedHash = CryptoJS.SHA512(hashString).toString()
  return computedHash === params.hash
}
