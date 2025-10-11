import { UserRole } from "@/types/auth";
import { create } from "zustand";

export interface PermissionsState {
  canEdit: (department: UserRole) => boolean;
  canView: (department: UserRole) => boolean;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  userRole: null,

  setUserRole: (role: UserRole | null) => {
    set({ userRole: role });
  },

  canView: (department: UserRole) => {
    // Tutti possono visualizzare tutti i reparti
    return true;
  },

  canEdit: (department: UserRole) => {
    const { userRole } = get();
    // Solo il ruolo corrispondente può modificare il proprio reparto
    return userRole === department;
  },
}));
