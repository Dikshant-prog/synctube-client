import { useState } from 'react';
import { Youtube, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { extractVideoId } from '../utils/extractVideoId';
import { usePlayer } from '../hooks/usePlayer';

export function VideoInput() {
  const [inputUrl, setInputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { hasVideoControl, changeVideo } = usePlayer();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasVideoControl) return;

    const parsedId = extractVideoId(inputUrl);
    if (!parsedId) {
      setErrorMsg('Invalid YouTube URL or Video ID');
      return;
    }

    setErrorMsg('');
    changeVideo(parsedId);
    setInputUrl('');
  };

  if (!hasVideoControl) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 shadow-sm">
        <Lock className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Only Host and Moderators can change the YouTube video.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-red-600 pointer-events-none">
          <Youtube className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={inputUrl}
          onChange={(e) => {
            setInputUrl(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          placeholder="Paste YouTube Video URL or Video ID (e.g., https://www.youtube.com/watch?v=...)"
          className="w-full pl-11 pr-24 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-mono shadow-sm"
        />

        <button
          type="submit"
          disabled={!inputUrl.trim()}
          className="absolute right-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1 shadow-md shadow-indigo-600/20"
        >
          <span>Load</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 px-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </form>
  );
}

export default VideoInput;
