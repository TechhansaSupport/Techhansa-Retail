// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token and sync with backend on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    const syncUser = async () => {
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        // Optimistically set the old user data
        setUser(parsedUser);
        
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me?userId=${parsedUser.userId}`);
          if (res.ok) {
            const freshUser = await res.json();
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          }
        } catch (error) {
          console.error('Failed to sync user data', error);
        }
      }
      setLoading(false);
    };

    syncUser();
  }, []);

  // Login function to save data globally and to localStorage
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // Logout function to clear data
  const logout = async () => {
    if (user && user.userId) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.userId }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = async (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      // Only persist to local state & storage if backend was successful
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Failed to sync profile to server:', error);
      // Revert to old user state if backend failed
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};