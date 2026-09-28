import { ReactNode, useCallback, useEffect, useState } from 'react';
import authFetch, { UNAUTHORIZED_EVENT } from '../utils/authFetch';
import { createErrorToast } from '../utils/toast';
import AuthContext from './AuthContext';

// Returns the JWT expiry in ms, or null if the token can't be decoded
const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string) => {
  const expiry = getTokenExpiry(token);
  return expiry !== null && expiry <= Date.now();
};

const getStoredToken = () => {
  const token = window.localStorage.getItem('access_token');
  if (token && isTokenExpired(token)) {
    window.localStorage.removeItem('access_token');
    return null;
  }
  return token;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(getStoredToken);

  const login = (token: string) => {
    window.localStorage.setItem('access_token', token);
    setAccessToken(token);
  };

  const logout = useCallback(() => {
    window.localStorage.removeItem('access_token');
    setAccessToken(null);
  }, []);

  const expireSession = useCallback(() => {
    if (!window.localStorage.getItem('access_token')) return;
    logout();
    createErrorToast('Your session has expired, please login again!');
  }, [logout]);

  // Log out when the token's expiry time is reached
  useEffect(() => {
    if (!accessToken) return;

    const expiry = getTokenExpiry(accessToken);
    // setTimeout overflows past ~24.8 days and would fire immediately
    const delay = expiry === null ? null : expiry - Date.now();
    if (delay === null || delay > 2 ** 31 - 1) return;

    const timeout = setTimeout(expireSession, Math.max(delay, 0));
    return () => clearTimeout(timeout);
  }, [accessToken, expireSession]);

  // Log out when the backend rejects the token
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, expireSession);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, expireSession);
  }, [expireSession]);

  // Verify the token with the backend on load and when the tab regains focus;
  // a 401 from authFetch triggers expireSession via UNAUTHORIZED_EVENT
  useEffect(() => {
    if (!accessToken) return;

    const verifyToken = () => {
      authFetch(`${import.meta.env.VITE_BASE_URL}/auth/me`).catch(() => {
        // Network errors aren't auth failures, keep the session
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        verifyToken();
      }
    };

    verifyToken();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [accessToken]);

  // Keep login state in sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        setAccessToken(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
