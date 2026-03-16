'use client';
import { useState, useMemo } from 'react';
import { Heart, ChevronLeft, ChevronRight, BellRing, Droplets, Sun, Moon, Sparkles } from 'lucide-react';

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function fmt(d: Date) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtShort(d: Date) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const TIPS: Record<string, { icon: string; color: string; title: string; tips: string[] }> = {
  menstrual: {
    icon: '🌸', color: 'border-pink-500/30 bg-pink-500/5', title: 'Menstrual Phase',
    tips: [
      'Use a heating pad for cramps — it relaxes uterine muscles',
      'Eat iron-rich foods: spinach, rajma, jaggery, dates',
      'Stay hydrated — at least 8 glasses of water daily',
      'Light yoga or walking helps reduce bloating',
      'Avoid caffeine — it worsens cramps and mood swings',
      'Get extra rest — your body is working hard',
    ],
  },
  follicular: {
    icon: '☀️', color: 'border-yellow-500/30 bg-yellow-500/5', title: 'Follicular Phase',
    tips: [
      'Energy is rising — great time to start new projects',
      'Eat light, fresh foods: salads, fruits, sprouts',
      'Good time for intense workouts and cardio',
      'Estrogen rising — skin glows naturally, minimal makeup needed',
      'Social and creative energy peaks now',
    ],
  },
  ovulation: {
    icon: '🥚', color: 'border-green-500/30 bg-green-500/5', title: 'Ovulation Phase',
    tips: [
      'Fertile window — highest chance of conception',
      'You may notice clear, stretchy cervical mucus — this is normal',
      'Libido naturally increases during ovulation',
      'Eat zinc-rich foods: pumpkin seeds, eggs, chickpeas',
      'Track any mid-cycle spotting or mild cramps (Mittelschmerz)',
      'Best time for important conversations — communication is sharpest',
    ],
  },
  luteal: {
    icon: '🌙', color: 'border-purple-500/30 bg-purple-500/5', title: 'Luteal Phase',
    tips: [
      'PMS symptoms may appear — be gentle with yourself',
      'Eat magnesium-rich foods: banana, dark chocolate, almonds',
      'Reduce salt to prevent bloating and water retention',
      'Journalling helps process mood changes',
      'Prefer gentle yoga, stretching over intense workouts',
      'Sleep 7–8 hours — progesterone makes you feel tired',
    ],
  },
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export default function PeriodTrackerPage() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [calMonth, setCalMonth] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [calculated, setCalculated] = useState(false);
  const [reminderPhone, setReminderPhone] = useState('');
  const [reminderSaved, setReminderSaved] = useState(false);

  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20';

  const data = useMemo(() => {
    if (!lastPeriod || !calculated) return null;
    const base = new Date(lastPeriod);
    const today = new Date();
    today.setHours(0,0,0,0);

    // Generate next 6 cycles
    const cycles = Array.from({ length: 6 }, (_, i) => {
      const start = addDays(base, i * cycleLength);
      const end = addDays(start, periodLength - 1);
      const ovulStart = addDays(start, cycleLength - 16);
      const ovulEnd = addDays(start, cycleLength - 12);
      const fertileStart = addDays(ovulStart, -2);
      const fertileEnd = addDays(ovulEnd, 1);
      return { start, end, ovulStart, ovulEnd, fertileStart, fertileEnd };
    });

    // Current cycle
    const current = cycles.find(c => today >= c.start && today <= addDays(c.start, cycleLength - 1)) || cycles[0];
    const dayOfCycle = Math.floor((today.getTime() - current.start.getTime()) / 86400000) + 1;
    let phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' = 'follicular';
    if (dayOfCycle <= periodLength) phase = 'menstrual';
    else if (dayOfCycle <= cycleLength - 16) phase = 'follicular';
    else if (dayOfCycle <= cycleLength - 12) phase = 'ovulation';
    else phase = 'luteal';

    const nextPeriod = cycles[1]?.start;
    const daysUntilNext = Math.ceil((nextPeriod.getTime() - today.getTime()) / 86400000);

    return { cycles, current, dayOfCycle, phase, nextPeriod, daysUntilNext };
  }, [lastPeriod, cycleLength, periodLength, calculated]);

  // Calendar logic
  const calDays = useMemo(() => {
    const { y, m } = calMonth;
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = first.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
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

  const today = new Date(); today.setHours(0,0,0,0);

  const phaseInfo = data ? TIPS[data.phase] : null;
  const phasePercent = data ? Math.round((data.dayOfCycle / cycleLength) * 100) : 0;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🌸</span>
          <h1 className="text-2xl font-bold text-white">Period Tracker</h1>
        </div>
        <p className="text-gray-400 text-sm">Enter your last period date — your cycle calendar, phases, and reminders are calculated instantly. No AI needed.</p>
      </div>

      {/* Input Panel */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white">Your Cycle Details</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Last period start date</label>
            <input type="date" value={lastPeriod} onChange={e => { setLastPeriod(e.target.value); setCalculated(false); }} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Average cycle length</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setCycleLength(v => Math.max(21, v - 1))} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10">-</button>
              <span className="text-white font-semibold w-12 text-center">{cycleLength}d</span>
              <button onClick={() => setCycleLength(v => Math.min(40, v + 1))} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10">+</button>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Period duration</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setPeriodLength(v => Math.max(2, v - 1))} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10">-</button>
              <span className="text-white font-semibold w-12 text-center">{periodLength}d</span>
              <button onClick={() => setPeriodLength(v => Math.min(10, v + 1))} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10">+</button>
            </div>
          </div>
        </div>
        <button onClick={() => { if (lastPeriod) setCalculated(true); }}
          disabled={!lastPeriod}
          className="w-full bg-white text-black font-semibold py-3 rounded-2xl hover:bg-gray-100 transition disabled:opacity-40 text-sm">
          Calculate My Cycle →
        </button>
      </div>

      {data && (
        <>
          {/* Phase Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 space-y-1 col-span-2">
              <p className="text-xs text-gray-500">Current Phase</p>
              <p className="text-white font-bold text-lg">{phaseInfo?.title}</p>
              <p className="text-xs text-gray-400">Day {data.dayOfCycle} of {cycleLength}</p>
              <div className="mt-3 h-1.5 bg-white/10 rounded-full">
                <div className="h-1.5 bg-white rounded-full transition-all" style={{ width: `${phasePercent}%` }} />
              </div>
            </div>
            <div className="bg-white/[0.02] border border-pink-500/20 rounded-2xl p-5 space-y-1">
              <p className="text-xs text-gray-500">Next Period</p>
              <p className="text-white font-bold">{fmtShort(data.nextPeriod)}</p>
              <p className="text-xs text-pink-400">in {data.daysUntilNext} days</p>
            </div>
            <div className="bg-white/[0.02] border border-green-500/20 rounded-2xl p-5 space-y-1">
              <p className="text-xs text-gray-500">Fertile Window</p>
              <p className="text-white font-bold text-sm">{fmtShort(data.current.fertileStart)}</p>
              <p className="text-xs text-green-400">to {fmtShort(data.current.fertileEnd)}</p>
            </div>
          </div>

          {/* Phase Timeline */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Cycle Phase Timeline</p>
            <div className="flex rounded-xl overflow-hidden h-8 text-xs font-medium">
              <div className="bg-pink-500/40 flex items-center justify-center text-pink-200" style={{ width: `${(periodLength / cycleLength) * 100}%` }}>Period</div>
              <div className="bg-yellow-500/30 flex items-center justify-center text-yellow-200" style={{ width: `${((cycleLength - 16 - periodLength) / cycleLength) * 100}%` }}>Follicular</div>
              <div className="bg-green-500/40 flex items-center justify-center text-green-200" style={{ width: `${(4 / cycleLength) * 100}%` }}>Ovul.</div>
              <div className="bg-purple-500/30 flex items-center justify-center text-purple-200" style={{ width: `${(14 / cycleLength) * 100}%` }}>Luteal / PMS</div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Day 1</span><span>Day {periodLength}</span><span>Day {cycleLength - 16}</span><span>Day {cycleLength - 12}</span><span>Day {cycleLength}</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-white">{MONTH_NAMES[calMonth.m]} {calMonth.y}</p>
              <div className="flex gap-2">
                <button onClick={() => setCalMonth(p => { const d = new Date(p.y, p.m - 1); return { y: d.getFullYear(), m: d.getMonth() }; })} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setCalMonth(p => { const d = new Date(p.y, p.m + 1); return { y: d.getFullYear(), m: d.getMonth() }; })} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES.map(d => <div key={d} className="text-center text-xs text-gray-600 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (!day) return <div key={i} />;
                const type = getDayType(day);
                const isToday = sameDay(day, today);
                return (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium relative
                    ${ type === 'period' ? 'bg-pink-500/30 text-pink-200' :
                       type === 'ovulation' ? 'bg-green-500/40 text-green-200' :
                       type === 'fertile' ? 'bg-green-500/15 text-green-300' :
                       'text-gray-400 hover:bg-white/5' }
                    ${ isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-black' : '' }
                  `}>
                    {day.getDate()}
                    {type === 'ovulation' && <span className="absolute -top-0.5 -right-0.5 text-[8px]">🥚</span>}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-pink-500/40" />Period</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/20" />Fertile Window</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/40" />Ovulation</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded ring-2 ring-white bg-transparent" />Today</span>
            </div>
          </div>

          {/* Upcoming cycles */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Next 6 Cycles</p>
            <div className="space-y-3">
              {data.cycles.slice(1).map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">Cycle {i + 2}</p>
                    <p className="text-gray-500 text-xs">Period: {fmt(c.start)} — {fmt(c.end)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-xs">Fertile: {fmtShort(c.fertileStart)} – {fmtShort(c.fertileEnd)}</p>
                    <p className="text-yellow-400 text-xs">Ovulation: {fmtShort(c.ovulStart)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Phase Tips */}
          {phaseInfo && (
            <div className={`border ${phaseInfo.color} rounded-2xl p-6 space-y-3`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{phaseInfo.icon}</span>
                <h2 className="text-white font-semibold text-sm">{phaseInfo.title} Tips</h2>
              </div>
              <ul className="space-y-2">
                {phaseInfo.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-gray-500 shrink-0 mt-0.5">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* All Phase Tips */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Cycle Phase Care Guide</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(TIPS).map(([key, val]) => (
                <div key={key} className={`border ${val.color} rounded-xl p-4 space-y-2`}>
                  <div className="flex items-center gap-2">
                    <span>{val.icon}</span>
                    <p className="text-white text-xs font-semibold">{val.title}</p>
                    {data?.phase === key && <span className="text-xs bg-white text-black px-2 py-0.5 rounded-full font-semibold">Now</span>}
                  </div>
                  <ul className="space-y-1">
                    {val.tips.slice(0, 3).map((t, i) => <li key={i} className="text-xs text-gray-400">• {t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Reminder */}
          <div className="bg-white/[0.02] border border-green-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-green-400" />
              <h2 className="text-sm font-semibold text-white">WhatsApp Reminders — ₹0.99 per reminder</h2>
            </div>
            <p className="text-xs text-gray-400">Get period start alerts (3 days before), ovulation window alerts, and PMS tips directly on WhatsApp. Tiny cost, huge value.</p>
            {!reminderSaved ? (
              <div className="flex gap-3">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 text-gray-400 text-sm">
                  <span>+91</span>
                </div>
                <input value={reminderPhone} onChange={e => setReminderPhone(e.target.value.replace(/\D/g,''))}
                  placeholder="9876543210" maxLength={10}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20" />
                <button onClick={() => reminderPhone.length === 10 && setReminderSaved(true)}
                  className="shrink-0 bg-white text-black text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition">
                  Activate
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <span>✅</span> Reminders activated for +91{reminderPhone}! ₹0.99 will be charged per reminder.
              </div>
            )}
            <p className="text-xs text-gray-600">💚 1% of every reminder charge goes to <strong className="text-gray-400">menstrual health NGOs in India</strong>. Your reminder helps someone in need.</p>
          </div>
        </>
      )}
    </div>
  );
}
