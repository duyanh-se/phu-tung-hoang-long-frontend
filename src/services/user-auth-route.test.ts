import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/auth/[...path]/route";
afterEach(() => vi.unstubAllGlobals());
it("register creates a session without exposing tokens", async () => {
  const profile = {
    id: "new",
    role: "USER",
    email: "new@example.com",
    fullName: "New User",
  };
  const fetcher = vi
    .fn()
    .mockResolvedValue(
      Response.json(
        {
          user: profile,
          accessToken: "access",
          refreshToken: "refresh",
          expiresIn: 900,
        },
        { status: 201 },
      ),
    );
  vi.stubGlobal("fetch", fetcher);
  const request = new NextRequest("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: {
      origin: "http://localhost:3001",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: profile.email,
      fullName: profile.fullName,
      password: "StrongPass123",
    }),
  });
  const res = await POST(request, {
    params: Promise.resolve({ path: ["register"] }),
  });
  expect(fetcher.mock.calls[0][0]).toMatch(/\/auth\/register$/);
  expect(await res.json()).toEqual(profile);
  expect(res.cookies.get("hl_user_access")?.value).toBe("access");
  expect(res.headers.get("set-cookie")).toContain("HttpOnly");
});
const user = {
  id: "user-id",
  role: "USER",
  email: "user@example.com",
  fullName: "Khách hàng",
};
const context = (path: string) => ({
  params: Promise.resolve({ path: [path] }),
});
const req = (path: string, method = "GET", cookie = "") =>
  new NextRequest(`http://localhost:3001/api/auth/${path}`, {
    method,
    headers: {
      origin: "http://localhost:3001",
      cookie,
      "content-type": "application/json",
    },
    ...(method === "POST"
      ? {
          body: JSON.stringify({
            email: "user@example.com",
            password: "test-only",
          }),
        }
      : {}),
  });
it("accepts USER login and returns only profile with isolated HttpOnly cookies", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        user,
        accessToken: "access",
        refreshToken: "refresh",
        expiresIn: 900,
      }),
    ),
  );
  const res = await POST(req("login", "POST"), context("login"));
  expect(await res.json()).toEqual(user);
  expect(res.cookies.get("hl_user_access")?.value).toBe("access");
  expect(res.headers.get("set-cookie")).toContain("HttpOnly");
  expect(res.headers.get("set-cookie")).toContain("Path=/api/auth");
  expect(res.headers.get("set-cookie")).not.toContain("hl_admin");
});
it("blocks cross-origin writes and unknown endpoints", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  const request = req("login", "POST");
  request.headers.set("origin", "https://other.example");
  expect((await POST(request, context("login"))).status).toBe(403);
  expect((await GET(req("products"), context("products"))).status).toBe(404);
  expect(fetcher).not.toHaveBeenCalled();
});
it("uses the user cookie for profile and clears it on logout", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(Response.json(user))
    .mockResolvedValueOnce(new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", fetcher);
  expect(
    await (
      await GET(req("me", "GET", "hl_user_access=access"), context("me"))
    ).json(),
  ).toEqual(user);
  expect(fetcher.mock.calls[0][1].headers.Authorization).toBe("Bearer access");
  const res = await POST(
    req("logout", "POST", "hl_user_access=access"),
    context("logout"),
  );
  expect(res.status).toBe(204);
  expect(res.headers.get("set-cookie")).toContain("Max-Age=0");
});
it("refreshes from HttpOnly refresh cookie and clears expired sessions", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue(Response.json({ message: "Expired" }, { status: 401 }));
  vi.stubGlobal("fetch", fetcher);
  const res = await POST(
    req("refresh", "POST", "hl_user_refresh=refresh"),
    context("refresh"),
  );
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({
    refreshToken: "refresh",
  });
  expect(res.status).toBe(401);
  expect(res.headers.get("set-cookie")).toContain("Max-Age=0");
});
