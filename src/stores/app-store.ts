import { createStore } from "zustand/vanilla";

export type ProductView = "grid" | "list";
export interface AppState {
  productView: ProductView;
  setProductView: (view: ProductView) => void;
}

export const createAppStore = () =>
  createStore<AppState>()((set) => ({
    productView: "grid",
    setProductView: (productView) => set({ productView }),
  }));
export type AppStore = ReturnType<typeof createAppStore>;
