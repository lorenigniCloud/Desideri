export type UserRole = "cassiere" | "bracerista" | "cuoca" | "cameriere";

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
  department: string;
  departmentIcon: string;
  redirectPath: string;
  color: string;
  icon: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  cassiere: {
    role: "cassiere",
    department: "Cassa",
    departmentIcon: "💸",
    password: "cassa123",
    displayName: "Cassiere",
    redirectPath: "/cassa",
    color: "#2196F3",
    icon: "💰",
  },
  cameriere: {
    role: "cameriere",
    password: "cameriere123",
    department: "Comande",
    departmentIcon: "📋",
    displayName: "Cameriere",
    redirectPath: "/camerieri",
    color: "#9C27B0",
    icon: "🍽️",
  },
  cuoca: {
    role: "cuoca",
    password: "cucina123",
    department: "Cucina",
    departmentIcon: "🥘",
    displayName: "Cuoca",
    redirectPath: "/cucina",
    color: "#4CAF50",
    icon: "👩‍🍳",
  },
  bracerista: {
    role: "bracerista",
    password: "brace123",
    department: "Brace",
    departmentIcon: "🍖",
    displayName: "Bracerista",
    redirectPath: "/brace",
    color: "#FF9800",
    icon: "🐎",
  },
};
