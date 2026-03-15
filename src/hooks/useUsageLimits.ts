'use client';
import { useEffect, useState } from 'react';
import { Plan, PLAN_LIMITS } from '@/types/subscription';

export function useUsageLimits(plan: Plan = 'free') {
  const [usage, setUsage] = useState({ leads_detected: 0, replies_generated: 0, keywords_active: 0 });
  const limits = PLAN_LIMITS[plan];

  useEffect(() => {
    fetch('/api/usage')
      .then(r => r.json())
      .then(data => setUsage(data.usage ?? usage));
  }, []);

  const isAtLimit = (type: 'leads' | 'replies' | 'keywords') => {
    if (type === 'leads')    return usage.leads_detected    >= limits.leads;
    if (type === 'replies')  return usage.replies_generated >= limits.replies;
    if (type === 'keywords') return usage.keywords_active   >= limits.keywords;
    return false;
  };

  return { usage, limits, isAtLimit };
}
