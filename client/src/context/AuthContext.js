// AuthContext provides global authentication state across the entire app
// Stores the logged in user's token and username in localStorage
// so the user stays logged in even after refreshing the page

import React, { createContext, useState, useContext } from 'react';

// Create the context object
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage if a token already exists
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token ? { token, username } : null;
  });

  // Login function - saves token and username to localStorage and state
  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ token, username });
  };

  // Logout function - removes token and username from localStorage and state
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth context from any component
export const useAuth = () => useContext(AuthContext);