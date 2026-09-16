"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { toApiError } from "@/api/api-error";
import type { Dto } from "@/types/api";
import { useStore } from "zustand";
import { createAdminSessionStore } from "@/stores/admin-session-store";

type Session = {
  user: Dto<"UserResponseDto"> | null;
  loading: boolean;
  error: string;
  login: (input: Dto<"LoginDto">) => Promise<void>;
  logout: () => Promise<void>;
  reload: () => void;
  expire: () => void;
};
const Context = createContext<Session | null>(null);
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createAdminSessionStore);
  const user = useStore(store, (state) => state.user);
  const setUser = useStore(store, (state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const expire = useCallback(() => {
    setUser(null);
    router.replace("/admin/login");
  }, [router, setUser]);
  useEffect(() => {
    let active = true;
    adminService
      .me()
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch((cause) => {
        if (!active) return;
        const problem = toApiError(cause);
        if (problem.status === 401 || problem.status === 403) setUser(null);
        else setError(problem.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [revision, setUser]);
  useEffect(() => {
    if (loading || error) return;
    if (!user && pathname !== "/admin/login") router.replace("/admin/login");
    if (user && pathname === "/admin/login") router.replace("/admin");
  }, [user, loading, error, pathname, router]);
  async function login(input: Dto<"LoginDto">) {
    const profile = await adminService.login(input);
    setError("");
    setUser(profile);
    router.replace("/admin");
  }
  async function logout() {
    try {
      await adminService.logout();
    } catch (cause) {
      if (toApiError(cause).status !== 401) throw cause;
    }
    setUser(null);
    router.replace("/admin/login");
  }
  return (
    <Context.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        expire,
        reload: () => {
          setError("");
          setLoading(true);
          setRevision((value) => value + 1);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAdminSession() {
  const session = useContext(Context);
  if (!session) throw new Error("AdminSessionProvider missing");
  return session;
}
