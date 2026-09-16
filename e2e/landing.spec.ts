import { expect, test, type Page } from "@playwright/test";

async function mockCatalog(page: Page, missing = false, count = 1) {
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
        data: Array.from({ length: count }, (_, index) => ({
          id: `oil-${index + 1}`,
          name:
            index === 0
              ? "DENIS MAXSPEED 10W40"
              : `DENIS MAXSPEED ${index + 1}`,
          code: `DENIS-${String(index + 1).padStart(2, "0")}`,
          imageUrl: null,
          price: "67000",
          currency: "VND",
          manufacturer: { name: "DENIS" },
        })),
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
    await expect(
      page.getByRole("heading", { name: "Khám phá cửa hàng" }),
    ).toHaveCount(1);
    for (const section of [
      "#cau-chuyen",
      "#denis",
      "#san-pham-denis",
      "#khong-gian",
      "#ket-noi",
    ]) {
      const target = page.locator(section);
      if (await target.count()) await target.scrollIntoViewIfNeeded();
      if (section === "#cau-chuyen") {
        await page.waitForTimeout(700);
        await page.screenshot({
          path: testInfo.outputPath("story-section.png"),
        });
      }
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
      await expect(page.locator(".story-stage-shell")).toHaveCSS(
        "position",
        "sticky",
      );
      await expect
        .poll(() =>
          page.evaluate(() => {
            const heading = document.querySelector<HTMLElement>(
              "[data-story-heading]",
            );
            const stage = document.querySelector<HTMLElement>(".story-stage");
            const shell =
              document.querySelector<HTMLElement>(".story-stage-shell");
            if (!heading || !stage || !shell) return false;
            const headingBounds = heading.getBoundingClientRect();
            const stageBounds = stage.getBoundingClientRect();
            const shellBounds = shell.getBoundingClientRect();
            return (
              headingBounds.bottom <= stageBounds.top &&
              Math.abs(
                shellBounds.top + shellBounds.height / 2 - innerHeight / 2,
              ) <= 1
            );
          }),
        )
        .toBe(true);
      await page.screenshot({ path: testInfo.outputPath("story.png") });
    } else {
      await expect(page.locator(".story-track")).not.toHaveClass(
        /story-enhanced/,
      );
      await expect(page.locator(".story-inline").first()).toBeVisible();
    }
    await expect(page.locator(".gallery-capability-card")).toHaveCount(0);
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
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);

  await page
    .locator("[data-denis-bridge]")
    .evaluate((bridge) =>
      scrollTo(0, bridge.getBoundingClientRect().top + scrollY),
    );
  await page.screenshot({ path: testInfo.outputPath("denis-banner.png") });

  await page
    .locator("[data-denis-bridge]")
    .evaluate((bridge) =>
      scrollTo(
        0,
        bridge.getBoundingClientRect().top + scrollY + innerHeight * 1.3,
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

test("DENIS introduction shows the supplied product media", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");

  const section = page.locator("#denis");
  await expect(
    section.getByAltText(
      "Các thùng dầu nhớt DENIS được xếp trong xe giao hàng",
    ),
  ).toBeVisible();
  const documentPanels = section.locator("[data-denis-document-panel]");
  await expect(documentPanels.nth(0)).toHaveAttribute(
    "href",
    "/images/shop/denis/745503622_1367201702021569_7003704816950467242_n.jpg",
  );
  await expect(documentPanels.nth(1)).toHaveAttribute("target", "_blank");
  await expect(documentPanels).toHaveCount(3);
  await section
    .locator("[data-denis-bridge]")
    .evaluate((bridge) =>
      scrollTo(
        0,
        bridge.getBoundingClientRect().top + scrollY + innerHeight * 1.3,
      ),
    );
  await section
    .locator("[data-denis-panel]")
    .screenshot({ path: testInfo.outputPath("denis-media.png") });
  const documentStage = section.locator(".denis-document-stage");
  await expect(documentStage.locator("a")).toHaveCount(3);
  await section
    .locator(".denis-document-track")
    .evaluate((track) =>
      scrollTo(
        0,
        track.getBoundingClientRect().top +
          scrollY +
          ((track as HTMLElement).offsetHeight - innerHeight) * 0.5,
      ),
    );
  await page.waitForTimeout(900);
  await documentStage.screenshot({
    path: testInfo.outputPath("denis-documents-stack.png"),
  });
  await section
    .locator(".denis-document-track")
    .evaluate((track) =>
      scrollTo(
        0,
        track.getBoundingClientRect().top +
          scrollY +
          ((track as HTMLElement).offsetHeight - innerHeight) * 0.75,
      ),
    );
  await page.waitForTimeout(900);
  await expect(documentStage).toHaveCSS("position", "sticky");
  await expect(section.locator("[data-denis-document-panel]").nth(2)).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(section.locator(".denis-document-card").nth(2)).toBeInViewport();
  await documentStage.screenshot({
    path: testInfo.outputPath("denis-documents.png"),
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(section).not.toHaveClass(/denis-enhanced/);
  const featureImage = section.getByAltText(
    "Các thùng dầu nhớt DENIS được xếp trong xe giao hàng",
  );
  await featureImage.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("denis-media-mobile.png"),
  });
});

test("DENIS documents alternate sides over fixed exclusive descriptions", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  const track = page.locator(".denis-document-track");
  await expect(track).toHaveClass(/denis-documents-enhanced/);
  for (const progress of [0.2, 0.45, 0.7, 0.375, 0.125]) {
    await track.evaluate(
      (element, progress) =>
        scrollTo(
          0,
          element.getBoundingClientRect().top +
            scrollY +
            ((element as HTMLElement).offsetHeight - innerHeight) * progress,
        ),
      progress,
    );
    await page.waitForTimeout(1200);
    const index = Math.min(2, Math.floor(progress * 4));
    const state = await page.evaluate((index) => {
      const copies = [
        ...document.querySelectorAll<HTMLElement>("[data-denis-document-copy]"),
      ];
      const active = copies[index].getBoundingClientRect();
      const card = document
        .querySelectorAll<HTMLElement>(".denis-document-card")
        [index].getBoundingClientRect();
      return {
        visible: copies.map((copy) => Number(getComputedStyle(copy).opacity)),
        centerX: active.x + active.width / 2,
        centerY: active.y + active.height / 2,
        cardCenterX: card.x + card.width / 2,
      };
    }, index);
    expect(state.visible[index]).toBeGreaterThan(0.75);
    for (const [copyIndex, opacity] of state.visible.entries()) {
      if (copyIndex !== index) expect(opacity).toBeLessThan(0.25);
    }
    expect(Math.abs(state.centerX - 720)).toBeLessThanOrEqual(1);
    expect(Math.abs(state.centerY - 450)).toBeLessThanOrEqual(20);
    if (index % 2 === 0) expect(state.cardCenterX).toBeLessThan(720);
    else expect(state.cardCenterX).toBeGreaterThan(720);
    await page.screenshot({
      path: testInfo.outputPath(`denis-alternate-${progress}.png`),
    });
  }
});

