import { Crown, Shield, Eye } from 'lucide-react';

export function RoleBadge({ role, size = 'md' }) {
  const isSmall = size === 'sm';

  if (role === 'HOST') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full text-amber-800 bg-amber-100 border border-amber-300 ${
          isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <Crown className={isSmall ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
        HOST
      </span>
    );
  }

  if (role === 'MODERATOR') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full text-indigo-800 bg-indigo-100 border border-indigo-300 ${
          isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <Shield className={isSmall ? 'w-3 h-3 text-indigo-600' : 'w-3.5 h-3.5 text-indigo-600'} />
        MODERATOR
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full text-slate-700 bg-slate-100 border border-slate-300 ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Eye className={isSmall ? 'w-3 h-3 text-slate-500' : 'w-3.5 h-3.5 text-slate-500'} />
      PARTICIPANT
    </span>
  );
}

export default RoleBadge;
