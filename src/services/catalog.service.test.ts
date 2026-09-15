import { afterEach, describe, expect, it } from "vitest";
import { api } from "@/api/api-config";
import { catalogService } from "./catalog.service";

const originalAdapter = api.defaults.adapter;
afterEach(() => {
  api.defaults.adapter = originalAdapter;
});
describe("manufacturer-filtered catalog", () => {
  it("finds the exact name across pages and sends only its ID", async () => {
    const requests: string[] = [];
    const controller = new AbortController();
    api.defaults.adapter = async (config) => {
      requests.push(config.url!);
      expect(config.signal).toBe(controller.signal);
      let body;
      if (config.url === "/manufacturers") {
        body = {
          data:
            config.params.page === 1
              ? [{ id: "wrong", name: "DENIS EXTRA" }]
              : [{ id: "correct", name: "DENIS" }],
          totalPages: 2,
        };
      } else {
        expect(config.params).toMatchObject({
          manufacturerId: "correct",
          search: "MAXSPEED",
          page: 2,
        });
        body = { data: [], total: 0, page: 2, limit: 12, totalPages: 0 };
      }
      return { data: body, status: 200, statusText: "OK", headers: {}, config };
    };
    await catalogService.list(
      { search: "MAXSPEED", page: 2 },
      "denis",
      controller.signal,
    );
    expect(requests).toEqual(["/manufacturers", "/manufacturers", "/products"]);
  });
  it.each([
    { manufacturers: [] },
    {
      manufacturers: [
        { id: "a", name: "DENIS" },
        { id: "b", name: "denis" },
      ],
    },
  ])(
    "never fetches unfiltered products on missing/ambiguous manufacturer",
    async ({ manufacturers }) => {
      api.defaults.adapter = async (config) => {
        expect(config.url).toBe("/manufacturers");
        return {
          data: { data: manufacturers, totalPages: 1 },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        };
      };
      await expect(catalogService.list({}, "DENIS")).rejects.toMatchObject({
        status: manufacturers.length ? 409 : 404,
      });
    },
  );
});
