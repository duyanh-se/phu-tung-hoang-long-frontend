// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { catalogService } from "@/services/catalog.service";
import type { ProductListDto } from "@/types/api";
import { useProducts } from "./use-products";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("aborts stale requests and never renders the old filter result", async () => {
  const pending: {
    resolve: (value: ProductListDto) => void;
    signal?: AbortSignal;
  }[] = [];
  vi.spyOn(catalogService, "list").mockImplementation(
    (_query, _manufacturer, signal) =>
      new Promise((resolve) => pending.push({ resolve, signal })),
  );
  const { result, rerender, unmount } = renderHook(
    ({ search }) => useProducts({ search }, "DENIS"),
    { initialProps: { search: "old" } },
  );
  await waitFor(() => expect(pending).toHaveLength(1));
  rerender({ search: "new" });
  expect(result.current.data).toBeNull();
  await waitFor(() => expect(pending).toHaveLength(2));
  expect(pending[0].signal?.aborted).toBe(true);
  const latest = { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  await act(async () => {
    pending[1].resolve(latest);
  });
  await act(async () => {
    pending[0].resolve({ ...latest, total: 999 });
  });
  expect(result.current.data).toEqual(latest);
  unmount();
  expect(pending[1].signal?.aborted).toBe(true);
});
