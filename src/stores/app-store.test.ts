import { expect, it } from "vitest";
import { createAppStore } from "./app-store";

it("isolates global UI state between provider/store instances", () => {
  const first = createAppStore();
  const second = createAppStore();
  first.getState().setProductView("list");
  expect(first.getState().productView).toBe("list");
  expect(second.getState().productView).toBe("grid");
});
