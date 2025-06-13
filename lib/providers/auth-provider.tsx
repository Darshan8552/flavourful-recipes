"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshSession } from "@/actions/auth-action";

type User = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  provider: string;
  emailVerified?: boolean;
};

type Session = {
  user: User;
  expires: string;
};

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshAuth = async () => {
    try {
      const response = await refreshSession();
      if (response.success && response.session) {
        setSession(response.session);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
    const intervalId = setInterval(() => {
      refreshAuth();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
