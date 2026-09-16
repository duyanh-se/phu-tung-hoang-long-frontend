import { expect, test, type Page } from "@playwright/test";

test("admin retains failed edits and sends pagination/search/status filters", async ({
  page,
}) => {
  await mockAdmin(page);
  const queries: URLSearchParams[] = [];
  await page.route("**/api/admin/contact-requests?**", async (route) => {
    const query = new URL(route.request().url()).searchParams;
    queries.push(query);
    await route.fulfill({
      json: {
        data: [
          {
            id: "contact-1",
            fullName: "Nguyễn An",
            email: "an@example.com",
            phoneNumber: "0900000000",
            status: "NEW",
          },
        ],
        page: Number(query.get("page")),
        totalPages: 2,
        total: 11,
        limit: 10,
      },
    });
  });
  await page.goto("/admin/contact-requests");
  await page.getByRole("button", { name: "Trang sau" }).click();
  await expect.poll(() => queries.at(-1)?.get("page")).toBe("2");
  await page.getByRole("textbox", { name: "Tìm kiếm" }).fill("Nguyễn");
  await page
    .getByRole("combobox", { name: "Lọc trạng thái" })
    .selectOption("NEW");
  await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
  await expect.poll(() => queries.at(-1)?.get("search")).toBe("Nguyễn");
  expect(queries.at(-1)?.get("status")).toBe("NEW");
  expect(queries.at(-1)?.get("page")).toBe("1");
  await page.route("**/api/admin/contact-requests/contact-1", (route) =>
    route.fulfill({
      status: 400,
      json: { message: "Thông tin không hợp lệ." },
    }),
  );
  await page.getByRole("button", { name: "Sửa", exact: true }).click();
  await page.getByLabel("Họ và tên", { exact: true }).fill("Tên đã sửa");
  await page.getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Thông tin không hợp lệ" }),
  ).toBeVisible();
  await expect(page.getByLabel("Họ và tên", { exact: true })).toHaveValue(
    "Tên đã sửa",
  );
});

test("admin refreshes an expired session before retrying", async ({ page }) => {
  await mockAdmin(page);
  let refreshed = false;
  await page.route("**/api/admin/auth/me", (route) =>
    route.fulfill({
      status: refreshed ? 200 : 401,
      json: refreshed ? user : { message: "Expired" },
    }),
  );
  await page.route("**/api/admin/auth/refresh", (route) => {
    refreshed = true;
    return route.fulfill({ json: user });
  });
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Quản lý cửa hàng" }),
  ).toBeVisible();
  expect(refreshed).toBe(true);
});

const user = {
  id: "admin",
  fullName: "Quản trị Hoàng Long",
  email: "admin@example.com",
  role: "ADMIN",
};
async function mockAdmin(page: Page, loggedIn = true) {
  const records: Record<string, Record<string, unknown>[]> = {
    products: [
      {
        id: "product-1",
        code: "HL-01",
        name: "Dầu nhớt DENIS",
        price: "69000",
        categories: [{ id: "category-1", name: "Dầu nhớt" }],
        manufacturerId: "manufacturer-1",
        imagePath: "oil.jpg",
        description: "Sản phẩm thử",
      },
    ],
    categories: [
      { id: "category-1", name: "Dầu nhớt", description: "Dầu cho xe máy" },
    ],
    manufacturers: [{ id: "manufacturer-1", name: "DENIS" }],
    "contact-requests": [
      {
        id: "contact-1",
        fullName: "Nguyễn An",
        email: "an@example.com",
        phoneNumber: "0900000000",
        reason: "Tư vấn",
        status: "NEW",
      },
    ],
    users: [
      user,
      {
        id: "user-1",
        fullName: "Khách hàng",
        email: "user@example.com",
        role: "USER",
      },
    ],
  };
  const writes: {
    module: string;
    method: string;
    body: Record<string, unknown>;
  }[] = [];
  await page.route("**/api/admin/**", async (route) => {
    const url = new URL(route.request().url());
    const [module, id] = url.pathname.replace("/api/admin/", "").split("/");
    const method = route.request().method();
    if (module === "auth") {
      if (id === "login") loggedIn = true;
      if (id === "logout") {
        loggedIn = false;
        return route.fulfill({ status: 204 });
      }
      return route.fulfill({
        status: loggedIn ? 200 : 401,
        json: loggedIn ? user : { message: "Vui lòng đăng nhập." },
      });
    }
    if (method === "GET")
      return route.fulfill({
        json: {
          data: records[module] ?? [],
          total: records[module]?.length ?? 0,
          page: Number(url.searchParams.get("page") || 1),
          limit: 10,
          totalPages: 1,
        },
      });
    const body = method === "DELETE" ? {} : route.request().postDataJSON();
    writes.push({ module, method, body });
    if (method === "POST")
      records[module].push({
        id: "created",
        ...body,
        ...(module === "products"
          ? {
              categories: records.categories.filter((item) =>
                body.categoryIds.includes(item.id),
              ),
            }
          : {}),
        ...(module === "contact-requests" ? { status: "NEW" } : {}),
      });
    if (method === "PATCH")
      Object.assign(
        records[module].find((item) => item.id === id)!,
        body,
      );
    if (method === "DELETE")
      records[module] = records[module].filter((item) => item.id !== id);
    return route.fulfill({
      status: method === "POST" ? 201 : 200,
      json: { id: id || "created", ...body },
    });
  });
  return writes;
}

