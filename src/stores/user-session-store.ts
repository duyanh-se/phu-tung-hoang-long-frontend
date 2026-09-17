import { createStore } from "zustand/vanilla";
import type { Dto } from "@/types/api";

type UserSessionState = {
  user: Dto<"UserResponseDto"> | null;
  setUser: (user: Dto<"UserResponseDto"> | null) => void;
};

export const createUserSessionStore = () =>
  createStore<UserSessionState>()((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }));
