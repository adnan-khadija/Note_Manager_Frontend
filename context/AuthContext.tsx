"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/lib/types";
import Cookies from "js-cookie";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const storedToken = Cookies.get("token");
          const storedUser = Cookies.get("user") ;

          if (storedToken && storedUser && storedUser !== "undefined") {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        Cookies.remove("token");
        Cookies.remove("user");
        Cookies.remove("token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    Cookies.set("token", token, { path: "/" });
    Cookies.set("user", JSON.stringify(user), { path: "/" });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("user");
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
