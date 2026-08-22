import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
} from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';

export function PlaybackControls({
  playerInstance,
  duration = 0,
  currentSeekTime = 0,
  onManualSeek,
  onResync,
}) {
  const { isPlaying, play, pause, seek, hasControl } = usePlayer();
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [sliderTime, setSliderTime] = useState(currentSeekTime);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setSliderTime(currentSeekTime);
    }
  }, [currentSeekTime, isDragging]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTogglePlay = () => {
    if (!hasControl) return;
    if (isPlaying) {
      pause(sliderTime);
    } else {
      play(sliderTime);
    }
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setSliderTime(val);
  };

  const handleSliderCommit = () => {
    setIsDragging(false);
    if (hasControl) {
      seek(sliderTime);
    }
    if (onManualSeek) onManualSeek(sliderTime);
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (playerInstance && playerInstance.setVolume) {
      playerInstance.setVolume(val);
      if (val === 0) {
        playerInstance.mute();
        setIsMuted(true);
      } else if (isMuted) {
        playerInstance.unMute();
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (!playerInstance) return;
    if (isMuted) {
      playerInstance.unMute();
      setIsMuted(false);
    } else {
      playerInstance.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="w-full glass-panel border border-slate-200/90 rounded-xl p-3 sm:p-4 space-y-3 bg-white/95 shadow-md">
      {/* Time Progress Slider */}
      <div className="space-y-1">
        <div className="relative group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            disabled={!hasControl}
            value={sliderTime}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            onChange={handleSliderChange}
            onMouseUp={handleSliderCommit}
            onTouchEnd={handleSliderCommit}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:cursor-not-allowed group-hover:h-2 transition-all"
          />
        </div>
        <div className="flex justify-between items-center text-xs text-slate-600 font-mono">
          <span>{formatTime(sliderTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left: Play/Pause & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            disabled={!hasControl}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-md ${
              hasControl
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-indigo-600/20 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
            title={hasControl ? (isPlaying ? 'Pause' : 'Play') : 'Watch only mode'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onResync}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-all"
            title="Force synchronization with host time"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Re-Sync</span>
          </button>

          {!hasControl && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Watch Only Mode</span>
            </div>
          )}
        </div>

        {/* Right: Volume */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-600" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 sm:w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaybackControls;
