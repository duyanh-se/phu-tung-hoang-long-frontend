import { expect, test } from "@playwright/test";
for (const width of [390, 1440]) {
  test(`registration validation, conflict and session at ${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    let calls = 0;
    let signedIn = false;
    const profile = {
      id: "new-user",
      fullName: "Nguyễn Văn An",
      email: "new@example.com",
      role: "USER",
    };
    await page.route("**/api/auth/**", async (route) => {
      const action = new URL(route.request().url()).pathname.split("/").pop();
      if (action === "register") {
        calls++;
        expect(route.request().postDataJSON()).toEqual({
          fullName: profile.fullName,
          email: profile.email,
          password: "StrongPass123",
        });
        if (calls === 1)
          return route.fulfill({ status: 409, json: { message: "Conflict" } });
        signedIn = true;
        return route.fulfill({ json: profile });
      }
      return route.fulfill({
        status: signedIn ? 200 : 401,
        json: signedIn ? profile : { message: "Unauthenticated" },
      });
    });
    await page.goto("/dang-nhap");
    await page.getByRole("link", { name: "Đăng ký ngay" }).click();
    await expect(page).toHaveURL(/\/dang-ky$/);
    await page.getByLabel("Họ và tên", { exact: true }).fill(profile.fullName);
    await page.getByLabel("Email", { exact: true }).fill(profile.email);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("StrongPass123");
    await page
      .getByLabel("Nhập lại mật khẩu", { exact: true })
      .fill("different");
    await page.getByRole("button", { name: "Đăng ký", exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "không khớp",
    );
    expect(calls).toBe(0);
    await page
      .getByLabel("Nhập lại mật khẩu", { exact: true })
      .fill("StrongPass123");
    await page.getByRole("button", { name: "Đăng ký", exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Email này đã được sử dụng",
    );
    await page.screenshot({
      path: testInfo.outputPath("register.png"),
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Đăng ký", exact: true }).click();
    await expect(page).toHaveURL(/\/san-pham$/);
    await expect(page.locator("header")).toContainText(profile.fullName);
    await page.reload();
    await expect(page.locator("header")).toContainText(profile.fullName);
    expect(calls).toBe(2);
  });
}
