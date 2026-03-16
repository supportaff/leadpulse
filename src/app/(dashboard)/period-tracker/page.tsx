'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, BellRing, CheckCircle2 } from 'lucide-react';

function addDays(date: Date, days: number) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function fmt(d: Date) { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function fmtShort(d: Date) { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
function sameDay(a: Date, b: Date) { return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function toKey(d: Date) { return d.toISOString().split('T')[0]; }

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const FLOW_OPTIONS = [
  { value: 'spotting', label: 'Spotting', color: 'bg-pink-200/20 border-pink-200/30 text-pink-200' },
  { value: 'light', label: 'Light', color: 'bg-pink-300/20 border-pink-300/30 text-pink-300' },
  { value: 'medium', label: 'Medium', color: 'bg-pink-500/30 border-pink-500/40 text-pink-300' },
  { value: 'heavy', label: 'Heavy', color: 'bg-pink-600/40 border-pink-600/50 text-pink-200' },
];
const PAIN_OPTIONS = [
  { value: 0, label: 'None', emoji: '😊' },
  { value: 1, label: 'Mild', emoji: '😐' },
  { value: 2, label: 'Moderate', emoji: '😣' },
  { value: 3, label: 'Severe', emoji: '😱' },
];
const SYMPTOM_OPTIONS = ['Cramps','Bloating','Headache','Mood swings','Fatigue','Back pain','Nausea','Breast tenderness','Acne','Food cravings'];

const PHASE_TIPS: Record<string, { icon: string; color: string; title: string; tips: string[]; recommend: string[] }> = {
  menstrual: {
    icon: '🌸', color: 'border-pink-500/30 bg-pink-500/5', title: 'Menstrual Phase (Day 1–' + '5)',
    tips: ['Use heat pad for cramps','Eat iron-rich foods: spinach, dates, rajma','Stay hydrated — 8 glasses/day','Light yoga reduces bloating','Rest more than usual'],
    recommend: ['Avoid caffeine & alcohol','Skip intense workouts','Take iron + Vit C together for absorption','Chamomile tea helps cramps'],
  },
  follicular: {
    icon: '☀️', color: 'border-yellow-500/30 bg-yellow-500/5', title: 'Follicular Phase',
    tips: ['Energy rising — great for new starts','Fresh foods: fruits, salads, sprouts','Best time for intense workouts','Skin naturally glows'],
    recommend: ['Start new habits now — motivation peaks','Eat fermented foods (curd, idli)','Engage in creative projects','Socialize — communication energy is high'],
  },
  ovulation: {
    icon: '🥚', color: 'border-green-500/30 bg-green-500/5', title: 'Ovulation Phase',
    tips: ['Fertile window — peak conception chance','Clear stretchy discharge is normal','Libido naturally increases','Zinc-rich foods: pumpkin seeds, eggs'],
    recommend: ['Track any mid-cycle spotting','Mild cramps (Mittelschmerz) are normal','Best time for important decisions','Drink plenty of water'],
  },
  luteal: {
    icon: '🌙', color: 'border-purple-500/30 bg-purple-500/5', title: 'Luteal / PMS Phase',
    tips: ['PMS symptoms may appear','Magnesium foods: banana, dark chocolate, almonds','Reduce salt to prevent bloating','Gentle yoga over intense workouts'],
    recommend: ['Journal to process mood changes','Sleep 7–8 hours — progesterone causes tiredness','Avoid sugar spikes','Dark chocolate (70%+) reduces cravings safely'],
  },
};

type DayLog = { flow?: string; pain?: number; symptoms?: string[] };

export default function PeriodTrackerPage() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [calculated, setCalculated] = useState(false);
  const [calMonth, setCalMonth] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [logFlow, setLogFlow] = useState('medium');
  const [logPain, setLogPain] = useState(0);
  const [logSymptoms, setLogSymptoms] = useState<string[]>([]);
  const [reminderPhone, setReminderPhone] = useState('');
  const [reminderSaved, setReminderSaved] = useState(false);

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const data = useMemo(() => {
    if (!lastPeriod || !calculated) return null;
    const base = new Date(lastPeriod);
    const cycles = Array.from({ length: 6 }, (_, i) => {
      const start = addDays(base, i * cycleLength);
      const end = addDays(start, periodLength - 1);
      const ovulStart = addDays(start, cycleLength - 16);
      const ovulEnd = addDays(start, cycleLength - 12);
      const fertileStart = addDays(ovulStart, -2);
      const fertileEnd = addDays(ovulEnd, 1);
      return { start, end, ovulStart, ovulEnd, fertileStart, fertileEnd };
    });
    const current = cycles.find(c => today >= c.start && today <= addDays(c.start, cycleLength - 1)) || cycles[0];
    const dayOfCycle = Math.max(1, Math.floor((today.getTime() - current.start.getTime()) / 86400000) + 1);
    let phase: keyof typeof PHASE_TIPS = 'follicular';
    if (dayOfCycle <= periodLength) phase = 'menstrual';
    else if (dayOfCycle <= cycleLength - 16) phase = 'follicular';
    else if (dayOfCycle <= cycleLength - 12) phase = 'ovulation';
    else phase = 'luteal';
    const nextPeriod = cycles[1]?.start;
    const daysUntilNext = Math.ceil((nextPeriod.getTime() - today.getTime()) / 86400000);
    return { cycles, current, dayOfCycle, phase, nextPeriod, daysUntilNext };
  }, [lastPeriod, cycleLength, periodLength, calculated, today]);

  const calDays = useMemo(() => {
    const { y, m } = calMonth;
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const days: (Date | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(y, m, d));
    return days;
  }, [calMonth]);

  function getDayType(day: Date) {
    if (!data) return null;
    for (const c of data.cycles) {
      if (day >= c.start && day <= c.end) return 'period';
      if (day >= c.fertileStart && day <= c.fertileEnd) return 'fertile';
      if (day >= c.ovulStart && day <= c.ovulEnd) return 'ovulation';
    }
    return null;
  }

  function saveLog() {
    if (!selectedDay) return;
    setLogs(prev => ({ ...prev, [selectedDay]: { flow: logFlow, pain: logPain, symptoms: logSymptoms } }));
    setSelectedDay(null);
    setLogSymptoms([]);
    setLogPain(0);
    setLogFlow('medium');
  }

  function toggleSymptom(s: string) {
    setLogSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  const phaseInfo = data ? PHASE_TIPS[data.phase] : null;
  const phasePercent = data ? Math.round((data.dayOfCycle / cycleLength) * 100) : 0;

  // Pain recommendation based on logged pain
  const avgPain = useMemo(() => {
    const vals = Object.values(logs).map(l => l.pain ?? 0);
    return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
  }, [logs]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1"><span className="text-2xl">🌸</span><h1 className="text-2xl font-bold text-white">Period Tracker</h1></div>
        <p className="text-gray-400 text-sm">Log your cycle, track flow & pain on calendar, get personalised care tips.</p>
      </div>

      {/* Setup */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white">Your Cycle Setup</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Last period start date</label>
            <input type="date" value={lastPeriod} onChange={e=>{setLastPeriod(e.target.value);setCalculated(false);}}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-white/20" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Cycle length: <span className="text-white font-semibold">{cycleLength} days</span></label>
            <input type="range" min={21} max={40} value={cycleLength} onChange={e=>setCycleLength(+e.target.value)}
              className="w-full accent-white mt-2" />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>21</span><span>40</span></div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Period duration: <span className="text-white font-semibold">{periodLength} days</span></label>
            <input type="range" min={2} max={10} value={periodLength} onChange={e=>setPeriodLength(+e.target.value)}
              className="w-full accent-white mt-2" />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>2</span><span>10</span></div>
          </div>
        </div>
        <button onClick={()=>{if(lastPeriod)setCalculated(true);}} disabled={!lastPeriod}
          className="w-full bg-white text-black font-semibold py-3 rounded-2xl hover:bg-gray-100 transition disabled:opacity-40 text-sm">
          Calculate & Show Calendar →
        </button>
      </div>

      {data && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Current Phase</p>
              <p className="text-white font-bold text-sm mt-1">{phaseInfo?.title}</p>
              <div className="mt-2 h-1 bg-white/10 rounded-full"><div className="h-1 bg-white rounded-full" style={{width:`${phasePercent}%`}}/></div>
              <p className="text-xs text-gray-600 mt-1">Day {data.dayOfCycle} of {cycleLength}</p>
            </div>
            <div className="bg-white/[0.02] border border-pink-500/20 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Next Period</p>
              <p className="text-white font-bold text-sm mt-1">{fmtShort(data.nextPeriod)}</p>
              <p className="text-xs text-pink-400 mt-1">in {data.daysUntilNext} days</p>
            </div>
            <div className="bg-white/[0.02] border border-green-500/20 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Fertile Window</p>
              <p className="text-white font-bold text-sm mt-1">{fmtShort(data.current.fertileStart)}</p>
              <p className="text-xs text-green-400 mt-1">to {fmtShort(data.current.fertileEnd)}</p>
            </div>
            <div className="bg-white/[0.02] border border-yellow-500/20 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Ovulation</p>
              <p className="text-white font-bold text-sm mt-1">{fmtShort(data.current.ovulStart)}</p>
              <p className="text-xs text-yellow-400 mt-1">peak fertility</p>
            </div>
          </div>

          {/* Interactive Calendar */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-white">{MONTH_NAMES[calMonth.m]} {calMonth.y}</p>
              <div className="flex gap-2">
                <button onClick={()=>setCalMonth(p=>{const d=new Date(p.y,p.m-1);return{y:d.getFullYear(),m:d.getMonth()};})} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"><ChevronLeft className="w-4 h-4"/></button>
                <button onClick={()=>setCalMonth(p=>{const d=new Date(p.y,p.m+1);return{y:d.getFullYear(),m:d.getMonth()};})} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"><ChevronRight className="w-4 h-4"/></button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">Tap any day to log flow, pain & symptoms</p>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES.map(d=><div key={d} className="text-center text-xs text-gray-600 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (!day) return <div key={i}/>;
                const type = getDayType(day);
                const key = toKey(day);
                const logged = logs[key];
                const isToday = sameDay(day, today);
                const isSelected = selectedDay === key;
                return (
                  <button key={i} onClick={()=>{ setSelectedDay(isSelected ? null : key); setLogFlow(logged?.flow||'medium'); setLogPain(logged?.pain??0); setLogSymptoms(logged?.symptoms||[]); }}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium relative transition
                      ${isSelected ? 'ring-2 ring-white bg-white/20' :
                        type==='period' ? 'bg-pink-500/30 text-pink-200 hover:bg-pink-500/40' :
                        type==='ovulation' ? 'bg-green-500/40 text-green-200 hover:bg-green-500/50' :
                        type==='fertile' ? 'bg-green-500/15 text-green-300 hover:bg-green-500/25' :
                        'text-gray-400 hover:bg-white/8'}
                      ${isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-black' : ''}
                    `}>
                    <span>{day.getDate()}</span>
                    {logged && <span className="absolute bottom-0.5 right-0.5 text-[7px] leading-none">
                      {logged.flow==='heavy'?'🔴':logged.flow==='medium'?'🟠':logged.flow==='light'?'🟡':'⚪'}
                    </span>}
                    {type==='ovulation' && <span className="absolute top-0 right-0 text-[8px]">🥚</span>}
                  </button>
                );
              })}
            </div>

            {/* Inline log panel */}
            {selectedDay && (
              <div className="mt-5 bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <p className="text-sm font-semibold text-white">🗓 Log {new Date(selectedDay+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}</p>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Flow intensity</p>
                  <div className="flex gap-2 flex-wrap">
                    {FLOW_OPTIONS.map(f=>(
                      <button key={f.value} onClick={()=>setLogFlow(f.value)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${logFlow===f.value ? f.color : 'border-white/10 text-gray-500 hover:text-white'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Pain level</p>
                  <div className="flex gap-2">
                    {PAIN_OPTIONS.map(p=>(
                      <button key={p.value} onClick={()=>setLogPain(p.value)}
                        className={`flex-1 py-2 rounded-lg border text-xs transition ${logPain===p.value?'border-white/40 bg-white/10 text-white':'border-white/10 text-gray-500 hover:text-white'}`}>
                        {p.emoji} {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Symptoms (select all that apply)</p>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_OPTIONS.map(s=>(
                      <button key={s} onClick={()=>toggleSymptom(s)}
                        className={`px-3 py-1 rounded-full border text-xs transition ${logSymptoms.includes(s)?'border-white/40 bg-white/10 text-white':'border-white/10 text-gray-500 hover:text-white'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveLog} className="flex-1 bg-white text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-100 transition">Save Log</button>
                  <button onClick={()=>setSelectedDay(null)} className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-pink-500/40"/>Period</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/20"/>Fertile</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/40"/>Ovulation</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded ring-2 ring-white bg-transparent"/>Today</span>
              <span className="flex items-center gap-1.5">🔴/🟠/🟡 = logged flow</span>
            </div>
          </div>

          {/* Phase Timeline */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-3">Your Cycle Phases</p>
            <div className="flex rounded-xl overflow-hidden h-8 text-xs font-medium">
              <div className="bg-pink-500/40 flex items-center justify-center text-pink-200" style={{width:`${(periodLength/cycleLength)*100}%`}}>Period</div>
              <div className="bg-yellow-500/30 flex items-center justify-center text-yellow-200" style={{width:`${((cycleLength-16-periodLength)/cycleLength)*100}%`}}>Follicular</div>
              <div className="bg-green-500/40 flex items-center justify-center text-green-200" style={{width:`${(4/cycleLength)*100}%`}}>Ovul.</div>
              <div className="bg-purple-500/30 flex items-center justify-center text-purple-200" style={{width:`${(14/cycleLength)*100}%`}}>Luteal</div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1.5">
              <span>Day 1</span><span>Day {periodLength}</span><span>Day {cycleLength-16}</span><span>Day {cycleLength-12}</span><span>Day {cycleLength}</span>
            </div>
          </div>

          {/* Recommendations based on logs */}
          {Object.keys(logs).length > 0 && (
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white">📊 Personalised Recommendations</h2>
              {avgPain >= 2 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-300 text-sm font-semibold">⚠️ Moderate to severe pain detected</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li>• Apply heat pad on lower abdomen for 15–20 mins</li>
                    <li>• Take Mefenamic acid or Ibuprofen with food (consult doctor)</li>
                    <li>• Consider seeing a gynaecologist — severe cramps may indicate endometriosis</li>
                    <li>• Avoid cold foods & drinks during period days</li>
                  </ul>
                </div>
              )}
              {Object.values(logs).some(l=>l.symptoms?.includes('Fatigue')) && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-yellow-300 text-sm font-semibold">😴 Fatigue logged</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li>• Check iron levels — anaemia is common during heavy periods</li>
                    <li>• Eat dates, jaggery, spinach daily</li>
                    <li>• Take iron supplement with Vitamin C juice (not tea/coffee)</li>
                  </ul>
                </div>
              )}
              {Object.values(logs).some(l=>l.symptoms?.includes('Mood swings')) && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-purple-300 text-sm font-semibold">🌙 Mood swings logged</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li>• Magnesium-rich foods help: banana, dark chocolate, almonds</li>
                    <li>• 10 mins of morning sunlight regulates serotonin</li>
                    <li>• Avoid processed sugar — it worsens mood crashes</li>
                  </ul>
                </div>
              )}
              {Object.values(logs).some(l=>l.flow==='heavy') && (
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
                  <p className="text-pink-300 text-sm font-semibold">🔴 Heavy flow logged</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li>• Track soaking more than 1 pad/hour — see a doctor</li>
                    <li>• Stay hydrated — heavy flow causes dehydration</li>
                    <li>• Eat iron and Vitamin K foods: broccoli, leafy greens</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Phase care guide */}
          {phaseInfo && (
            <div className={`border ${phaseInfo.color} rounded-2xl p-6 space-y-4`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{phaseInfo.icon}</span>
                <h2 className="text-white font-semibold text-sm">You are in {phaseInfo.title}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Care Tips</p>
                  <ul className="space-y-1.5">{phaseInfo.tips.map((t,i)=><li key={i} className="text-xs text-gray-300">• {t}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Recommendations</p>
                  <ul className="space-y-1.5">{phaseInfo.recommend.map((t,i)=><li key={i} className="text-xs text-gray-300">• {t}</li>)}</ul>
                </div>
              </div>
            </div>
          )}

          {/* Next 6 cycles */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Next 6 Cycles</p>
            <div className="space-y-2">
              {data.cycles.slice(1).map((c,i)=>(
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-sm">
                  <div><p className="text-white font-medium">Cycle {i+2}</p><p className="text-gray-500 text-xs">{fmt(c.start)} — {fmt(c.end)}</p></div>
                  <div className="text-right"><p className="text-green-400 text-xs">Fertile: {fmtShort(c.fertileStart)} – {fmtShort(c.fertileEnd)}</p><p className="text-yellow-400 text-xs">Ovulation: {fmtShort(c.ovulStart)}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Reminder */}
          <div className="bg-white/[0.02] border border-green-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-green-400"/>
              <h2 className="text-sm font-semibold text-white">Get WhatsApp Reminders</h2>
            </div>
            <p className="text-xs text-gray-400">Receive period start alerts 3 days before, ovulation window alerts, and phase-specific wellness tips — directly on WhatsApp. Never miss a cycle again.</p>
            {!reminderSaved ? (
              <div className="flex gap-3">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 text-gray-400 text-sm shrink-0">+91</div>
                <input value={reminderPhone} onChange={e=>setReminderPhone(e.target.value.replace(/\D/g,''))}
                  placeholder="9876543210" maxLength={10}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20" />
                <button onClick={()=>reminderPhone.length===10&&setReminderSaved(true)}
                  className="shrink-0 bg-white text-black text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition">
                  Activate
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4"/>
                Reminders activated for +91{reminderPhone}!
              </div>
            )}
            <p className="text-xs text-gray-600">💚 A portion of every subscription goes to <strong className="text-gray-400">menstrual health NGOs in India</strong> — your care helps someone else too.</p>
          </div>
        </>
      )}
    </div>
  );
}
