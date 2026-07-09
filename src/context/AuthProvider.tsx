import { ReactNode, useState } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    window.localStorage.getItem('access_token')
  );

  const login = (token: string) => {
    window.localStorage.setItem('access_token', token);
    setAccessToken(token);
  };

  const logout = () => {
    window.localStorage.removeItem('access_token');
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
