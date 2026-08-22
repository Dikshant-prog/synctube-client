# 🍿 SyncTube Frontend Client

SyncTube React 18 + Vite + Tailwind CSS Frontend for real-time synchronized YouTube watch parties.

## 🚀 Features
- 🎬 **Real-Time YouTube Player**: YouTube IFrame Player API with sub-second synchronization for Play, Pause, Seek timeline, and Video changes.
- 👑 **Role-Based Controls**: Controls dynamically adapt based on user role (`HOST`, `MODERATOR`, `PARTICIPANT`).
- 🔗 **Instant Invitations**: One-click room code copying & direct link sharing (`/room/SYNC-XXXX`).
- 💬 **Live Chat & System Logs**: Real-time room chat & system activity logs.
- 🎨 **Modern UI**: Dark glassmorphic interface built with Tailwind CSS & Lucide React icons.

## 🛠️ Tech Stack
- React 18 & Vite
- Tailwind CSS
- Socket.IO Client
- React Router DOM v6
- Lucide React Icons

## ⚡ Setup & Run Locally
```bash
npm install
npm run dev
```

## 🔑 Environment Variables
Set the following in `.env` or your deployment platform (e.g. Render / Vercel):
- `VITE_SERVER_URL`: Backend server URL (e.g. `https://synctube-server.onrender.com`)
