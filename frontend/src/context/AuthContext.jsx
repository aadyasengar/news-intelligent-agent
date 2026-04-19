import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('news_agent_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    const mockUser = {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
    };
    localStorage.setItem('news_agent_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const register = (name, email, password) => {
    const mockUser = {
      id: Date.now(),
      name: name,
      email: email,
    };
    localStorage.setItem('news_agent_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('news_agent_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
