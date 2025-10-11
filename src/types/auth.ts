export type UserRole = "cassiere" | "bracerista" | "cuoca";

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  isHydrated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  setHydrated: () => void;
}

export interface RoleConfig {
  role: UserRole;
  password: string;
  displayName: string;
  redirectPath: string;
  color: string;
  icon: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  cassiere: {
    role: "cassiere",
    password: "cassa123",
    displayName: "Cassiere",
    redirectPath: "/cassa",
    color: "#2196F3",
    icon: "💰",
  },
  bracerista: {
    role: "bracerista",
    password: "brace123",
    displayName: "Bracerista",
    redirectPath: "/brace",
    color: "#FF9800",
    icon: "🍖",
  },
  cuoca: {
    role: "cuoca",
    password: "cucina123",
    displayName: "Cuoca",
    redirectPath: "/cucina",
    color: "#4CAF50",
    icon: "👩‍🍳",
  },
};