test("DENIS final image exits above the viewport before products enter", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator("#denis")).toHaveClass(/denis-enhanced/);

  const track = page.locator(".denis-document-track");
  await expect(track).toHaveClass(/denis-documents-enhanced/);
  await track.evaluate((storyTrack) =>
    scrollTo(
      0,
      storyTrack.getBoundingClientRect().top +
        scrollY +
        ((storyTrack as HTMLElement).offsetHeight - innerHeight) * 0.75,
    ),
  );
  await page.waitForTimeout(900);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const stage = document.querySelector<HTMLElement>(
          ".denis-document-stage",
        );
        const finalPanel = document.querySelectorAll<HTMLElement>(
          "[data-denis-document-panel]",
        )[2];
        const products = document.querySelector<HTMLElement>("#san-pham-denis");
        if (!stage || !finalPanel || !products) return false;
        return (
          getComputedStyle(stage).position === "sticky" &&
          Number(getComputedStyle(finalPanel).opacity) === 1 &&
          products.getBoundingClientRect().top >= innerHeight
        );
      }),
    )
    .toBe(true);
  await page
    .locator("#san-pham-denis")
    .evaluate((products) =>
      scrollTo(0, products.getBoundingClientRect().top + scrollY - 450),
    );
  await expect
    .poll(() =>
      page.evaluate(() => {
        const finalPanel = document.querySelectorAll<HTMLElement>(
          "[data-denis-document-panel]",
        )[2];
        const products = document.querySelector<HTMLElement>("#san-pham-denis");
        if (!finalPanel || !products) return false;
        return (
          Number(getComputedStyle(finalPanel).opacity) === 1 &&
          Boolean(
            document
              .elementFromPoint(innerWidth / 2, innerHeight / 2)
              ?.closest("#san-pham-denis"),
          )
        );
      }),
    )
    .toBe(true);
  for (const offset of [900, 450, 1]) {
    await page
      .locator("#san-pham-denis")
      .evaluate(
        (products, offset) =>
          scrollTo(0, products.getBoundingClientRect().top + scrollY - offset),
        offset,
      );
    await expect
      .poll(() =>
        page
          .locator(".denis-document-card")
          .last()
          .evaluate((card) => card.getBoundingClientRect().bottom),
      )
      .toBeLessThanOrEqual(0);
    await page.screenshot({
      path: testInfo.outputPath(`denis-exit-${offset}.png`),
    });
  }
});

