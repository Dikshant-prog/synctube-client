const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';
const API_BASE = `${SERVER_URL}/api/rooms`;

export async function createRoomApi(username, sessionToken, videoId) {
  const response = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, sessionToken, videoId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create room');
  }
  return data;
}

export async function getRoomApi(roomCode) {
  const response = await fetch(`${API_BASE}/${roomCode}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Room not found');
  }
  return data;
}

export async function validateVideoApi(videoInput) {
  const response = await fetch(`${API_BASE}/validate-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoInput }),
  });
  return await response.json();
}
