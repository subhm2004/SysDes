import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  image: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      logout: () => {
        // Tell backend (fire and forget)
        const t = get().token;
        if (t) {
          fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${t}` },
          }).catch(() => {});
        }
        set({ token: null, user: null });
      },

      isLoggedIn: () => !!get().token && !!get().user,
    }),
    {
      name: "sysdes-auth",
    }
  )
);

/** Helper: build auth headers for API calls */
export function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/** The backend URL for API calls */
export const API_BASE_URL = API_URL;