test("product stage stays centered while the product rail crosses horizontally", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page, false, 6);
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
  await expect(page.locator(".product-card-compact")).toHaveCount(6);
  await expect(page.locator("#san-pham-denis")).toHaveClass(
    /products-rail-enhanced/,
  );
  await expect
    .poll(() =>
      page.evaluate(() => {
        const stage = document.querySelector<HTMLElement>(
          "[data-products-stage]",
        );
        const gallery = document.querySelector<HTMLElement>("#ket-noi");
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
  const track = page.locator(".products-track");
  await track.evaluate((element) =>
    scrollTo(
      0,
      element.getBoundingClientRect().top +
        scrollY +
        ((element as HTMLElement).offsetHeight - innerHeight) * 0.5,
    ),
  );
  await expect
    .poll(() =>
      page
        .locator("[data-products-rail]")
        .evaluate((rail) => getComputedStyle(rail).transform),
    )
    .not.toBe("none");
  await page
    .locator(".product-card-compact h3")
    .nth(1)
    .evaluate((el) => {
      el.textContent = "Nhớt Denis số 0.8L 10W40 MAXSPEED SAE API SL JASO MA2";
    });
  const heights = await page
    .locator(".product-card-compact")
    .evaluateAll((cards) =>
      cards.map((card) => card.getBoundingClientRect().height),
    );
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
  await page.waitForTimeout(1500);
  await expect(
    page.locator("#san-pham-denis .section-heading"),
  ).toBeInViewport();
  await expect(
    page.getByRole("link", { name: "Xem tất cả DENIS" }),
  ).toBeInViewport();
  await expect
    .poll(() =>
      page
        .locator(".products-stage")
        .evaluate((stage) => stage.getBoundingClientRect().width <= innerWidth),
    )
    .toBe(true);
  await page.screenshot({ path: testInfo.outputPath("products-rail.png") });
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

test("Store Story stays below the hero during section entry", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1920, height: 934 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);
  for (const y of [0, 180, 600]) {
    await page.evaluate((offset) => scrollTo(0, offset), y);
    await expect
      .poll(() =>
        page.evaluate(() => {
          const section = document
            .querySelector("#cau-chuyen")!
            .getBoundingClientRect();
          const stage = document
            .querySelector(".story-stage")!
            .getBoundingClientRect();
          const heading = document
            .querySelector("[data-story-heading]")!
            .getBoundingClientRect();
          const shell = document
            .querySelector(".story-stage-shell")!
            .getBoundingClientRect();
          return shell.top >= section.top && stage.top >= heading.bottom;
        }),
      )
      .toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`story-entry-${y}.png`),
    });
  }
});

test("Store Story heading leaves with its section before DENIS takes over", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);

  await page
    .locator("#denis")
    .evaluate((section) =>
      scrollTo(0, section.getBoundingClientRect().top + scrollY + 120),
    );

  await expect
    .poll(() =>
      page.evaluate(() => {
        const heading = document.querySelector<HTMLElement>(
          "[data-story-heading]",
        );
        const denis = document.querySelector<HTMLElement>("#denis");
        if (!heading || !denis) return false;
        return (
          heading.getBoundingClientRect().bottom <= 0 &&
          denis.getBoundingClientRect().top <= 0
        );
      }),
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
  await expect(header).toHaveCSS("position", "absolute");
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

test("Store Story completes exclusive scenes when scrolling stops or reverses", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockCatalog(page);
  await page.goto("/");
  await expect(page.locator(".story-track")).toHaveClass(/story-enhanced/);
  for (const [index, offset] of [
    [1, 0.49],
    [0, 0.51],
    [4, 0.49],
    [2, 0.49],
  ]) {
    const result = await page.evaluate(
      async ({ index, offset }) => {
        const chapters = document.querySelectorAll<HTMLElement>(
          "[data-story-chapter]",
        );
        const copies = [
          ...document.querySelectorAll<HTMLElement>("[data-story-content]"),
        ];
        const images = [
          ...document.querySelectorAll<HTMLElement>("[data-story-panel]"),
        ];
        const target = index === 0 ? chapters[1] : chapters[index];
        scrollTo(
          0,
          target.getBoundingClientRect().top + scrollY - innerHeight * offset,
        );
        let overlap = false;
        const start = performance.now();
        while (performance.now() - start < 2200) {
          await new Promise(requestAnimationFrame);
          for (const layers of [copies, images]) {
            if (
              layers.filter(
                (layer) => Number(getComputedStyle(layer).opacity) > 0.001,
              ).length > 1
            )
              overlap = true;
          }
        }
        return {
          overlap,
          copies: copies.map((layer) =>
            Number(getComputedStyle(layer).opacity),
          ),
          images: images.map((layer) =>
            Number(getComputedStyle(layer).opacity),
          ),
        };
      },
      { index, offset },
    );
    expect(result.overlap).toBe(false);
    for (const [position, opacity] of result.copies.entries()) {
      expect(opacity).toBeCloseTo(position === index ? 1 : 0, 3);
      expect(result.images[position]).toBeCloseTo(opacity, 3);
    }
    await page.screenshot({
      path: testInfo.outputPath(`story-settled-${index}.png`),
    });
  }
});

