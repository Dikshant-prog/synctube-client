import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyRoomButton({ roomCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg transition-all group font-mono text-sm shadow-sm"
      title="Copy Room Code"
    >
      <span className="font-bold tracking-wider text-indigo-600">{roomCode}</span>
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
      ) : (
        <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
      )}
    </button>
  );
}

export default CopyRoomButton;
