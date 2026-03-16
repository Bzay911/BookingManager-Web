import {createContext, useContext, useState, type ReactNode} from "react";

interface Business {
  id: number;
  businessName: string;
  businessAddress: string;
  businessPhoneNumber: string;
  businessEmail: string;
  openingTime: string;
  closingTime: string;
  businessProfileImage: string | null;
  description: string | null;
}

interface User{
    id: number;
    displayName: string;
    email: string;
    profileImage: string | null;
    role: 'BUSINESS' | 'CUSTOMER' | null;
    isOnBoarded: boolean;
    business: Business | null;
}

interface AuthContextType {
    user: User | null;
     setUser: (user: User) => void;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  });

 const updateUser = (updatedUser: User) => {
  localStorage.setItem('user', JSON.stringify(updatedUser));
  setUser(updatedUser);
};

  const login = (token: string, user: User) => {
    // Save to localStorage so it persists on refresh
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Update state so all components re-render
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}