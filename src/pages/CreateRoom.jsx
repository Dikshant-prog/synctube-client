import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, User, Youtube, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import { RoomContext } from '../context/RoomContext';
import { createRoomApi } from '../services/api';
import { extractVideoId } from '../utils/extractVideoId';

export function CreateRoom() {
  const navigate = useNavigate();
  const { updateUsername, sessionToken } = useContext(UserContext);
  const { joinRoom } = useContext(RoomContext);

  const [displayName, setDisplayName] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMsg('Please enter a display name.');
      return;
    }

    let initialVideoId = 'dQw4w9WgXcQ';
    if (videoInput.trim()) {
      const parsedId = extractVideoId(videoInput);
      if (!parsedId) {
        setErrorMsg('Invalid YouTube URL or Video ID');
        return;
      }
      initialVideoId = parsedId;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      updateUsername(displayName.trim());
      const response = await createRoomApi(displayName.trim(), sessionToken, initialVideoId);

      if (response && response.roomCode) {
        // Connect via socket
        await joinRoom(response.roomCode, displayName.trim());
        navigate(`/room/${response.roomCode}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Create room error:', err);
      setErrorMsg(err.message || 'Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="max-w-md w-full glass-panel bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create Watch Room</h2>
                <p className="text-xs text-slate-500">You will be designated as the Room Host</p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Your Display Name</span>
              </label>
              <input
                type="text"
                required
                maxLength={30}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium shadow-sm"
              />
            </div>

            {/* Optional Initial Video Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>Initial YouTube Link (Optional)</span>
              </label>
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-mono shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Room...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Launch Watch Party</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateRoom;
