import { useState, useContext } from 'react';
import {
  Users,
  Shield,
  UserX,
  ArrowRightLeft,
  MoreVertical,
  ShieldAlert,
} from 'lucide-react';
import { RoomContext } from '../context/RoomContext';
import { UserContext } from '../context/UserContext';
import RoleBadge from './RoleBadge';
import { isHost } from '../utils/permissions';

export function ParticipantList() {
  const {
    participants,
    userRole,
    emitAssignRole,
    emitRemoveParticipant,
    emitTransferHost,
  } = useContext(RoomContext);

  const { sessionToken } = useContext(UserContext);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const amIHost = isHost(userRole);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Participants ({participants.length})</span>
        </div>
        <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
          Live Roster
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto max-h-[380px] pr-1">
        {participants.map((p) => {
          const isMe = p.sessionToken === sessionToken;

          return (
            <div
              key={p._id}
              className={`relative flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                isMe
                  ? 'bg-indigo-50/80 border-indigo-200 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {/* User Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center">
                    {p.username.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      p.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {p.username}
                    </span>
                    {isMe && (
                      <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-1.5 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <div>
                    <RoleBadge role={p.role} size="sm" />
                  </div>
                </div>
              </div>

              {/* Host Actions Menu Button */}
              {amIHost && !isMe && (
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(p._id)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Manage participant"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === p._id && (
                    <div className="absolute right-0 top-7 z-50 w-48 py-1.5 glass-panel bg-white border border-slate-200 rounded-xl shadow-xl space-y-0.5">
                      {/* Toggle Moderator Role */}
                      {p.role === 'PARTICIPANT' ? (
                        <button
                          onClick={() => {
                            emitAssignRole(p._id, 'MODERATOR');
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                        >
                          <Shield className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Promote to Moderator</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            emitAssignRole(p._id, 'PARTICIPANT');
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Demote to Participant</span>
                        </button>
                      )}

                      {/* Transfer Host */}
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Transfer Host ownership to ${p.username}? You will become a Moderator.`
                            )
                          ) {
                            emitTransferHost(p._id);
                            setActiveMenuId(null);
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                        <span>Transfer Host Role</span>
                      </button>

                      {/* Kick Participant */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${p.username} from the watch party?`)) {
                            emitRemoveParticipant(p._id);
                            setActiveMenuId(null);
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium border-t border-slate-100 mt-1 pt-1.5"
                      >
                        <UserX className="w-3.5 h-3.5 text-red-600" />
                        <span>Remove / Kick</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ParticipantList;
