import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`sidebar filters, chips and instant sorting with real API at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/san-pham");
    const panel = page.locator("#catalog-filter-panel");
    if (width < 1024) {
      await expect(panel).toBeHidden();
      await page.getByRole("button", { name: "Bộ lọc", exact: true }).click();
    }
    await page.getByLabel("Tìm nhà phân phối", { exact: true }).fill("denis");
    await page.getByRole("radio", { name: "DENIS", exact: true }).check();
    await expect(page).toHaveURL(/manufacturer=DENIS/);
    await page
      .getByRole("radio", { name: "Đến 100.000 VNĐ", exact: true })
      .check();
    await expect(page).toHaveURL(/maxPrice=100000/);
    if (width < 1024)
      await page
        .getByRole("button", { name: "Xem kết quả", exact: true })
        .click();
    const response = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/products?") &&
        res.url().includes("sort=price_asc") &&
        res.url().includes("maxPrice=100000"),
    );
    await page.getByLabel("Sắp xếp", { exact: true }).selectOption("price_asc");
    const body = await (await response).json();
    expect(body.data.length).toBeGreaterThan(0);
    const prices = body.data.map(
      (item: { price: string; manufacturer: { name: string } }) => {
        expect(item.manufacturer.name).toBe("DENIS");
        expect(Number(item.price)).toBeLessThanOrEqual(100000);
        return Number(item.price);
      },
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    await expect(
      page.getByRole("button", { name: "Bỏ nhà phân phối DENIS", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Bỏ khoảng giá", exact: true })
      .scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("results.png") });
    await page
      .getByRole("button", { name: "Bỏ khoảng giá", exact: true })
      .click();
    await expect(page).toHaveURL(/manufacturer=DENIS&sort=price_asc$/);
    await page.reload();
    await expect(page.getByLabel("Sắp xếp", { exact: true })).toHaveValue(
      "price_asc",
    );
    if (width < 1024)
      await page
        .getByRole("button", { name: "Bộ lọc (1)", exact: true })
        .click();
    await expect(
      page.getByRole("radio", { name: "DENIS", exact: true }),
    ).toBeChecked();
    await page.getByLabel("Giá từ (VNĐ)", { exact: true }).fill("500000");
    await page.getByLabel("Giá đến (VNĐ)", { exact: true }).fill("10000");
    await page
      .getByRole("button", { name: "Áp dụng khoảng giá", exact: true })
      .click();
    await expect(page.locator("#product-price-error")).toBeVisible();
    await page.getByLabel("Giá từ (VNĐ)", { exact: true }).fill("10000");
    await page.getByLabel("Giá đến (VNĐ)", { exact: true }).fill("500000");
    await page
      .getByRole("button", { name: "Áp dụng khoảng giá", exact: true })
      .click();
    await expect(page).toHaveURL(/minPrice=10000&maxPrice=500000/);
    await page
      .getByLabel("Tìm nhà phân phối", { exact: true })
      .fill("xyz-no-match");
    await expect(
      page.getByText("Không tìm thấy nhà phân phối.", { exact: true }),
    ).toBeVisible();
    await page.getByLabel("Tìm nhà phân phối", { exact: true }).fill("denis");
    await page
      .getByRole("radio", { name: "Tất cả nhà phân phối", exact: true })
      .check();
    if (width < 1024)
      await page
        .getByRole("button", { name: "Xem kết quả", exact: true })
        .click();
    const descending = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/products?") &&
        res.url().includes("sort=price_desc") &&
        !res.url().includes("manufacturerId="),
    );
    await page
      .getByLabel("Sắp xếp", { exact: true })
      .selectOption("price_desc");
    const down = (await (await descending).json()).data.map(
      (item: { price: string }) => Number(item.price),
    );
    expect(down).toEqual([...down].sort((a, b) => b - a));
    await page.getByRole("button", { name: "Sau", exact: true }).click();
    await expect(page).toHaveURL(
      /page=2&sort=price_desc&minPrice=10000&maxPrice=500000/,
    );
    await page.getByRole("searchbox").fill("DENIS");
    await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
    await expect(page).toHaveURL(
      /search=DENIS&sort=price_desc&minPrice=10000&maxPrice=500000/,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Bỏ khoảng giá", exact: true })
      .click();
    await expect(page).toHaveURL(/search=DENIS&sort=price_desc$/);
    await page
      .getByRole("button", { name: "Bỏ từ khóa DENIS", exact: true })
      .click();
    await expect(page).toHaveURL(/san-pham\?sort=price_desc$/);
  });
}
