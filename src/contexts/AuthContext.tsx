
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  username: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Static authentication for demo purposes
    if (username === "admin" && password === "admin") {
      const adminUser = { username: "admin", isAdmin: true };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return true;
    } else if (username === "user1" && password === "user1") {
      const regularUser = { username: "user1", isAdmin: false };
      setUser(regularUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(regularUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
