import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { fetchCurrentUser, loginUser, registerUser, updateProfile, loginDemoUser, logoutUser } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('artisan_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('User parse failed:', e);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync session on load
  useEffect(() => {
    async function syncSession() {
      try {
        const res = await fetchCurrentUser();
        const userData = res?.user || res;
        if (userData) {
          setUser(userData);
          localStorage.setItem('artisan_user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('artisan_user');
          localStorage.removeItem('token');
        }
      } catch (err) {
        // Only clear session on auth errors (401/403), not network errors
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          console.warn('Session expired, clearing auth state.');
          setUser(null);
          localStorage.removeItem('artisan_user');
          localStorage.removeItem('token');
        } else {
          // Network error or server down — keep existing user from localStorage
          console.warn('Session sync failed (network/server), keeping cached auth:', err?.message);
        }
      } finally {
        setLoading(false);
      }
    }
    syncSession();
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials?.email, credentials?.password);
    const userData = res?.user || res;
    const token = res?.token;
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('artisan_user', JSON.stringify(userData));
    }
    if (token) {
      localStorage.setItem('token', token);
    }
    return userData;
  };

  const signup = async (data) => {
    const res = await registerUser(data?.email, data?.password, data?.displayName);
    const userData = res?.user || res;
    const token = res?.token;
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('artisan_user', JSON.stringify(userData));
    }
    if (token) {
      localStorage.setItem('token', token);
    }
    return userData;
  };

  const loginDemo = async () => {
    const res = await loginDemoUser();
    const userData = res?.user || res;
    const token = res?.token;
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('artisan_user', JSON.stringify(userData));
    }
    if (token) {
      localStorage.setItem('token', token);
    }
    return userData;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout API failed:', err);
    }
    setUser(null);
    localStorage.removeItem('artisan_user');
    localStorage.removeItem('token');
  };

  const updateUserInfo = async (data) => {
    const res = await updateProfile(data);
    const userData = res?.user || res;
    if (userData) {
      setUser(userData);
      localStorage.setItem('artisan_user', JSON.stringify(userData));
    }
    return userData;
  };

  const value = useMemo(() => ({
    user: user || null,
    loading,
    login,
    loginDemo,
    signup,
    logout,
    updateProfile: updateUserInfo
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
