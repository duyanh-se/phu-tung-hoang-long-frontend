import type { ReactNode } from "react";

export function ProductsStage({ children }: { children: ReactNode }) {
  return (
    <div data-products-stage className="products-stage">
      {children}
    </div>
  );
}
