import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Demo-only auth state for local UI flows until real backend auth exists.
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('dev_logged_in') === 'true');

  const login = () => {
    localStorage.setItem('dev_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('dev_logged_in');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
