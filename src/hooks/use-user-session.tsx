"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { createUserSessionStore } from "@/stores/user-session-store";
import { userAuthService } from "@/services/user-auth.service";
import type { Dto } from "@/types/api";
import { toApiError } from "@/api/api-error";

type Session = {
  user: Dto<"UserResponseDto"> | null;
  loading: boolean;
  login: (input: Dto<"LoginDto">) => Promise<void>;
  register: (input: Dto<"RegisterDto">) => Promise<void>;
  logout: () => Promise<void>;
};
const Context = createContext<Session | null>(null);
export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createUserSessionStore);
  const user = useStore(store, (state) => state.user);
  const [loading, setLoading] = useState(true);
  const generation = useRef(0);
  useEffect(() => {
    let active = true;
    const current = generation.current;
    void userAuthService
      .me()
      .then((profile) => {
        if (active && generation.current === current)
          store.getState().setUser(profile);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [store]);
  async function login(input: Dto<"LoginDto">) {
    generation.current++;
    const profile = await userAuthService.login(input);
    store.getState().setUser(profile);
    setLoading(false);
  }
  async function logout() {
    generation.current++;
    try {
      await userAuthService.logout();
    } catch (cause) {
      if (toApiError(cause).status !== 401) throw cause;
    }
    store.getState().setUser(null);
  }
  async function register(input: Dto<"RegisterDto">) {
    generation.current++;
    const profile = await userAuthService.register(input);
    store.getState().setUser(profile);
    setLoading(false);
  }
  return (
    <Context.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Context.Provider>
  );
}
export function useUserSession() {
  const session = useContext(Context);
  if (!session) throw new Error("UserSessionProvider missing");
  return session;
}