test("store gallery is removed and contact remains accessible", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockCatalog(page);
  await page.goto("/");
  await page
    .locator("#ket-noi")
    .evaluate((section) =>
      scrollTo(0, section.getBoundingClientRect().top + scrollY),
    );

  await expect(page.locator("#khong-gian")).toHaveCount(0);
  await page.locator("#ket-noi").scrollIntoViewIfNeeded();
  await expect(page.locator("#ket-noi")).toBeInViewport();
  await page.screenshot({
    path: testInfo.outputPath("contact-without-gallery.png"),
  });
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

for (const width of [390, 1440]) {
  test(`footer submits contact requests at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await mockCatalog(page);
    let requests = 0;
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/api/v1/contact-requests", async (route) => {
      requests++;
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toEqual({
        fullName: "Nguyễn An",
        email: "an@example.com",
        phoneNumber: "0900000000",
        reason: "Tư vấn sản phẩm",
      });
      await gate;
      await route.fulfill({
        status: 201,
        json: { id: "contact-id", status: "NEW" },
      });
    });
    await page.goto("/");
    await page.getByLabel("Họ và tên *").fill("  Nguyễn An  ");
    await page.getByLabel("Email liên lạc *").fill("An@example.com");
    await page.getByLabel("Số điện thoại *").fill("090 000 0000");
    await page.getByLabel("Lý do liên hệ").selectOption("Tư vấn sản phẩm");
    await page.getByRole("button", { name: "Gửi liên hệ" }).click();
    await expect(
      page.getByRole("button", { name: "Đang gửi..." }),
    ).toBeDisabled();
    await page
      .locator(".footer-contact-form")
      .evaluate((form: HTMLFormElement) => form.requestSubmit());
    release();
    await expect(page.getByRole("status")).toContainText(
      "Gửi liên hệ thành công",
    );
    expect(requests).toBe(1);
    await expect(page.getByLabel("Họ và tên *")).toHaveValue("");
    await page
      .locator(".footer-contact-form")
      .screenshot({ path: testInfo.outputPath("contact-success.png") });
  });
}

test("footer preserves input after errors and supports retry without a reason", async ({
  page,
}) => {
  await mockCatalog(page);
  let requests = 0;
  await page.route("**/api/v1/contact-requests", async (route) => {
    expect(route.request().postDataJSON().reason).toBeNull();
    requests++;
    if (requests === 1) await route.abort("failed");
    else if (requests === 2)
      await route.fulfill({
        status: 429,
        json: { message: "Too Many Requests" },
      });
    else await route.fulfill({ status: 201, json: { id: "contact-id" } });
  });
  await page.goto("/");
  await page.getByLabel("Họ và tên *").fill("Nguyễn An");
  await page.getByLabel("Email liên lạc *").fill("an@example.com");
  await page.getByLabel("Số điện thoại *").fill("0900000000");
  await page.getByRole("button", { name: "Gửi liên hệ" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Không kết nối được máy chủ",
  );
  await expect(page.getByLabel("Họ và tên *")).toHaveValue("Nguyễn An");
  await page.getByRole("button", { name: "Gửi liên hệ" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Bạn gửi yêu cầu quá nhanh",
  );
  await page.getByRole("button", { name: "Gửi liên hệ" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Gửi liên hệ thành công",
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
  await expect(page.locator(".story-inline")).toHaveCount(5);
  await expect(page.locator(".story-inline").first()).toBeVisible();
  await expect(page.locator(".story-inline img").first()).toHaveAttribute(
    "alt",
    "Mặt tiền cửa hàng phụ tùng xe máy Hoàng Long vào buổi tối",
  );
  await expect(page.locator(".story-inline img").last()).toHaveAttribute(
    "alt",
    "Quầy trưng bày dầu nhớt DENIS và phụ tùng tại Hoàng Long",
  );
  await expect(page.locator("#denis h2")).toBeVisible();
  await context.close();
});
