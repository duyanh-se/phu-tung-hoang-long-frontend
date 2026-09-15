import type { ReactNode } from "react";
import { AppStoreProvider } from "./app-store-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return <AppStoreProvider>{children}</AppStoreProvider>;
}
