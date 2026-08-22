import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tv, LogOut } from 'lucide-react';
import { RoomContext } from '../context/RoomContext';
import { SocketContext } from '../context/SocketContext';
import CopyRoomButton from './CopyRoomButton';
import { isHost } from '../utils/permissions';

export function Navbar() {
  const navigate = useNavigate();
  const { roomCode, userRole, leaveRoom } = useContext(RoomContext);
  const { isConnected } = useContext(SocketContext);

  const handleLeave = () => {
    leaveRoom();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Sync<span className="text-indigo-600">Tube</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
              Watch Party
            </span>
          </div>
        </Link>

        {/* Center: Room Code Pill (Only for Host) */}
        {roomCode && isHost(userRole) && (
          <div className="flex items-center gap-2 sm:gap-3">
            <CopyRoomButton roomCode={roomCode} />
          </div>
        )}

        {/* Right: User status & actions */}
        <div className="flex items-center gap-3">
          {/* Socket status dot */}
          <div
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200"
            title={isConnected ? 'Connected to WebSocket' : 'Connecting/Disconnected'}
          >
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-semibold hidden md:inline">Live</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-700 font-semibold hidden md:inline">Connecting</span>
              </>
            )}
          </div>

          {roomCode && (
            <button
              onClick={handleLeave}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-all"
              title="Leave Room"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
