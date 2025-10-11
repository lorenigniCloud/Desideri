import { clearCookies, getCookies, setCookies } from "@/lib/cookies";
import { AuthState, UserRole } from "@/types/auth";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  isHydrated: false,

  login: (role: UserRole) => {
    set({ isAuthenticated: true, role });
    setCookies(true, role);
  },

  logout: () => {
    set({ isAuthenticated: false, role: null });
    clearCookies();
  },

  setHydrated: () => {
    set({ isHydrated: true });
  },
}));

// Funzione per inizializzare lo store dai cookies
export const initializeAuthFromCookies = () => {
  if (typeof window !== "undefined") {
    const { isAuthenticated, role } = getCookies();
    if (isAuthenticated && role) {
      useAuthStore.setState({ isAuthenticated, role, isHydrated: true });
    } else {
      useAuthStore.setState({ isHydrated: true });
    }
  }
};
