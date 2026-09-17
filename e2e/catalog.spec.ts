import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1440]) {
  test(`catalog layout and motion at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/san-pham");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("[data-catalog-intro] > h1")).toHaveAttribute(
      "style",
      "",
    );
    await page.screenshot({ path: testInfo.outputPath("hero.png") });
    const cards = page.locator(".catalog-product-card");
    await expect(cards.first()).toBeVisible();
    await cards.first().scrollIntoViewIfNeeded();
    await expect(cards.first().locator("..")).toHaveCSS("opacity", "1");
    if (width === 1440) {
      await expect(page.locator("[data-catalog-art]")).not.toHaveCSS(
        "transform",
        "none",
      );
      const boxes = await cards.all();
      if (boxes.length >= 3) {
        const heights = await Promise.all(
          boxes
            .slice(0, 3)
            .map(async (card) => (await card.boundingBox())!.height),
        );
        expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(2);
      }
    }
    await page.screenshot({ path: testInfo.outputPath("grid.png") });
    await page.getByRole("button", { name: "Danh sách", exact: true }).click();
    await expect(cards.first()).toHaveClass(/catalog-product-list/);
    await cards.first().scrollIntoViewIfNeeded();
    await expect(cards.first().locator("..")).toHaveCSS("opacity", "1");
    await expect(cards.first()).toHaveCSS(
      "flex-direction",
      width >= 640 ? "row" : "column",
    );
    await page.screenshot({ path: testInfo.outputPath("list.png") });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("[data-catalog-art]")).toHaveCSS(
      "transform",
      "none",
    );
    await expect(cards.first().locator("..")).toHaveCSS("transform", "none");
    expect(errors).toEqual([]);
  });
}

test("catalog filters preserve search, reset page and recover from empty/error states", async ({
  page,
}) => {
  let fail = false;
  await page.route("**/api/v1/manufacturers?**", (route) =>
    route.fulfill({
      json: { data: [{ id: "denis-id", name: "DENIS" }], totalPages: 1 },
    }),
  );
  await page.route("**/api/v1/products?**", (route) => {
    if (fail)
      return route.fulfill({
        status: 500,
        json: { message: "Không thể tải sản phẩm" },
      });
    const params = new URL(route.request().url()).searchParams;
    return route.fulfill({
      json: {
        data:
          params.get("search") === "empty"
            ? []
            : [
                {
                  id: "oil",
                  name: "Dầu nhớt DENIS",
                  code: "D-01",
                  imageUrl: null,
                  price: "67000",
                  currency: "VND",
                  manufacturer: { name: "DENIS" },
                },
              ],
        total: 25,
        page: Number(params.get("page") || 1),
        totalPages: 3,
        limit: 12,
      },
    });
  });
  await page.goto("/san-pham?search=oil&page=2");
  await page.getByRole("radio", { name: "DENIS", exact: true }).check();
  await expect(page).toHaveURL(/manufacturer=DENIS&search=oil$/);
  await expect(page.locator(".catalog-product-card")).toContainText(
    "67.000 VNĐ",
  );
  await page.getByRole("button", { name: "Sau", exact: true }).click();
  await expect(page).toHaveURL(/manufacturer=DENIS&search=oil&page=2$/);
  await page
    .getByRole("radio", { name: "Tất cả nhà phân phối", exact: true })
    .check();
  await expect(page).toHaveURL(/san-pham\?search=oil$/);
  await page.getByRole("searchbox").fill("empty");
  await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
  await expect(
    page.getByText("Chưa có sản phẩm", { exact: true }),
  ).toBeVisible();
  fail = true;
  await page.getByRole("searchbox").fill("retry");
  await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Thử lại", exact: true }),
  ).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(page.locator(".catalog-product-card")).toBeVisible();
});
