import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export const PLAN_LIMITS = {
  free:    { keywords: 2,  leads: 20,  replies: 10 },
  starter: { keywords: 5,  leads: 100, replies: 50 },
  growth:  { keywords: 15, leads: 500, replies: 250 },
  pro:     { keywords: -1, leads: -1,  replies: -1 }, // -1 = unlimited
} as const

export const PLAN_PRICES = {
  starter: { monthly: 14, label: 'Starter' },
  growth:  { monthly: 22, label: 'Growth' },
  pro:     { monthly: 30, label: 'Pro' },
} as const
