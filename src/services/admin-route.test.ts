import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, PATCH } from "@/app/api/admin/[...path]/route";

afterEach(() => vi.unstubAllGlobals());
const admin = {
  id: "admin-id",
  role: "ADMIN",
  fullName: "Admin",
  email: "admin@example.com",
};
function req(path: string, method = "GET", body?: unknown, cookie = "") {
  return new NextRequest(`http://localhost:3001/api/admin/${path}`, {
    method,
    headers: {
      origin: "http://localhost:3001",
      cookie,
      "content-type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
const context = (path: string) => ({
  params: Promise.resolve({ path: path.split("/") }),
});
it("requires authentication even for otherwise public product reads", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  const response = await GET(req("products"), context("products"));
  expect(response.status).toBe(401);
  expect(fetcher).not.toHaveBeenCalled();
});
it("blocks cross-origin mutations before contacting backend", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  const request = req("auth/login", "POST", { email: "a", password: "b" });
  request.headers.set("origin", "https://attacker.example");
  expect((await POST(request, context("auth/login"))).status).toBe(403);
  expect(fetcher).not.toHaveBeenCalled();
});
it("login stores HttpOnly cookies and never returns tokens to JavaScript", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        accessToken: "access",
        refreshToken: "refresh",
        expiresIn: 900,
        user: admin,
      }),
    ),
  );
  const response = await POST(
    req("auth/login", "POST", {
      email: "admin@example.com",
      password: "test-only",
    }),
    context("auth/login"),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(admin);
  expect(response.cookies.get("hl_admin_access")?.value).toBe("access");
  expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  expect(response.headers.get("set-cookie")).toContain("SameSite=strict");
});
it("rejects non-admin login and revokes the new backend session", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        accessToken: "access",
        user: { ...admin, role: "USER" },
      }),
    )
    .mockResolvedValueOnce(new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", fetcher);
  const response = await POST(
    req("auth/login", "POST", {}),
    context("auth/login"),
  );
  expect(response.status).toBe(403);
  expect(fetcher.mock.calls[1][0]).toContain("auth/logout");
});
it("checks current role before allowing CRUD and forwards bearer token", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(Response.json(admin))
    .mockResolvedValueOnce(Response.json({ id: "item", name: "Updated" }));
  vi.stubGlobal("fetch", fetcher);
  const response = await PATCH(
    req(
      "manufacturers/item",
      "PATCH",
      { name: "Updated" },
      "hl_admin_access=access",
    ),
    context("manufacturers/item"),
  );
  expect(response.status).toBe(200);
  expect(fetcher.mock.calls[1][1]).toMatchObject({
    method: "PATCH",
    body: JSON.stringify({ name: "Updated" }),
    headers: { Authorization: "Bearer access" },
  });
});
it("forwards a product image as multipart data only after checking the admin role", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(Response.json(admin))
    .mockResolvedValueOnce(
      Response.json({
        imagePath: "/uploads/new-image.png",
        imageUrl: "https://api.example/uploads/new-image.png",
      }),
    );
  vi.stubGlobal("fetch", fetcher);
  const form = new FormData();
  form.append("file", new Blob(["image"], { type: "image/png" }), "image.png");
  const request = new NextRequest(
    "http://localhost:3001/api/admin/uploads/products",
    {
      method: "POST",
      headers: {
        origin: "http://localhost:3001",
        cookie: "hl_admin_access=access",
      },
      body: form,
    },
  );

  expect((await POST(request, context("uploads/products"))).status).toBe(200);
  expect(fetcher.mock.calls[1][0]).toContain("uploads/products");
  expect(fetcher.mock.calls[1][1]).toMatchObject({
    method: "POST",
    headers: expect.objectContaining({ Authorization: "Bearer access" }),
  });
  expect(fetcher.mock.calls[1][1].headers["Content-Type"]).toMatch(
    /^multipart\/form-data; boundary=/,
  );
});
it("denies a session whose role was downgraded", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue(Response.json({ ...admin, role: "USER" }));
  vi.stubGlobal("fetch", fetcher);
  expect(
    (
      await GET(
        req("users", "GET", undefined, "hl_admin_access=access"),
        context("users"),
      )
    ).status,
  ).toBe(403);
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it("rotates refresh cookies and clears an expired refresh session", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        accessToken: "next-access",
        refreshToken: "next-refresh",
        expiresIn: 900,
        user: admin,
      }),
    )
    .mockResolvedValueOnce(
      Response.json({ message: "Expired" }, { status: 401 }),
    );
  vi.stubGlobal("fetch", fetcher);
  const response = await POST(
    req("auth/refresh", "POST", undefined, "hl_admin_refresh=old"),
    context("auth/refresh"),
  );
  expect(fetcher.mock.calls[0][1].body).toBe(
    JSON.stringify({ refreshToken: "old" }),
  );
  expect(response.cookies.get("hl_admin_refresh")?.value).toBe("next-refresh");
  const expired = await POST(
    req("auth/refresh", "POST", undefined, "hl_admin_refresh=old"),
    context("auth/refresh"),
  );
  expect(expired.status).toBe(401);
  expect(expired.cookies.get("hl_admin_refresh")?.value).toBe("");
});
