import { createContext, useContext, useState } from 'react';
import { apiRequest } from '../api/client.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'camping-session';

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  async function login(username, password) {
    const data = await apiRequest('/auth/login', { method: 'POST', body: { username, password } });
    const next = { token: data.access_token, role: data.role, username: username.trim().toLowerCase() };
    setSession(next);
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  }

  function logout() {
    setSession(null);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
  }

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
