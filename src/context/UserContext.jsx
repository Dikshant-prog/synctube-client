import { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('synctube_username') || '';
  });

  const [sessionToken] = useState(() => {
    let token = localStorage.getItem('synctube_sessionToken');
    if (!token) {
      token = 'usr_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('synctube_sessionToken', token);
    }
    return token;
  });

  const updateUsername = (name) => {
    setUsername(name);
    localStorage.setItem('synctube_username', name);
  };

  return (
    <UserContext.Provider value={{ username, updateUsername, sessionToken }}>
      {children}
    </UserContext.Provider>
  );
}
