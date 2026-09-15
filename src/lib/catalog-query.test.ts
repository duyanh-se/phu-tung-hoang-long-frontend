import { describe, expect, it } from "vitest";
import { catalogHref, parseCatalogQuery } from "./catalog-query";

describe("catalog URL filters", () => {
  it("preserves manufacturer through search and pagination", () => {
    const query = parseCatalogQuery({
      manufacturer: " DENIS ",
      search: " MAXSPEED ",
      page: "2",
    });
    expect(catalogHref(query)).toBe(
      "/san-pham?manufacturer=DENIS&search=MAXSPEED&page=2",
    );
    expect(catalogHref({ ...query, page: 1 })).toBe(
      "/san-pham?manufacturer=DENIS&search=MAXSPEED",
    );
  });
  it.each([
    { manufacturer: "" },
    { manufacturer: ["DENIS", "OTHER"] },
    { page: "0" },
    { page: "1.5" },
    { search: "a".repeat(201) },
  ])("rejects malformed params %j", (params) => {
    expect(parseCatalogQuery(params).error).toBeTruthy();
  });
});
