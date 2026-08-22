import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { SocketContext } from './SocketContext';
import { UserContext } from './UserContext';
import { connectSocket } from '../services/socket';

export const RoomContext = createContext();

export function RoomProvider({ children }) {
  const { socket } = useContext(SocketContext);
  const { username, sessionToken } = useContext(UserContext);

  const [roomCode, setRoomCode] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [syncTimestamp, setSyncTimestamp] = useState(Date.now());
  const [hostId, setHostId] = useState('');
  const [participants, setParticipants] = useState([]);
  const [userRole, setUserRole] = useState('PARTICIPANT');
  const [chatMessages, setChatMessages] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [kickedMessage, setKickedMessage] = useState('');
  const [errorNotification, setErrorNotification] = useState('');

  const addSystemLog = useCallback((text) => {
    const time = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    setSystemLogs((prev) => [
      ...prev.slice(-49), // Keep last 50 logs
      { id: Date.now() + Math.random(), text, time },
    ]);
  }, []);

  // Helper to ensure we have an active, connected socket instance
  const getConnectedSocket = useCallback(() => {
    return new Promise((resolve, reject) => {
      const s = socket || connectSocket();
      if (s && s.connected) {
        return resolve(s);
      }

      let timeoutId;
      const onConnect = () => {
        clearTimeout(timeoutId);
        s.off('connect', onConnect);
        s.off('connect_error', onError);
        resolve(s);
      };

      const onError = (err) => {
        clearTimeout(timeoutId);
        s.off('connect', onConnect);
        s.off('connect_error', onError);
        reject(new Error(err?.message || 'Failed to connect to socket server'));
      };

      timeoutId = setTimeout(() => {
        s.off('connect', onConnect);
        s.off('connect_error', onError);
        if (s && s.connected) {
          resolve(s);
        } else {
          reject(new Error('Socket connection timeout'));
        }
      }, 5000);

      s.on('connect', onConnect);
      s.once('connect_error', onError);

      if (!s.connected) {
        s.connect();
      }
    });
  }, [socket]);

  // Listen to Socket events when in a room
  useEffect(() => {
    if (!socket) return;

    // Server -> SYNC_STATE
    const handleSyncState = (data) => {
      setRoomCode(data.roomCode);
      setVideoId(data.videoId);
      setIsPlaying(data.isPlaying);
      setCurrentTime(data.currentTime);
      setSyncTimestamp(data.timestamp || Date.now());
      setHostId(data.hostId);
      setParticipants([...(data.participants || [])]);

      // Determine user's own role from roster
      const me = data.participants?.find((p) => p.sessionToken === sessionToken);
      if (me) {
        setUserRole(me.role);
      }
    };

    // Server -> USER_JOINED
    const handleUserJoined = ({ participant, participants: newRoster }) => {
      if (newRoster) setParticipants([...newRoster]);
      addSystemLog(`👋 ${participant.username} joined the watch party.`);
    };

    // Server -> USER_LEFT
    const handleUserLeft = ({ username: leftUsername, participants: newRoster }) => {
      if (newRoster) setParticipants([...newRoster]);
      if (leftUsername) addSystemLog(`🏃 ${leftUsername} left the room.`);
    };

    // Server -> ROLE_UPDATED
    const handleRoleUpdated = ({ targetParticipantId, newRole, participants: newRoster }) => {
      if (newRoster) {
        setParticipants([...newRoster]);
        const me = newRoster.find((p) => p.sessionToken === sessionToken);
        if (me) setUserRole(me.role);
      }
      const targetUser = newRoster?.find((p) => String(p._id) === String(targetParticipantId));
      if (targetUser) {
        addSystemLog(`🛡️ ${targetUser.username}'s role was updated to ${newRole}.`);
      }
    };

    // Server -> PARTICIPANT_REMOVED
    const handleParticipantRemoved = ({ message }) => {
      setKickedMessage(message || 'You have been removed from the room.');
    };

    // Server -> HOST_TRANSFERRED
    const handleHostTransferred = ({ newHostId, participants: newRoster }) => {
      if (newRoster) {
        setParticipants([...newRoster]);
        const me = newRoster.find((p) => p.sessionToken === sessionToken);
        if (me) setUserRole(me.role);
      }
      const newHost = newRoster?.find((p) => String(p._id) === String(newHostId));
      if (newHost) {
        addSystemLog(`👑 ${newHost.username} is now the Host!`);
      }
    };

    // Server -> CHAT_MESSAGE
    const handleChatMessage = (msg) => {
      setChatMessages((prev) => [...prev.slice(-99), msg]);
    };

    // Server -> ERROR
    const handleError = ({ message }) => {
      setErrorNotification(message);
      setTimeout(() => setErrorNotification(''), 4000);
    };

    socket.on('sync_state', handleSyncState);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('role_updated', handleRoleUpdated);
    socket.on('participant_removed', handleParticipantRemoved);
    socket.on('host_transferred', handleHostTransferred);
    socket.on('chat_message', handleChatMessage);
    socket.on('error', handleError);

    return () => {
      socket.off('sync_state', handleSyncState);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('role_updated', handleRoleUpdated);
      socket.off('participant_removed', handleParticipantRemoved);
      socket.off('host_transferred', handleHostTransferred);
      socket.off('chat_message', handleChatMessage);
      socket.off('error', handleError);
    };
  }, [socket, sessionToken, addSystemLog]);

  // Actions to emit socket events
  const joinRoom = useCallback(
    async (targetRoomCode, displayName) => {
      const activeSocket = await getConnectedSocket();
      const nameToUse = displayName || username || localStorage.getItem('synctube_username') || '';

      return new Promise((resolve, reject) => {
        activeSocket.emit(
          'join_room',
          { roomCode: targetRoomCode, username: nameToUse, sessionToken },
          (response) => {
            if (response && response.success) {
              setRoomCode(response.roomCode);
              setUserRole(response.userRole);
              if (response.roomState) {
                setVideoId(response.roomState.videoId);
                setIsPlaying(response.roomState.isPlaying);
                setCurrentTime(response.roomState.currentTime);
                setSyncTimestamp(response.roomState.timestamp || Date.now());
                setHostId(response.roomState.hostId);
                setParticipants([...(response.roomState.participants || [])]);
              }
              resolve(response);
            } else {
              reject(new Error(response?.error || 'Failed to join room'));
            }
          }
        );
      });
    },
    [getConnectedSocket, username, sessionToken]
  );

  const emitPlay = useCallback(
    (time) => {
      if (socket && roomCode) socket.emit('play', { roomCode, currentTime: time });
    },
    [socket, roomCode]
  );

  const emitPause = useCallback(
    (time) => {
      if (socket && roomCode) socket.emit('pause', { roomCode, currentTime: time });
    },
    [socket, roomCode]
  );

  const emitSeek = useCallback(
    (time) => {
      if (socket && roomCode) socket.emit('seek', { roomCode, currentTime: time });
    },
    [socket, roomCode]
  );

  const emitChangeVideo = useCallback(
    (newVideoId) => {
      if (socket && roomCode) socket.emit('change_video', { roomCode, videoId: newVideoId });
    },
    [socket, roomCode]
  );

  const emitAssignRole = useCallback(
    (targetParticipantId, newRole) => {
      if (socket && roomCode)
        socket.emit('assign_role', { roomCode, targetParticipantId, role: newRole });
    },
    [socket, roomCode]
  );

  const emitRemoveParticipant = useCallback(
    (targetParticipantId) => {
      if (socket && roomCode)
        socket.emit('remove_participant', { roomCode, targetParticipantId });
    },
    [socket, roomCode]
  );

  const emitTransferHost = useCallback(
    (targetParticipantId) => {
      if (socket && roomCode) socket.emit('transfer_host', { roomCode, targetParticipantId });
    },
    [socket, roomCode]
  );

  const sendChatMessage = useCallback(
    (text) => {
      if (socket && roomCode && text.trim()) {
        socket.emit('chat_message', { roomCode, text: text.trim() });
      }
    },
    [socket, roomCode]
  );

  const leaveRoom = useCallback(() => {
    if (socket && roomCode) {
      socket.emit('leave_room', { roomCode });
    }
    setRoomCode('');
    setParticipants([]);
    setChatMessages([]);
  }, [socket, roomCode]);

  return (
    <RoomContext.Provider
      value={{
        roomCode,
        videoId,
        isPlaying,
        currentTime,
        syncTimestamp,
        hostId,
        participants,
        userRole,
        chatMessages,
        systemLogs,
        kickedMessage,
        errorNotification,
        joinRoom,
        leaveRoom,
        emitPlay,
        emitPause,
        emitSeek,
        emitChangeVideo,
        emitAssignRole,
        emitRemoveParticipant,
        emitTransferHost,
        sendChatMessage,
        setKickedMessage,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}
