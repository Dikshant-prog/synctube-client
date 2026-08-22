# 🍿 SyncTube Frontend Client

SyncTube React 18 + Vite + Tailwind CSS Frontend for real-time synchronized YouTube watch parties.

## 🌐 Live Deployment & Repositories
- 🚀 **Live Web Application (Frontend)**: [https://synctube-client.onrender.com](https://synctube-client.onrender.com)
- 📡 **Live Backend Socket & API Server**: [https://synctube-server-fi8a.onrender.com](https://synctube-server-fi8a.onrender.com)
- 📦 **Frontend Repository**: [https://github.com/Dikshant-prog/synctube-client](https://github.com/Dikshant-prog/synctube-client)
- 📦 **Backend Repository**: [https://github.com/Dikshant-prog/synctube-server](https://github.com/Dikshant-prog/synctube-server)

## 🏗️ Architecture Overview
- **YouTube IFrame API Integration**: Sub-second synchronization of Play, Pause, and Seek timeline state via Socket.IO.
- **Context API & Custom Hooks**: `RoomContext` and `usePlayer` manage real-time room state, participant list, role permissions, and active video streams.
- **Dynamic Role Adaptation**: UI controls automatically lock/unlock based on role (`HOST`, `MODERATOR`, `PARTICIPANT`).

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
