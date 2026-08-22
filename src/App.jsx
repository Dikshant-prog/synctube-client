import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
import { RoomProvider } from './context/RoomContext';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Room from './pages/Room';

export function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <RoomProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateRoom />} />
              <Route path="/join" element={<JoinRoom />} />
              <Route path="/room/:roomCode" element={<Room />} />
            </Routes>
          </Router>
        </RoomProvider>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
