import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";
import * as api from "../services/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => api.getCurrentUser());
  const [loading, setLoading] = useState(false);

  /* Re-verify the JWT with the server once on mount. If it's invalid or the
     server is unreachable, we keep the cached session (so offline / slow
     networks don't kick users out); a hard 401 clears it inside api.refreshSession. */
  useEffect(() => {
    let cancelled = false;
    api
      .refreshSession()
      .then((fresh) => {
        if (!cancelled) setUser(fresh);
      })
      .catch(() => {
        /* network noise — keep cached user */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        setUser(await api.signUp(name, email, password));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      setUser(await api.logIn(email, password));
    } finally {
      setLoading(false);
    }
  }, []);

  const logOut = useCallback(async () => {
    await api.logOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, logIn, logOut }),
    [user, loading, signUp, logIn, logOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
