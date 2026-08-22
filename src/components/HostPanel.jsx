import { useContext } from 'react';
import { Settings, ShieldCheck, Film } from 'lucide-react';
import { RoomContext } from '../context/RoomContext';
import { canControlPlayback, isHost } from '../utils/permissions';

export function HostPanel() {
  const { userRole, emitChangeVideo, videoId } = useContext(RoomContext);

  const canControl = canControlPlayback(userRole);
  const host = isHost(userRole);

  const sampleVideos = [
    { title: 'Lofi Hip Hop Radio 24/7', id: 'jfKfPfyJRdk' },
    { title: 'Nature 4K Relaxation Video', id: 'BHACKCNDMW8' },
    { title: 'Synthwave Neon Drive', id: '4xDzrJKXOOY' },
  ];

  if (!canControl) {
    return (
      <div className="p-4 glass-panel rounded-xl border border-slate-200 text-center space-y-2 bg-white">
        <ShieldCheck className="w-8 h-8 text-indigo-600 mx-auto opacity-80" />
        <h4 className="text-xs font-semibold text-slate-800">Participant View</h4>
        <p className="text-[11px] text-slate-600">
          Playback and video selection are synchronized by the Host & Moderators. Enjoy the stream!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm px-1">
        <Settings className="w-4 h-4 text-indigo-600" />
        <span>{host ? 'Host Control Center' : 'Moderator Panel'}</span>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Your Role Status:</span>
          <span className="font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
            {userRole}
          </span>
        </div>

        {/* Preset Video Shortcuts */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Film className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick Video Presets</span>
          </div>

          <div className="space-y-1">
            {sampleVideos.map((vid) => (
              <button
                key={vid.id}
                onClick={() => emitChangeVideo(vid.id)}
                disabled={videoId === vid.id}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${
                  videoId === vid.id
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-semibold'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="truncate">{vid.title}</span>
                {videoId === vid.id && (
                  <span className="text-[10px] text-emerald-600 font-bold ml-1 shrink-0">
                    Playing
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostPanel;
