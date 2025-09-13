// src/store/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../utils/auth';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get(`${import.meta.env.VITE_API_URL}/user`)
        .then((res) => {
          setUser(res.data.data.user); // ✅ real user object
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        });
    }
  }, []);

  const login = async ({ email, password }) => {
    const userData = await apiLogin(email, password); // this should return real user
    setUser(userData);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
