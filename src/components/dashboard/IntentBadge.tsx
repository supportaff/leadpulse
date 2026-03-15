interface IntentBadgeProps { level: 'high' | 'medium' | 'low'; }

export function IntentBadge({ level }: IntentBadgeProps) {
  const styles = {
    high:   'bg-green-500/20 text-green-400 border border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low:    'bg-gray-500/20  text-gray-400  border border-gray-500/30',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${styles[level]}`}>
      {level}
    </span>
  );
}

export default IntentBadge;
