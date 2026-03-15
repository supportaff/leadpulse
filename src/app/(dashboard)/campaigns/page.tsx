'use client';
import { useState } from 'react';
import { dummyCampaigns } from '@/lib/dummy-data';
import { Megaphone, Trash2, PauseCircle, PlayCircle, Plus } from 'lucide-react';

type Campaign = typeof dummyCampaigns[0] & { is_active: boolean };

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    dummyCampaigns.map(c => ({ ...c, is_active: true }))
  );
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKeywords, setNewKeywords] = useState('');

  const toggle = (id: string) =>
    setCampaigns(cs => cs.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));

  const remove = (id: string) =>
    setCampaigns(cs => cs.filter(c => c.id !== id));

  const add = () => {
    if (!newName.trim()) return;
    setCampaigns(cs => [...cs, {
      id: Date.now().toString(),
      user_id: 'dummy_user_001',
      name: newName.trim(),
      description: '',
      keywords: newKeywords.split(',').map(k => k.trim()).filter(Boolean),
      platforms: ['reddit'],
      subreddits: [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]);
    setNewName('');
    setNewKeywords('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-400 text-sm mt-1">{campaigns.filter(c => c.is_active).length} active · {campaigns.length} total</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black text-sm font-semibold px-4 py-2 rounded-xl transition">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {showForm && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">New Campaign</h2>
          <input value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Campaign name (e.g. B2B SaaS Buyers)"
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30" />
          <input value={newKeywords} onChange={e => setNewKeywords(e.target.value)}
            placeholder="Keywords comma-separated (e.g. CRM, lead generation, HubSpot alternative)"
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30" />
          <div className="flex gap-3">
            <button onClick={add} className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-xl hover:bg-gray-100 transition">Create</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white text-sm transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 space-y-4 hover:border-white/20 transition">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white text-sm">{c.name}</h3>
                {c.description && <p className="text-gray-500 text-xs mt-0.5">{c.description}</p>}
              </div>
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium border ${
                c.is_active ? 'text-white border-white/20 bg-white/5' : 'text-gray-600 border-white/5 bg-white/[0.02]'
              }`}>{c.is_active ? '● Active' : 'Paused'}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {c.keywords.slice(0, 4).map(kw => (
                <span key={kw} className="text-xs bg-white/5 border border-white/8 text-gray-400 px-2 py-0.5 rounded-full">{kw}</span>
              ))}
              {c.keywords.length > 4 && (
                <span className="text-xs text-gray-600">+{c.keywords.length - 4} more</span>
              )}
            </div>

            <div className="text-xs text-gray-600">Reddit · {c.subreddits.length > 0 ? c.subreddits.join(', ') : 'All subreddits'}</div>

            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <button onClick={() => toggle(c.id)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition">
                {c.is_active ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                {c.is_active ? 'Pause' : 'Resume'}
              </button>
              <button onClick={() => remove(c.id)} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition ml-auto">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
