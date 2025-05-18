import type { IUser } from "@interfaces/IUser";
import { _myAccount } from "src/_mock";
import { create } from "zustand";

interface AuthStore {
  user: IUser | null;
  isAuthenticated: boolean;

  logout: () => void;
  setUser: (user: IUser) => void;
  login: (token: string, user: IUser) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: _myAccount,
  isAuthenticated: true,

  setUser: (user: IUser) => set({ user }),


  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

  login: (token: string, user: IUser) => {
    set({ isAuthenticated: true, user,  });
    localStorage.setItem("authToken", token);
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({ isAuthenticated: false, user: null });
  },
}));
