import { Link } from 'react-router-dom';
import { Plus, LogIn, Users, Zap, Shield, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

export function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-pink-200/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-md">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Real-time YouTube Watch Party Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Watch YouTube Videos <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Synchronized In Real-Time
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Create private watch rooms, invite your friends with room codes, and enjoy frame-exact video synchronization with role-based playback permissions.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/create"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Plus className="w-5 h-5" />
              <span>Create Watch Room</span>
            </Link>

            <Link
              to="/join"
              className="w-full sm:w-auto px-8 py-4 glass-panel bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 shadow-md"
            >
              <LogIn className="w-5 h-5 text-indigo-600" />
              <span>Join with Room Code</span>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-12 text-left">
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-2 bg-white/90 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ultra-Low Sync Drift</h3>
              <p className="text-xs text-slate-600">
                Socket.IO WebSockets keep play, pause, and seek events strictly synchronized across all participants.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-2 bg-white/90 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Role Authorization</h3>
              <p className="text-xs text-slate-600">
                Host, Moderator, and Participant roles backed by server-side permission validation.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-2 bg-white/90 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Instant Invitation</h3>
              <p className="text-xs text-slate-600">
                Share room codes or direct links to bring friends into your watch party instantly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
