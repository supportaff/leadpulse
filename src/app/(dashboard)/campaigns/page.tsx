'use client';
import { useState, useEffect } from 'react';
import { Megaphone, Trash2, PauseCircle, PlayCircle, Plus, Loader2, ScanLine } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  keywords: string[];
  subreddits: string[];
  is_active: boolean;
  created_at: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newSubreddits, setNewSubreddits] = useState('');
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState<string | null>(null);
  const [scanMsg, setScanMsg] = useState<{id: string; msg: string; ok: boolean} | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/campaigns')
      .then(r => r.json())
      .then(d => setCampaigns(Array.isArray(d) ? d : d.campaigns ?? []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string, current: boolean) => {
    setCampaigns(cs => cs.map(c => c.id === id ? { ...c, is_active: !current } : c));
    await fetch(`/api/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    });
  };

  const remove = async (id: string) => {
    setCampaigns(cs => cs.filter(c => c.id !== id));
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
  };

  const add = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          keywords: newKeywords.split(',').map(k => k.trim()).filter(Boolean),
          subreddits: newSubreddits.split(',').map(s => s.trim().replace(/^r\//, '')).filter(Boolean),
        }),
      });
      if (res.ok) {
        setNewName(''); setNewKeywords(''); setNewSubreddits(''); setShowForm(false);
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const scan = async (id: string) => {
    setScanning(id);
    setScanMsg(null);
    try {
      const res = await fetch(`/api/campaigns/${id}/scan`, { method: 'POST' });
      const data = await res.json();
      setScanMsg({ id, msg: data.message || `${data.count ?? 0} leads found`, ok: res.ok });
      if (res.ok) load();
    } catch {
      setScanMsg({ id, msg: 'Scan failed. Try again.', ok: false });
    } finally {
      setScanning(null);
      setTimeout(() => setScanMsg(null), 5000);
    }
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? 'Loading...' : `${campaigns.filter(c => c.is_active).length} active · ${campaigns.length} total`}
          </p>
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
            className={inputClass} />
          <input value={newKeywords} onChange={e => setNewKeywords(e.target.value)}
            placeholder="Keywords comma-separated (e.g. CRM, lead generation)"
            className={inputClass} />
          <input value={newSubreddits} onChange={e => setNewSubreddits(e.target.value)}
            placeholder="Subreddits comma-separated (e.g. entrepreneur, startups) — leave blank for auto"
            className={inputClass} />
          <div className="flex gap-3">
            <button onClick={add} disabled={saving}
              className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-5 py-2 rounded-xl hover:bg-gray-100 transition disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white text-sm transition">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="text-white font-semibold">No campaigns yet</p>
            <p className="text-gray-500 text-sm mt-1">Create your first campaign to start scanning Reddit for leads.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition">
            Create Campaign
          </button>
        </div>
      ) : (
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
                {c.keywords.length > 4 && <span className="text-xs text-gray-600">+{c.keywords.length - 4} more</span>}
              </div>

              <div className="text-xs text-gray-600">
                Reddit · {c.subreddits?.length > 0 ? c.subreddits.map(s => `r/${s}`).join(', ') : 'All subreddits'}
              </div>

              {scanMsg?.id === c.id && (
                <p className={`text-xs px-3 py-2 rounded-lg border ${
                  scanMsg.ok ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
                }`}>{scanMsg.msg}</p>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <button onClick={() => scan(c.id)} disabled={scanning === c.id}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition disabled:opacity-40">
                  {scanning === c.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <ScanLine className="w-3.5 h-3.5" />}
                  {scanning === c.id ? 'Scanning...' : 'Scan now'}
                </button>
                <button onClick={() => toggle(c.id, c.is_active)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition">
                  {c.is_active ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                  {c.is_active ? 'Pause' : 'Resume'}
                </button>
                <button onClick={() => remove(c.id)}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition ml-auto">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