test("admin login protects routes and logout returns to login", async ({
  page,
}, testInfo) => {
  await mockAdmin(page, false);
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.screenshot({
    path: testInfo.outputPath("admin-login.png"),
    fullPage: true,
  });
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Mật khẩu").fill("test-only");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Quản lý cửa hàng" }),
  ).toBeVisible();
  await expect(page.locator(".site-header")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

for (const moduleName of [
  "manufacturers",
  "categories",
  "products",
  "contact-requests",
]) {
  test(`admin CRUD ${moduleName}`, async ({ page }, testInfo) => {
    const writes = await mockAdmin(page);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/admin/${moduleName}`);
    await page.getByRole("button", { name: "Thêm mới" }).click();
    const editor = page.getByRole("region", { name: "Biểu mẫu bản ghi" });
    if (moduleName === "contact-requests") {
      await editor.getByLabel("Họ và tên").fill("Liên hệ mới");
      await editor.getByLabel("Email", { exact: true }).fill("new@example.com");
      await editor.getByLabel("Số điện thoại").fill("0901234567");
    } else await editor.getByLabel("Tên", { exact: true }).fill("Bản ghi mới");
    if (moduleName === "products") {
      await editor.getByLabel("Mã sản phẩm").fill("NEW-01");
      await editor.getByLabel("Giá (VNĐ)").fill("123000");
      await editor.getByLabel("Hãng sản xuất").selectOption("manufacturer-1");
      await editor.getByLabel("Dầu nhớt", { exact: true }).check();
    }
    await editor.getByRole("button", { name: "Lưu", exact: true }).click();
    await expect(
      page.getByRole("status").filter({ hasText: /^Đã/ }),
    ).toContainText("Đã thêm bản ghi");
    const row = page.getByRole("row").filter({
      hasText:
        moduleName === "contact-requests" ? "Liên hệ mới" : "Bản ghi mới",
    });
    await row.getByRole("button", { name: "Sửa", exact: true }).click();
    if (moduleName === "contact-requests")
      await editor
        .getByRole("combobox", { name: "Trạng thái", exact: true })
        .selectOption("RESOLVED");
    else await editor.getByLabel("Tên", { exact: true }).fill("Đã cập nhật");
    await page.screenshot({
      path: testInfo.outputPath("admin-editor.png"),
      fullPage: true,
    });
    await editor.getByRole("button", { name: "Lưu", exact: true }).click();
    await expect(
      page.getByRole("status").filter({ hasText: /^Đã/ }),
    ).toContainText("Đã lưu thay đổi");
    const updated = page.getByRole("row").filter({
      hasText:
        moduleName === "contact-requests" ? "Liên hệ mới" : "Đã cập nhật",
    });
    await updated.getByRole("button", { name: "Xóa", exact: true }).click();
    expect(writes.filter((item) => item.method === "DELETE")).toHaveLength(0);
    await page
      .getByRole("button", { name: "Xác nhận xóa", exact: true })
      .click();
    await expect(
      page.getByRole("status").filter({ hasText: /^Đã/ }),
    ).toContainText("Đã xóa bản ghi");
    expect(writes.map((item) => item.method)).toEqual([
      "POST",
      "PATCH",
      "DELETE",
    ]);
    if (moduleName === "products")
      expect(writes[0].body).toMatchObject({
        price: 123000,
        categoryIds: ["category-1"],
        manufacturerId: "manufacturer-1",
      });
    if (moduleName === "contact-requests") {
      expect(writes[0].body).not.toHaveProperty("status");
      expect(writes[1].body.status).toBe("RESOLVED");
    }
  });
}

test("mobile admin manages roles and prevents changing own role", async ({
  page,
}, testInfo) => {
  const writes = await mockAdmin(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/users");
  await expect(
    page
      .getByRole("row")
      .filter({ hasText: "admin@example.com" })
      .getByRole("button", { name: "Đổi vai trò" }),
  ).toBeDisabled();
  await page
    .getByRole("row")
    .filter({ hasText: "user@example.com" })
    .getByRole("button", { name: "Đổi vai trò" })
    .click();
  await page
    .getByRole("combobox", { name: "Vai trò", exact: true })
    .selectOption("ADMIN");
  await page.getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: /^Đã/ }),
  ).toContainText("Đã lưu thay đổi");
  expect(writes[0]).toMatchObject({ method: "PATCH", body: { role: "ADMIN" } });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("admin-mobile.png"),
    fullPage: true,
  });
});
