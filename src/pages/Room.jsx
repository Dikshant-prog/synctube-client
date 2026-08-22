import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Settings, MessageSquare, Send, AlertOctagon } from 'lucide-react';
import Navbar from '../components/Navbar';
import YouTubePlayer from '../components/YouTubePlayer';
import VideoInput from '../components/VideoInput';
import ParticipantList from '../components/ParticipantList';
import HostPanel from '../components/HostPanel';
import { RoomContext } from '../context/RoomContext';
import { UserContext } from '../context/UserContext';
import RoleBadge from '../components/RoleBadge';

export function Room() {
  const navigate = useNavigate();
  const { roomCode: paramCode } = useParams();
  const chatEndRef = useRef(null);

  const { username, updateUsername } = useContext(UserContext);
  const {
    roomCode,
    joinRoom,
    chatMessages,
    systemLogs,
    sendChatMessage,
    kickedMessage,
    errorNotification,
  } = useContext(RoomContext);

  const [activeTab, setActiveTab] = useState('participants'); // 'participants' | 'host' | 'chat'
  const [chatInput, setChatInput] = useState('');
  const [modalName, setModalName] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Handle direct URL navigation /room/:roomCode or page refresh
  useEffect(() => {
    const formattedCode = paramCode ? paramCode.toUpperCase() : '';
    if (!formattedCode) return;

    if (!roomCode || roomCode !== formattedCode) {
      const savedName = username || localStorage.getItem('synctube_username');
      if (savedName) {
        setIsJoining(true);
        joinRoom(formattedCode, savedName)
          .then(() => {
            setShowJoinModal(false);
          })
          .catch((err) => {
            console.error('Auto join error:', err);
            // Only pop up join modal if the room actually doesn't exist
            if (err?.message && err.message.toLowerCase().includes('not found')) {
              setJoinError(err.message);
              setShowJoinModal(true);
            }
          })
          .finally(() => setIsJoining(false));
      } else {
        setShowJoinModal(true);
      }
    }
  }, [paramCode, roomCode, username, joinRoom]);

  // Auto scroll chat to bottom on new message or log
  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, systemLogs, activeTab]);

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalName.trim() || !paramCode) return;

    const name = modalName.trim();
    updateUsername(name);
    setIsJoining(true);
    setJoinError('');

    joinRoom(paramCode.toUpperCase(), name)
      .then(() => {
        setShowJoinModal(false);
      })
      .catch((err) => {
        setJoinError(err.message || 'Failed to join room');
      })
      .finally(() => {
        setIsJoining(false);
      });
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput);
      setChatInput('');
    }
  };

  if (kickedMessage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel bg-white p-8 rounded-3xl border border-red-300 text-center space-y-4 shadow-2xl">
          <AlertOctagon className="w-12 h-12 text-red-600 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-slate-900">Removed from Room</h2>
          <p className="text-sm text-slate-600">{kickedMessage}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Fixed Header */}
      <Navbar />

      {/* Direct Invite Name Prompt Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="max-w-md w-full glass-panel bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Join Watch Party</h3>
              <p className="text-xs text-slate-500">
                You were invited to room <span className="font-mono text-indigo-600 font-bold">{paramCode}</span>
              </p>
            </div>

            {joinError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {joinError}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Enter Your Name</label>
                <input
                  type="text"
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="e.g. Charlie"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-sm rounded-xl transition-all shadow-md"
              >
                {isJoining ? 'Connecting...' : 'Join Room'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Temporary Error Notification Toast */}
      {errorNotification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-red-50 border border-red-300 text-red-800 text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorNotification}</span>
        </div>
      )}

      {/* Main Room Layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column (Sticky Fixed Video Player & Controls - 8 cols) */}
        <section className="lg:col-span-8 lg:sticky lg:top-20 lg:self-start flex flex-col space-y-3 z-30">
          <VideoInput />
          <YouTubePlayer />
        </section>

        {/* Right Column (Participants & Host Controls & Scrollable Chat Sidebar - 4 cols) */}
        <aside className="lg:col-span-4 flex flex-col glass-panel bg-white/95 rounded-2xl border border-slate-200/90 overflow-hidden h-[450px] lg:h-[calc(100vh-6rem)] lg:sticky lg:top-20 shadow-xl">
          {/* Sidebar Tabs Header */}
          <div className="grid grid-cols-3 bg-slate-100/90 border-b border-slate-200 p-1 shrink-0">
            <button
              onClick={() => setActiveTab('participants')}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'participants'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users</span>
            </button>

            <button
              onClick={() => setActiveTab('host')}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'host'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Panel</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>

          {/* Sidebar Tab Contents (Independently Scrollable Container) */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto flex flex-col min-h-0">
            {activeTab === 'participants' && <ParticipantList />}

            {activeTab === 'host' && <HostPanel />}

            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col h-full space-y-3 min-h-0">
                {/* System Activity Log & Scrollable Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-sans text-xs min-h-0">
                  {/* System Activity Logs */}
                  {systemLogs.map((log) => (
                    <div
                      key={log.id}
                      className="px-2.5 py-1.5 bg-indigo-50/80 rounded-lg text-[11px] text-indigo-800 border border-indigo-100 font-mono italic"
                    >
                      {log.text}
                    </div>
                  ))}

                  {/* User Chat Messages */}
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{msg.sender}</span>
                          <RoleBadge role={msg.role} size="sm" />
                        </div>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-slate-800 font-normal leading-relaxed break-words">
                        {msg.text}
                      </p>
                    </div>
                  ))}

                  {chatMessages.length === 0 && systemLogs.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-xs italic">
                      No messages yet. Send a chat message below!
                    </div>
                  )}

                  {/* Anchor for auto-scroll to bottom */}
                  <div ref={chatEndRef} />
                </div>

                {/* Fixed Chat Input Bar at bottom of sidebar */}
                <form
                  onSubmit={handleSendChat}
                  className="flex items-center gap-2 pt-2 border-t border-slate-200 shrink-0"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a chat message..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Room;
