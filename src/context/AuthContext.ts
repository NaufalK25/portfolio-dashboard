import { createContext } from 'react';

export type AuthContextValue = {
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export default AuthContext;
