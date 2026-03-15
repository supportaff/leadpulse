'use client';
import { useState } from 'react';
import { Lead } from '@/types/lead';

interface AIReplyPanelProps {
  lead: Lead;
  productDescription?: string;
}

export function AIReplyPanel({ lead, productDescription = '' }: AIReplyPanelProps) {
  const [reply, setReply] = useState(lead.ai_reply ?? '');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [desc, setDesc] = useState(productDescription);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id, user_product_description: desc }),
      });
      const data = await res.json();
      setReply(data.reply ?? '');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="text-purple-400">✨</span> AI Reply Generator
        </h3>
        {reply && (
          <button
            onClick={copy}
            className="text-xs px-3 py-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400">Your product description (optional)</label>
        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="e.g. A lightweight CRM built for small businesses..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {reply ? (
        <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap border border-gray-700">
          {reply}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-500 text-center border border-dashed border-gray-700">
          Click &ldquo;Generate Reply&rdquo; to create an AI-crafted response.
        </div>
      )}

      <button
        onClick={generate}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? '⏳ Generating...' : reply ? '🔄 Regenerate Reply' : '✨ Generate Reply'}
      </button>
    </div>
  );
}
