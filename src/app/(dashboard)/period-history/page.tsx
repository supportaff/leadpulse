'use client';
import { useState, useMemo } from 'react';
import { Plus, Trash2, TrendingUp, Droplets, Activity } from 'lucide-react';

function addDays(date: Date, days: number) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function fmt(d: Date) { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }

type PeriodRecord = {
  id: string;
  startDate: string;
  endDate: string;
  flow: 'light' | 'medium' | 'heavy';
  pain: 0 | 1 | 2 | 3;
  symptoms: string[];
  notes: string;
};

const FLOW_COLORS: Record<string, string> = {
  light: 'text-pink-300 bg-pink-300/10 border-pink-300/20',
  medium: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  heavy: 'text-pink-500 bg-pink-500/15 border-pink-500/25',
};
const PAIN_LABELS = ['None 😊', 'Mild 😐', 'Moderate 😣', 'Severe 😱'];
const SYMPTOM_OPTIONS = ['Cramps','Bloating','Headache','Mood swings','Fatigue','Back pain','Nausea','Breast tenderness','Acne','Food cravings'];

export default function PeriodHistoryPage() {
  const [records, setRecords] = useState<PeriodRecord[]>([
    { id:'1', startDate:'2026-02-12', endDate:'2026-02-17', flow:'medium', pain:1, symptoms:['Cramps','Fatigue'], notes:'Normal cycle' },
    { id:'2', startDate:'2026-01-15', endDate:'2026-01-20', flow:'heavy', pain:2, symptoms:['Cramps','Mood swings','Bloating'], notes:'Heavier than usual' },
    { id:'3', startDate:'2025-12-18', endDate:'2025-12-23', flow:'medium', pain:1, symptoms:['Fatigue'], notes:'' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate:'', endDate:'', flow:'medium' as PeriodRecord['flow'], pain:0 as PeriodRecord['pain'], symptoms:[] as string[], notes:'' });
  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20';

  function addRecord() {
    if (!form.startDate || !form.endDate) return;
    setRecords(prev => [{ ...form, id: Date.now().toString() }, ...prev]);
    setForm({ startDate:'', endDate:'', flow:'medium', pain:0, symptoms:[], notes:'' });
    setShowForm(false);
  }
  function deleteRecord(id: string) { setRecords(prev => prev.filter(r => r.id !== id)); }
  function toggleSymptom(s: string) { setForm(f => ({ ...f, symptoms: f.symptoms.includes(s) ? f.symptoms.filter(x=>x!==s) : [...f.symptoms, s] })); }

  // Stats
  const stats = useMemo(() => {
    if (records.length < 2) return null;
    const sorted = [...records].sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const cycleLengths: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.round((new Date(sorted[i].startDate).getTime() - new Date(sorted[i-1].startDate).getTime()) / 86400000);
      if (diff > 0 && diff < 60) cycleLengths.push(diff);
    }
    const avgCycle = cycleLengths.length ? Math.round(cycleLengths.reduce((a,b)=>a+b,0)/cycleLengths.length) : null;
    const periodLengths = sorted.map(r => { const s=new Date(r.startDate); const e=new Date(r.endDate); return Math.round((e.getTime()-s.getTime())/86400000)+1; });
    const avgPeriod = Math.round(periodLengths.reduce((a,b)=>a+b,0)/periodLengths.length);
    const avgPain = Math.round((records.reduce((a,b)=>a+b.pain,0)/records.length)*10)/10;
    const topSymptoms = Object.entries(
      records.flatMap(r=>r.symptoms).reduce((acc,s)=>({...acc,[s]:(acc[s]||0)+1}),{} as Record<string,number>)
    ).sort(([,a],[,b])=>b-a).slice(0,4);
    return { avgCycle, avgPeriod, avgPain, topSymptoms, cycleLengths };
  }, [records]);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className="text-2xl">📅</span><h1 className="text-2xl font-bold text-white">Period History</h1></div>
          <p className="text-gray-400 text-sm">Log and track all your past periods. Spot patterns, identify irregularities, and prepare for doctor visits.</p>
        </div>
        <button onClick={()=>setShowForm(!showForm)}
          className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition">
          <Plus className="w-4 h-4"/>Log Period
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white">Log a Period</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block">Start date</label><input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} className={inputClass}/></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">End date</label><input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} className={inputClass}/></div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Flow</label>
            <div className="flex gap-2">
              {(['light','medium','heavy'] as const).map(f=>(
                <button key={f} onClick={()=>setForm(prev=>({...prev,flow:f}))}
                  className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition ${form.flow===f?'border-pink-400/50 bg-pink-500/15 text-pink-300':'border-white/10 text-gray-500 hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Pain level</label>
            <div className="flex gap-2">
              {([0,1,2,3] as const).map(p=>(
                <button key={p} onClick={()=>setForm(prev=>({...prev,pain:p}))}
                  className={`flex-1 py-2 rounded-xl border text-xs transition ${form.pain===p?'border-white/40 bg-white/10 text-white':'border-white/10 text-gray-500 hover:text-white'}`}>
                  {PAIN_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map(s=>(
                <button key={s} onClick={()=>toggleSymptom(s)}
                  className={`px-3 py-1 rounded-full border text-xs transition ${form.symptoms.includes(s)?'border-white/40 bg-white/10 text-white':'border-white/10 text-gray-500 hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div><label className="text-xs text-gray-500 mb-1.5 block">Notes (optional)</label><input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Any additional notes..." className={inputClass}/></div>
          <div className="flex gap-3">
            <button onClick={addRecord} disabled={!form.startDate||!form.endDate}
              className="flex-1 bg-white text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-100 transition disabled:opacity-40">Save Period</button>
            <button onClick={()=>setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4">
            <TrendingUp className="w-4 h-4 text-gray-500 mb-2"/>
            <p className="text-white font-bold text-xl">{stats.avgCycle ?? '--'}<span className="text-gray-500 text-sm font-normal">d</span></p>
            <p className="text-xs text-gray-500">Avg cycle length</p>
          </div>
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4">
            <Droplets className="w-4 h-4 text-pink-400 mb-2"/>
            <p className="text-white font-bold text-xl">{stats.avgPeriod}<span className="text-gray-500 text-sm font-normal">d</span></p>
            <p className="text-xs text-gray-500">Avg period length</p>
          </div>
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4">
            <Activity className="w-4 h-4 text-red-400 mb-2"/>
            <p className="text-white font-bold text-xl">{stats.avgPain}<span className="text-gray-500 text-sm font-normal">/3</span></p>
            <p className="text-xs text-gray-500">Avg pain level</p>
          </div>
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2">Top symptoms</p>
            <div className="space-y-1">{stats.topSymptoms.slice(0,3).map(([s,c])=>(<p key={s} className="text-xs text-white">{s} <span className="text-gray-500">×{c}</span></p>))}</div>
          </div>
        </div>
      )}

      {/* Irregular cycle alert */}
      {stats && stats.cycleLengths.some(c=>c<21||c>35) && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
          <p className="text-yellow-300 text-sm font-semibold">⚠️ Irregular cycle detected</p>
          <p className="text-gray-400 text-xs mt-1">Your cycle length varies outside the 21–35 day normal range. Consider consulting a gynaecologist. This could be due to stress, thyroid, PCOS, or diet changes.</p>
        </div>
      )}

      {/* History list */}
      <div className="space-y-3">
        {records.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No periods logged yet. Click “Log Period” to start.</div>
        )}
        {records.map(r => {
          const days = Math.round((new Date(r.endDate).getTime()-new Date(r.startDate).getTime())/86400000)+1;
          return (
            <div key={r.id} className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-white font-semibold text-sm">{fmt(new Date(r.startDate))} → {fmt(new Date(r.endDate))}</p>
                    <span className="text-xs text-gray-500">{days} days</span>
                    <span className={`px-2 py-0.5 rounded-full border text-xs capitalize ${FLOW_COLORS[r.flow]}`}>{r.flow} flow</span>
                    <span className="text-xs text-gray-500">Pain: {PAIN_LABELS[r.pain]}</span>
                  </div>
                  {r.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {r.symptoms.map(s=><span key={s} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">{s}</span>)}
                    </div>
                  )}
                  {r.notes && <p className="text-xs text-gray-500 mt-2 italic">"{r.notes}"</p>}
                </div>
                <button onClick={()=>deleteRecord(r.id)} className="text-gray-600 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Doctor prep */}
      {records.length >= 3 && (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-white">👩‍⚕️ Doctor Visit Preparation</h2>
          <p className="text-xs text-gray-400">Share this summary with your gynaecologist:</p>
          <div className="bg-white/5 rounded-xl p-4 text-xs text-gray-300 space-y-1 font-mono">
            <p>Period history: {records.length} cycles logged</p>
            {stats?.avgCycle && <p>Average cycle: {stats.avgCycle} days</p>}
            <p>Average period: {stats?.avgPeriod} days</p>
            <p>Pain level (avg): {stats?.avgPain}/3</p>
            <p>Common symptoms: {stats?.topSymptoms.map(([s])=>s).join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
