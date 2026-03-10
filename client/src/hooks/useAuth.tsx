import React, { createContext, useContext, useState } from "react";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

type AuthContextValue = {
  token: string | null;
  email: string | null;
  saveAuth: (newToken: string, userEmail: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getCookie("ims_token"));
  const [email, setEmail] = useState<string | null>(() => getCookie("ims_email"));

  function saveAuth(newToken: string, userEmail: string) {
    setCookie("ims_token", newToken, 1);
    setCookie("ims_email", userEmail, 1);
    setToken(newToken);
    setEmail(userEmail);
  }

  function clearAuth() {
    deleteCookie("ims_token");
    deleteCookie("ims_email");
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, email, saveAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
