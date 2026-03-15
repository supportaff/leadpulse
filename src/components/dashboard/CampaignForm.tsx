'use client';
import { useState } from 'react';
import { CreateCampaignInput } from '@/types/campaign';

interface CampaignFormProps {
  onSubmit: (data: CreateCampaignInput) => Promise<void>;
  onClose: () => void;
}

export function CampaignForm({ onSubmit, onClose }: CampaignFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<('reddit' | 'twitter')[]>(['reddit', 'twitter']);
  const [subredditsInput, setSubredditsInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addKeyword = () => {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      setKeywords(prev => [...prev, kw]);
    }
    setKeywordInput('');
  };

  const removeKeyword = (kw: string) => setKeywords(prev => prev.filter(k => k !== kw));

  const togglePlatform = (p: 'reddit' | 'twitter') => {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || keywords.length === 0) return;
    setLoading(true);
    try {
      await onSubmit({
        name,
        description: description || undefined,
        keywords,
        platforms,
        subreddits: subredditsInput.split(',').map(s => s.trim()).filter(Boolean),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create New Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Campaign Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              placeholder="e.g. CRM Lead Finder"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Keywords *</label>
            <div className="flex gap-2">
              <input value={keywordInput} onChange={e => setKeywordInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="e.g. crm software"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
              <button type="button" onClick={addKeyword}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                Add
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map(kw => (
                  <span key={kw} className="flex items-center gap-1 px-3 py-1 bg-purple-900/50 border border-purple-700 rounded-full text-xs text-purple-200">
                    {kw}
                    <button type="button" onClick={() => removeKeyword(kw)} className="text-purple-400 hover:text-white ml-1">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Platforms</label>
            <div className="flex gap-3">
              {(['reddit', 'twitter'] as const).map(p => (
                <button key={p} type="button" onClick={() => togglePlatform(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                    platforms.includes(p)
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400'
                  }`}>
                  {p === 'reddit' ? '🟠 Reddit' : '𝕏 Twitter'}
                </button>
              ))}
            </div>
          </div>

          {platforms.includes('reddit') && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Target Subreddits (comma-separated, optional)</label>
              <input value={subredditsInput} onChange={e => setSubredditsInput(e.target.value)}
                placeholder="e.g. entrepreneur, SaaS, smallbusiness"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading || !name || keywords.length === 0}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition">
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
