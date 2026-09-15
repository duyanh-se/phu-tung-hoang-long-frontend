import { expect, test, type Page } from "@playwright/test";

async function mockCatalog(page: Page, missing = false) {
  await page.route("**/api/v1/manufacturers?**", (route) =>
    route.fulfill({
      json: {
        data: missing ? [] : [{ id: "denis-id", name: "DENIS" }],
        totalPages: 1,
      },
    }),
  );
  await page.route("**/api/v1/products?**", (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get("manufacturerId")).toBe("denis-id");
    const currentPage = Number(url.searchParams.get("page") || 1);
    return route.fulfill({
      json: {
        data: [
          {
            id: "oil-1",
            name: "DENIS MAXSPEED 10W40",
            code: "DENIS-01",
            imageUrl: null,
            price: "67000",
            currency: "VND",
            manufacturer: { name: "DENIS" },
          },
        ],
        page: currentPage,
        limit: 12,
        total: 13,
        totalPages: 2,
      },
    });
  });
}

for (const viewport of [
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1440, height: 600 },
]) {
  test(`story remains readable at ${viewport.width}x${viewport.height}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await mockCatalog(page);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.locator("[data-hero-line]").first()).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.locator("[data-hero-line]").last()).toHaveCSS(
      "opacity",
      "1",
    );
    await page.screenshot({ path: testInfo.outputPath("hero.png") });
    for (const section of [
      "#cau-chuyen",
      "#denis",
      "#san-pham-denis",
      "#khong-gian",
      "#ket-noi",
    ]) {
      const target = page.locator(section);
      if (await target.count()) await target.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
    }
    await expect(page.locator("#san-pham-denis h3")).toHaveText(
      "DENIS MAXSPEED 10W40",
    );
    if (viewport.width >= 1024 && viewport.height >= 700) {
      await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);
      await expect(page.locator(".story-progress")).toHaveCount(0);
      await page
        .locator("[data-story-chapter]")
        .nth(2)
        .scrollIntoViewIfNeeded();
      await expect(page.locator("[data-story-panel]").nth(2)).toHaveCSS(
        "opacity",
        "1",
      );
      await expect(page.locator("[data-story-panel]").nth(0)).toHaveCSS(
        "opacity",
        "0",
      );
      await expect(page.locator("[data-story-panel]").nth(2)).toHaveCSS(
        "transform",
        "none",
      );
      await expect(page.locator("[data-story-content]").nth(2)).toHaveCSS(
        "opacity",
        "1",
      );
      await expect(page.locator(".story-stage")).toHaveCSS(
        "position",
        "sticky",
      );
      await page.screenshot({ path: testInfo.outputPath("story.png") });
    } else {
      await expect(page.locator(".story-track")).not.toHaveClass(
        /story-enhanced/,
      );
      await expect(page.locator(".story-inline").first()).toBeVisible();
    }
    await expect(page.locator(".gallery-capability-card")).toHaveCount(3);
    expect(errors).toEqual([]);
  });
}

test("reduced motion, resize cleanup and route return", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".story-track")).not.toHaveClass(/story-enhanced/);
  await expect(page.locator("[data-hero-image]")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator("[data-denis-reveal]").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(".denis-bridge-pin")).toHaveCSS(
    "position",
    "static",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(page.locator(".story-track")).not.toHaveClass(/story-enhanced/);
  await page.getByRole("link", { name: "Xem tất cả DENIS" }).click();
  await expect(page).toHaveURL(/san-pham\?manufacturer=DENIS/);
  await page.getByLabel("Tìm theo tên hoặc mã phụ tùng").fill("MAXSPEED");
  await page.getByRole("button", { name: "Tìm kiếm" }).click();
  await expect(page).toHaveURL(/manufacturer=DENIS&search=MAXSPEED/);
  await page.getByRole("button", { name: /Sau|Tiếp/ }).click();
  await expect(page).toHaveURL(/manufacturer=DENIS&search=MAXSPEED&page=2/);
  await page
    .getByRole("link", { name: "Phụ Tùng Hoàng Long", exact: true })
    .first()
    .click();
  await expect(page.locator("h1")).toContainText("Hoàng Long.");
  await expect(page.locator("[data-hero-line]").last()).toHaveCSS(
    "opacity",
    "1",
  );
});

test("enhanced scenes provide progress, bridge and hover feedback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".section-progress")).toHaveCount(0);
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);
  await page.evaluate(() => scrollTo(0, 160));
  await expect(page.locator(".site-header")).toHaveAttribute(
    "data-compact",
    "true",
  );
  await page
    .locator("#denis")
    .evaluate((section) =>
      scrollTo(0, section.getBoundingClientRect().top + scrollY),
    );
  await expect(page.locator(".denis-bridge-pin")).toHaveCSS(
    "position",
    "sticky",
  );
  await expect(page.locator("[data-denis-bridge-title]")).toBeVisible();
  await page.locator("#san-pham-denis").scrollIntoViewIfNeeded();
  const card = page.locator(".product-card").first();
  await card.hover();
  await expect
    .poll(() => card.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe("none");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".section-progress")).toHaveCount(0);
  await expect(page.locator(".denis-bridge-pin")).toHaveCSS(
    "position",
    "static",
  );
});

test("DENIS content panel slides up to replace the brand title", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);

  await page
    .locator("[data-denis-bridge]")
    .evaluate((bridge) =>
      scrollTo(
        0,
        bridge.getBoundingClientRect().top +
          scrollY +
          bridge.clientHeight -
          innerHeight,
      ),
    );

  await expect
    .poll(() =>
      page.evaluate(() => {
        const panel = document.querySelector<HTMLElement>("[data-denis-panel]");
        const title = document.querySelector<HTMLElement>(
          "[data-denis-bridge-title]",
        );
        if (!panel || !title) return false;
        const bounds = panel.getBoundingClientRect();
        return (
          Number(getComputedStyle(title).opacity) <= 0.01 &&
          Math.abs(bounds.top) <= 1 &&
          Math.abs(bounds.bottom - innerHeight) <= 1
        );
      }),
    )
    .toBe(true);
});

test("product section rises over the sticky DENIS panel", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator("#denis")).toHaveClass(/denis-enhanced/);

  // Check the whole covering interval, then reverse direction.
  for (const nextTop of [900, 450, 1, 450, 900]) {
    await page.locator("#san-pham-denis").evaluate((products, top) => {
      scrollTo(0, products.getBoundingClientRect().top + scrollY - top);
    }, nextTop);
    await expect
      .poll(() =>
        page.evaluate((top) => {
          const panel =
            document.querySelector<HTMLElement>("[data-denis-panel]")!;
          const stage =
            document.querySelector<HTMLElement>(".denis-bridge-pin")!;
          const products =
            document.querySelector<HTMLElement>("#san-pham-denis")!;
          const covered =
            top >= innerHeight ||
            Boolean(
              document
                .elementFromPoint(
                  innerWidth / 2,
                  Math.min(top + 20, innerHeight - 1),
                )
                ?.closest("#san-pham-denis"),
            );
          return (
            Math.abs(panel.getBoundingClientRect().top) <= 1 &&
            Math.abs(stage.getBoundingClientRect().top) <= 1 &&
            Math.abs(products.getBoundingClientRect().top - top) <= 1 &&
            covered
          );
        }, nextTop),
      )
      .toBe(true);
  }
});

test("product stage stays centered until gallery covers it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);

  await page
    .locator("#san-pham-denis")
    .evaluate((section) =>
      scrollTo(0, section.getBoundingClientRect().top + scrollY + 120),
    );

  await expect(page.locator("[data-products-stage]")).toHaveCSS(
    "position",
    "sticky",
  );
  await expect
    .poll(() =>
      page.evaluate(() => {
        const stage = document.querySelector<HTMLElement>(
          "[data-products-stage]",
        );
        const gallery = document.querySelector<HTMLElement>("#khong-gian");
        if (!stage || !gallery) return false;
        const stageBounds = stage.getBoundingClientRect();
        const galleryBounds = gallery.getBoundingClientRect();
        const stageCenter = stageBounds.top + stageBounds.height / 2;
        return (
          Math.abs(stageCenter - innerHeight / 2) <= 1 && galleryBounds.top > 0
        );
      }),
    )
    .toBe(true);
});

test("desktop sections pin in place before the next section covers them", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);

  const hero = page.locator("#hoang-long");
  const story = page.locator("#cau-chuyen");
  await page.evaluate(() => scrollTo(0, 180));

  await expect(hero).toHaveAttribute("data-stack-pinned", "");
  await expect(hero).toHaveCSS("position", "fixed");
  await expect
    .poll(() =>
      Promise.all([
        hero.evaluate((element) => Number(getComputedStyle(element).zIndex)),
        story.evaluate((element) => Number(getComputedStyle(element).zIndex)),
      ]).then(([heroIndex, storyIndex]) => storyIndex > heroIndex),
    )
    .toBe(true);
});

test("header pins through the hero and leaves before Store Story covers it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);

  const header = page.locator(".site-header");
  await expect(header).toHaveAttribute("data-home-stack", "true");
  await page.evaluate(() => scrollTo(0, 160));
  await expect(header).toHaveAttribute("data-home-pinned", "");
  await expect(header).toHaveCSS("position", "fixed");

  await page
    .locator("#cau-chuyen")
    .evaluate((section) =>
      scrollTo(0, section.getBoundingClientRect().top + scrollY),
    );
  await expect(header).not.toHaveAttribute("data-home-pinned", "");
  await expect(header).toHaveCSS("position", "relative");
});

test("active Store Story copy stays centered with its image", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);

  await page
    .locator("[data-story-chapter]")
    .nth(1)
    .evaluate((chapter) =>
      scrollTo(
        0,
        chapter.getBoundingClientRect().top + scrollY - innerHeight * 0.3,
      ),
    );

  await expect
    .poll(() =>
      page.evaluate(() => {
        const copy = document.querySelectorAll<HTMLElement>(
          "[data-story-content]",
        )[1];
        const visual = document.querySelector<HTMLElement>(
          ".story-stage-visual",
        );
        if (!copy || !visual) return false;
        const copyBounds = copy.getBoundingClientRect();
        const visualBounds = visual.getBoundingClientRect();
        const copyCenter = copyBounds.top + copyBounds.height / 2;
        const visualCenter = visualBounds.top + visualBounds.height / 2;
        return Math.abs(copyCenter - visualCenter) <= 1;
      }),
    )
    .toBe(true);
});

test("Store Story text leaves space while chapters trade places", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);

  await page
    .locator("[data-story-chapter]")
    .nth(1)
    .evaluate((chapter) =>
      scrollTo(
        0,
        chapter.getBoundingClientRect().top + scrollY - innerHeight / 2,
      ),
    );

  await expect
    .poll(() =>
      page.evaluate(() => {
        const outgoing = document.querySelectorAll<HTMLElement>(
          "[data-story-content]",
        )[0];
        const incoming = document.querySelectorAll<HTMLElement>(
          "[data-story-content]",
        )[1];
        if (!outgoing || !incoming) return false;
        const outgoingCenter =
          outgoing.getBoundingClientRect().top +
          outgoing.getBoundingClientRect().height / 2;
        const incomingCenter =
          incoming.getBoundingClientRect().top +
          incoming.getBoundingClientRect().height / 2;
        return Math.abs(incomingCenter - outgoingCenter) >= 140;
      }),
    )
    .toBe(true);
});

test("gallery stays image-led after direct section navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockCatalog(page);
  await page.goto("/");
  await page
    .locator("#khong-gian")
    .evaluate((section) =>
      scrollTo(0, section.getBoundingClientRect().top + scrollY),
    );

  const firstCard = page.locator(".gallery-capability-card").first();
  await expect(firstCard.locator("img")).toBeVisible();
  await expect(firstCard.locator("[data-gallery-caption]")).toHaveCount(0);
});

test("landing removes numbered section and chapter labels", async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto("/");

  await expect(page.getByText("03 — HÃNG SẢN PHẨM")).toHaveCount(0);
  await expect(page.getByText("04 — SẢN PHẨM DENIS")).toHaveCount(0);
  await expect(page.getByText("05 — MỘT GÓC HOÀNG LONG")).toHaveCount(0);
  await expect(page.getByText("01 / TỪ QUẦY HÀNG")).toHaveCount(0);
});

test("footer provides a client-side contact form without an external submission", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();

  await expect(page.getByRole("heading", { name: "Liên hệ" })).toBeVisible();
  await page.getByLabel("Họ và tên *").fill("Nguyễn An");
  await page.getByLabel("Email liên lạc *").fill("an@example.com");
  await page.getByLabel("Số điện thoại *").fill("0900000000");
  await page.getByRole("button", { name: "Gửi liên hệ" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Form đang chờ kết nối kênh tiếp nhận liên hệ.",
  );
});

test("back to top appears after scrolling and returns to the hero", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockCatalog(page);
  await page.goto("/");
  const button = page.getByRole("button", { name: "Về đầu trang" });
  await expect(button).toBeHidden();
  await page.evaluate(() => scrollTo(0, 900));
  await expect(button).toBeVisible();
  await button.click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(button).toBeHidden();
});

test("missing manufacturer never displays unfiltered products", async ({
  page,
}) => {
  await mockCatalog(page, true);
  let productRequests = 0;
  page.on("request", (request) => {
    if (request.url().includes("/api/v1/products")) productRequests++;
  });
  await page.goto("/san-pham?manufacturer=DENIS");
  await expect(
    page.getByRole("alert").filter({ hasText: "Chưa tìm thấy hãng" }),
  ).toContainText("Chưa tìm thấy hãng DENIS");
  expect(productRequests).toBe(0);
});

test("static story and navigation survive disabled JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3001/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".story-inline")).toHaveCount(3);
  await expect(page.locator(".story-inline").first()).toBeVisible();
  await expect(page.locator("#denis h2")).toBeVisible();
  await context.close();
});
