import { useEffect, useMemo, useState } from "react";

import { setSentryUser } from "../config/sentry";
import { api } from "../services/api";
import { AuthContext } from "./auth-context";

const AUTH_STORAGE_KEY = "aeropaq_auth";

function readStoredSession() {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return { user: null, token: null };
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [initialToken] = useState(session.token);
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(session.token));

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      if (!initialToken) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const data = await api.getProfile(initialToken);

        if (!isMounted) {
          return;
        }

        const nextSession = {
          token: initialToken,
          user: data.user,
        };

        setSession(nextSession);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      } catch {
        if (isMounted) {
          setSession({ user: null, token: null });
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [initialToken]);

  useEffect(() => {
    setSentryUser(session.user);
  }, [session.user]);

  async function login(credentials) {
    const data = await api.login(credentials);
    const nextSession = {
      user: data.user,
      token: data.token,
    };

    setSession(nextSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    return nextSession;
  }

  async function register(user) {
    const data = await api.register(user);
    const nextSession = {
      user: data.user,
      token: data.token,
    };

    setSession(nextSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    return nextSession;
  }

  function logout() {
    setSession({ user: null, token: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: Boolean(session.token),
      isCheckingSession,
      login,
      register,
      logout,
    }),
    [session, isCheckingSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
