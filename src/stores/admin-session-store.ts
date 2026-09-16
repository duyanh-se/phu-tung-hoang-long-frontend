import { createStore } from "zustand/vanilla";
import type { Dto } from "@/types/api";

type AdminSessionState = {
  user: Dto<"UserResponseDto"> | null;
  setUser: (user: Dto<"UserResponseDto"> | null) => void;
};

export const createAdminSessionStore = () =>
  createStore<AdminSessionState>()((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }));
