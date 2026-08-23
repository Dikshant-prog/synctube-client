# 🍿 SyncTube Frontend Client

SyncTube React 18 + Vite + Tailwind CSS Frontend for real-time synchronized YouTube watch parties.

---

## 🌐 Live Deployment & Repositories

- 🚀 **Live Web Application (Frontend)**: [https://synctube-client.onrender.com](https://synctube-client.onrender.com)
- 📡 **Live Backend Socket & API Server**: [https://synctube-server-fi8a.onrender.com](https://synctube-server-fi8a.onrender.com)
- 📦 **Frontend Repository**: [https://github.com/Dikshant-prog/synctube-client](https://github.com/Dikshant-prog/synctube-client)
- 📦 **Backend Repository**: [https://github.com/Dikshant-prog/synctube-server](https://github.com/Dikshant-prog/synctube-server)

---

## 🚀 Key Features

- 🎬 **Real-Time YouTube Player**: Official YouTube IFrame Player API integration with sub-second synchronization for Play, Pause, Seek timeline, and Video changes.
- 👑 **Dynamic Role-Based UI**: UI controls automatically adapt, lock, or unlock based on user role (`HOST`, `MODERATOR`, `PARTICIPANT`).
- 🔗 **Instant Room Invitations**: One-click room code copying & direct URL routing support (`/room/SYNC-XXXX`).
- 💬 **Live Chat & System Logs**: Real-time room chat with Indian Standard Time (IST) timestamps & system activity feed (`User X joined`, `Host changed video`).
- 🎨 **Modern Light Glassmorphic UI**: Built with Tailwind CSS, custom scrollbars, glowing accents, and responsive layouts.

---

## 🏗️ Architecture Overview

- **Context API & Custom Hooks**: `RoomContext` and `usePlayer` manage real-time room state, participant list, role permissions, and active video streams.
- **WebSocket Event Integration**: Synchronizes state changes with the backend Socket.IO server in real time.
- **Stale Closure Prevention**: React `useRef` handlers maintain live reference to `hasControl` state inside YouTube Player event callbacks.

---

## 🛠️ Tech Stack

- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS & Lucide React Icons
- **WebSockets**: Socket.IO Client
- **Routing**: React Router DOM v6
- **Player API**: Official YouTube IFrame Player API

---

## ⚡ Setup & Run Locally

```bash
npm install
npm run dev
```

## 🔑 Environment Variables (`.env`)

```env
VITE_SERVER_URL=http://localhost:5000
```
