import { expect, test } from "@playwright/test";
for (const width of [390, 1440]) {
  test(`user login, restore and logout at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    let signedIn = false;
    const profile = {
      id: "test-user",
      role: "USER",
      email: "user@example.com",
      fullName: "Khách hàng",
    };
    await page.route("**/api/auth/**", async (route) => {
      const action = new URL(route.request().url()).pathname.split("/").pop();
      if (action === "login") {
        if (route.request().postDataJSON().password !== "correct")
          return route.fulfill({ status: 401, json: { message: "Invalid" } });
        signedIn = true;
        return route.fulfill({ json: profile });
      }
      if (action === "logout") {
        signedIn = false;
        return route.fulfill({ status: 204 });
      }
      return route.fulfill({
        status: signedIn ? 200 : 401,
        json: signedIn ? profile : { message: "Unauthenticated" },
      });
    });
    await page.goto("/san-pham");
    await page.getByRole("link", { name: "Đăng nhập", exact: true }).click();
    await page.getByLabel("Email", { exact: true }).fill(profile.email);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("wrong");
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Email hoặc mật khẩu không đúng",
    );
    await page.screenshot({ path: testInfo.outputPath("login.png") });
    await page.getByLabel("Mật khẩu", { exact: true }).fill("correct");
    await page
      .getByRole("button", { name: "Hiện mật khẩu", exact: true })
      .click();
    await expect(page.locator("#user-password")).toHaveAttribute(
      "type",
      "text",
    );
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page).toHaveURL(/\/san-pham$/);
    await expect(page.locator("header")).toContainText("Khách hàng");
    await page.reload();
    await expect(
      page.getByRole("button", { name: "Đăng xuất", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
    await expect(
      page.getByRole("link", { name: "Đăng nhập", exact: true }),
    ).toBeVisible();
  });
}
