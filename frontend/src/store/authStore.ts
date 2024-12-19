import { create } from "zustand";

interface AuthState {
  decodedToken: { name?: string | null; role?: string | null } | null;
  setDecodedToken: (token: { name?: string | null } | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  decodedToken: null,
  setDecodedToken: (token) => set({ decodedToken: token }),
}));
