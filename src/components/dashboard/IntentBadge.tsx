export function IntentBadge({ level, score }: { level: string; score: number }) {
  const styles = {
    high:   'bg-white text-black',
    medium: 'bg-white/10 text-white border border-white/20',
    low:    'bg-white/5 text-gray-500 border border-white/10',
  }[level] ?? 'bg-white/5 text-gray-500';

  return (
    <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${styles}`}>
      {score} · {level}
    </span>
  );
}

export default IntentBadge;
