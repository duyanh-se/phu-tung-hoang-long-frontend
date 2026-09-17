import { afterEach, expect, it } from "vitest";
import { api } from "@/api/api-config";
import { manufacturerService } from "./manufacturer.service";

const adapter = api.defaults.adapter;
afterEach(() => {
  api.defaults.adapter = adapter;
});
it("loads every page of distributors and sorts names for the filter", async () => {
  const pages: number[] = [];
  api.defaults.adapter = async (config) => {
    pages.push(config.params.page);
    return {
      data: {
        data:
          config.params.page === 1
            ? [{ id: "z", name: "Z" }]
            : [{ id: "a", name: "A" }],
        totalPages: 2,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  const data = await manufacturerService.listAll();
  expect(pages).toEqual([1, 2]);
  expect(data.map((item) => item.name)).toEqual(["A", "Z"]);
});
