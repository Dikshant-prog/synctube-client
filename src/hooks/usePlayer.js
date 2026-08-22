import { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';
import { canControlPlayback, canChangeVideo, canManageUsers } from '../utils/permissions';

export function usePlayer() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('usePlayer must be used within a RoomProvider');
  }

  const {
    userRole,
    emitPlay,
    emitPause,
    emitSeek,
    emitChangeVideo,
  } = context;

  const hasControl = canControlPlayback(userRole);
  const hasVideoControl = canChangeVideo(userRole);
  const hasAdminControl = canManageUsers(userRole);

  return {
    ...context,
    hasControl,
    hasVideoControl,
    hasAdminControl,
    play: (time) => hasControl && emitPlay(time),
    pause: (time) => hasControl && emitPause(time),
    seek: (time) => hasControl && emitSeek(time),
    changeVideo: (id) => hasVideoControl && emitChangeVideo(id),
  };
}
