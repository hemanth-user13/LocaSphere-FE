import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { apiClient, authService, type Session } from "@/services";
import type { User } from "@/types/models";

type AuthState = {
  session: Session | null;
  isSignedIn: boolean;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  signIn: (session: Session) => void;
  signOut: () => Promise<void>;
  /** Replace the cached user after a profile update. */
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthState | null>(null);

/**
 * Session state. Held in memory for the prototype; persist `session` with
 * expo-secure-store and `hasOnboarded` with AsyncStorage when wiring the API.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const value = useMemo<AuthState>(
    () => ({
      session,
      isSignedIn: session !== null,
      hasOnboarded,
      completeOnboarding: () => setHasOnboarded(true),
      signIn: (next) => {
        apiClient.setAccessToken(next.accessToken);
        setHasOnboarded(true);
        setSession(next);
      },
      signOut: async () => {
        await authService.signOut().catch(() => {});
        apiClient.setAccessToken(null);
        setSession(null);
      },
      updateUser: (user) => setSession((s) => (s ? { ...s, user } : s)),
    }),
    [session, hasOnboarded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
