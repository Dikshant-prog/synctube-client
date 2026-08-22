import { useEffect, useRef, useState, useCallback } from 'react';
import { loadYouTubeIframeApi } from '../services/youtube';
import { usePlayer } from '../hooks/usePlayer';
import PlaybackControls from './PlaybackControls';
import { VolumeX, Loader2 } from 'lucide-react';

export function YouTubePlayer() {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const isRemoteAction = useRef(false);
  const currentLoadedVideoId = useRef(null);
  const isPlayerReady = useRef(false);
  const lastRecordedHostTime = useRef(0);
  const lastRecordedHostTimestamp = useRef(Date.now());

  const {
    videoId,
    isPlaying,
    currentTime: serverTime,
    syncTimestamp,
    hasControl,
    play: emitPlay,
    pause: emitPause,
    seek: emitSeek,
  } = usePlayer();

  // Always keep refs up-to-date with latest context values
  const videoIdRef = useRef(videoId);
  const isPlayingRef = useRef(isPlaying);
  const serverTimeRef = useRef(serverTime);
  const syncTimestampRef = useRef(syncTimestamp);
  const hasControlRef = useRef(hasControl);
  const emitPlayRef = useRef(emitPlay);
  const emitPauseRef = useRef(emitPause);
  const emitSeekRef = useRef(emitSeek);

  useEffect(() => {
    videoIdRef.current = videoId;
    isPlayingRef.current = isPlaying;
    serverTimeRef.current = serverTime;
    syncTimestampRef.current = syncTimestamp;
    hasControlRef.current = hasControl;
    emitPlayRef.current = emitPlay;
    emitPauseRef.current = emitPause;
    emitSeekRef.current = emitSeek;
  }, [videoId, isPlaying, serverTime, syncTimestamp, hasControl, emitPlay, emitPause, emitSeek]);

  const [duration, setDuration] = useState(0);
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [needsUnmute, setNeedsUnmute] = useState(false);

  // Helper to calculate expected current video playback time
  const getExpectedTime = useCallback(() => {
    const currentPlaying = isPlayingRef.current;
    const sTime = serverTimeRef.current || 0;
    const sStamp = syncTimestampRef.current || Date.now();
    if (!currentPlaying) return sTime;
    const elapsed = (Date.now() - sStamp) / 1000;
    return Math.max(0, sTime + elapsed);
  }, []);

  // Helper to detect when Host/Moderator seeks using YouTube native player controls or keyboard
  const checkHostNativeSeek = useCallback(() => {
    if (!hasControlRef.current || !playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;

    const actualCurrentTime = playerRef.current.getCurrentTime() || 0;
    const isCurrentlyPlaying = isPlayingRef.current;
    
    // Calculate expected linear time based on previous recording
    const elapsedSec = isCurrentlyPlaying ? (Date.now() - lastRecordedHostTimestamp.current) / 1000 : 0;
    const expectedLinearTime = lastRecordedHostTime.current + elapsedSec;

    const jumpDistance = Math.abs(actualCurrentTime - expectedLinearTime);

    // If time jumped by > 1.5s while not undergoing remote action, Host seeked via native YouTube controls!
    if (jumpDistance > 1.5 && !isRemoteAction.current) {
      lastRecordedHostTime.current = actualCurrentTime;
      lastRecordedHostTimestamp.current = Date.now();
      emitSeekRef.current(actualCurrentTime);
    } else {
      lastRecordedHostTime.current = actualCurrentTime;
      lastRecordedHostTimestamp.current = Date.now();
    }
  }, []);

  // Helper to safely trigger playVideo with browser autoplay fallback (mute on block)
  const safePlayVideo = useCallback((player) => {
    if (!player || typeof player.playVideo !== 'function') return;
    try {
      const res = player.playVideo();
      if (res && typeof res.catch === 'function') {
        res.catch(() => {
          if (typeof player.mute === 'function') player.mute();
          if (typeof player.playVideo === 'function') player.playVideo();
          setNeedsUnmute(true);
        });
      }
    } catch (e) {
      try {
        if (typeof player.mute === 'function') player.mute();
        if (typeof player.playVideo === 'function') player.playVideo();
        setNeedsUnmute(true);
      } catch (err) {
        // Player not ready
      }
    }
  }, []);

  // Sync state & video ID with player instance
  const syncPlayerState = useCallback(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady.current || typeof player.getPlayerState !== 'function') return;

    const targetVideoId = videoIdRef.current;
    if (!targetVideoId) return;

    isRemoteAction.current = true;
    const expectedTime = getExpectedTime();

    // 1. If Video ID changed or differs from currently loaded video, load correct video
    if (currentLoadedVideoId.current !== targetVideoId) {
      currentLoadedVideoId.current = targetVideoId;
      if (typeof player.loadVideoById === 'function') {
        player.loadVideoById({
          videoId: targetVideoId,
          startSeconds: expectedTime,
        });
        if (isPlayingRef.current) {
          safePlayVideo(player);
        }
      }
    } else {
      // 2. Check time drift (> 1.8s)
      const localTime = player.getCurrentTime() || 0;
      if (Math.abs(localTime - expectedTime) > 1.8) {
        if (typeof player.seekTo === 'function') {
          player.seekTo(expectedTime, true);
        }
      }
    }

    // 3. Play or Pause based on current state
    const currentPState = player.getPlayerState();
    if (isPlayingRef.current) {
      if (currentPState !== 1) {
        safePlayVideo(player);
      }
    } else {
      if (currentPState === 1 && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
    }

    setTimeout(() => {
      isRemoteAction.current = false;
    }, 800);
  }, [getExpectedTime, safePlayVideo]);

  // 1. Initialize YouTube Player instance ONCE when videoId becomes available
  useEffect(() => {
    if (!videoId) return;

    let isSubscribed = true;
    currentLoadedVideoId.current = videoId;

    loadYouTubeIframeApi().then((YT) => {
      if (!isSubscribed || !containerRef.current || playerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          disablekb: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (!isSubscribed) return;
            isPlayerReady.current = true;
            setDuration(event.target.getDuration() || 0);

            const initialTime = getExpectedTime();
            if (initialTime > 0) {
              event.target.seekTo(initialTime, true);
            }

            if (isPlayingRef.current) {
              safePlayVideo(event.target);
            } else {
              event.target.pauseVideo();
            }
          },
          onStateChange: (event) => {
            if (!isSubscribed) return;

            // Check if Host/Moderator used native player controls to seek timeline
            if (hasControlRef.current) {
              checkHostNativeSeek();
            }

            // Ensure playback starts if host/moderator is playing and video finished buffering/cuing
            if (isPlayingRef.current && (event.data === 5 || event.data === -1)) {
              safePlayVideo(event.target);
            }

            if (isRemoteAction.current) {
              return;
            }

            // Auto resync after buffering finishes if drift > 2.0s
            if (event.data === YT.PlayerState.PLAYING) {
              const localTime = event.target.getCurrentTime() || 0;
              const expected = getExpectedTime();
              if (Math.abs(localTime - expected) > 2.0) {
                isRemoteAction.current = true;
                event.target.seekTo(expected, true);
                setTimeout(() => {
                  isRemoteAction.current = false;
                }, 800);
              }
            }

            if (hasControlRef.current) {
              const currentTime = event.target.getCurrentTime();
              if (event.data === YT.PlayerState.PLAYING) {
                emitPlayRef.current(currentTime);
              } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                emitPauseRef.current(currentTime);
              }
            }
          },
        },
      });
    });

    return () => {
      isSubscribed = false;
      isPlayerReady.current = false;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore cleanup error
        }
        playerRef.current = null;
      }
    };
  }, [videoId]); // Initialize when videoId is populated

  // 2. React to State changes (videoId, isPlaying, serverTime, syncTimestamp)
  useEffect(() => {
    syncPlayerState();
  }, [videoId, isPlaying, serverTime, syncTimestamp, syncPlayerState]);

  // 3. Continuous background drift monitor & timeline slider updater (every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (player && isPlayerReady.current && typeof player.getCurrentTime === 'function') {
        const time = player.getCurrentTime() || 0;
        setLocalCurrentTime(time);
        if (typeof player.getDuration === 'function') {
          setDuration(player.getDuration() || 0);
        }

        // Check if Host used native YouTube controls to seek
        if (hasControlRef.current) {
          checkHostNativeSeek();
        }

        // Auto resync if local time drifted from expected server time by > 2.0s
        // Avoid seeking if player is currently ended (0) or paused (2)
        const pState = typeof player.getPlayerState === 'function' ? player.getPlayerState() : -1;
        if (isPlayingRef.current && !isRemoteAction.current && pState !== 0 && pState !== 2) {
          const expected = getExpectedTime();
          const drift = Math.abs(time - expected);
          if (drift > 2.0) {
            isRemoteAction.current = true;
            player.seekTo(expected, true);
            setTimeout(() => {
              isRemoteAction.current = false;
            }, 800);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getExpectedTime, hasControl, checkHostNativeSeek]);

  const handleUnmute = () => {
    if (playerRef.current && typeof playerRef.current.unMute === 'function') {
      playerRef.current.unMute();
      playerRef.current.setVolume(100);
      setNeedsUnmute(false);
    }
  };

  const forceResync = () => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      isRemoteAction.current = true;
      playerRef.current.seekTo(getExpectedTime(), true);
      if (isPlayingRef.current) {
        safePlayVideo(playerRef.current);
      } else {
        playerRef.current.pauseVideo();
      }
      setTimeout(() => {
        isRemoteAction.current = false;
      }, 500);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Unmute Prompt Banner if Autoplay started muted */}
      {needsUnmute && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg border border-indigo-500 animate-bounce">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <VolumeX className="w-4 h-4 text-amber-300" />
            <span>Video muted due to browser autoplay policies. Click to enable sound!</span>
          </div>
          <button
            onClick={handleUnmute}
            className="px-3 py-1 bg-white text-indigo-700 font-bold text-xs rounded-lg hover:bg-slate-100 transition-all shadow"
          >
            Unmute Audio
          </button>
        </div>
      )}

      {/* Main Video IFrame Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-slate-300 shadow-xl bg-black group flex items-center justify-center">
        {!videoId ? (
          <div className="flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-xs font-medium">Connecting to Watch Party...</span>
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full" />
        )}

        {/* Overlay guard for non-moderators to block direct youtube iframe click interrupts */}
        {!hasControl && videoId && (
          <div
            className="absolute inset-0 bg-transparent z-10"
            title="Watch party playback is synchronized by Host"
          />
        )}
      </div>

      {/* Custom Playback Controls Bar */}
      <PlaybackControls
        playerInstance={playerRef.current}
        duration={duration}
        currentSeekTime={localCurrentTime}
        onResync={forceResync}
      />
    </div>
  );
}

export default YouTubePlayer;
