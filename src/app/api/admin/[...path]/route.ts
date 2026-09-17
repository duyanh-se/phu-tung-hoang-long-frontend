import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import type { Dto } from "@/types/api";

const accessCookie = "hl_admin_access";
const refreshCookie = "hl_admin_refresh";
const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/api/admin",
  secure: process.env.NODE_ENV === "production",
};
const fail = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

function hasSameOrigin(request: NextRequest) {
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
    request.nextUrl.protocol.replace(/:$/, "");
  const host = request.headers.get("host") ?? request.nextUrl.host;
  return request.headers.get("origin") === `${protocol}://${host}`;
}

function clearSession(response: NextResponse) {
  for (const name of [accessCookie, refreshCookie])
    response.cookies.set(name, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

async function handle(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const route = path.join("/");
  const method = request.method;
  if (method !== "GET" && !hasSameOrigin(request))
    return fail("Nguồn yêu cầu không hợp lệ.", 403);
  const auth = /^auth\/(login|refresh|logout|me)$/.test(route);
  const resource =
    /^(products|categories|manufacturers|contact-requests)(\/[\w-]+)?$/.test(
      route,
    );
  const users = /^users(\/[\w-]+(\/role)?)?$/.test(route);
  if (!(auth || resource || users)) return fail("Không tìm thấy API.", 404);
  if (auth && method !== (route === "auth/me" ? "GET" : "POST"))
    return fail("Phương thức không hợp lệ.", 405);
  if (
    users &&
    !(method === "GET" || (method === "PATCH" && route.endsWith("/role")))
  )
    return fail("Phương thức không hợp lệ.", 405);
  const token = request.cookies.get(accessCookie)?.value;
  const upstream = (target: string, init: RequestInit = {}) =>
    fetch(`${env.apiBaseUrl.replace(/\/$/, "")}/${target}`, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(env.apiTimeoutMs),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  try {
    if (route === "auth/login" || route === "auth/refresh") {
      const body =
        route === "auth/login"
          ? await request.json()
          : { refreshToken: request.cookies.get(refreshCookie)?.value };
      if (route === "auth/refresh" && !body.refreshToken)
        return clearSession(fail("Phiên đăng nhập đã hết hạn.", 401));
      const result = await upstream(route, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await result.json();
      if (!result.ok)
        return result.status === 401
          ? clearSession(NextResponse.json(data, { status: result.status }))
          : NextResponse.json(data, { status: result.status });
      const session = data as Dto<"AuthResponseDto">;
      if (session.user.role !== "ADMIN") {
        await upstream("auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        return clearSession(fail("Tài khoản không có quyền quản trị.", 403));
      }
      const response = NextResponse.json(session.user);
      response.cookies.set(accessCookie, session.accessToken, {
        ...cookieOptions,
        maxAge: session.expiresIn,
      });
      response.cookies.set(refreshCookie, session.refreshToken, cookieOptions);
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    if (!token) return fail("Vui lòng đăng nhập quản trị.", 401);
    if (route === "auth/logout") {
      const result = await upstream(route, { method: "POST" });
      if (!result.ok && result.status !== 401)
        return fail("Chưa đăng xuất được. Vui lòng thử lại.", result.status);
      return clearSession(new NextResponse(null, { status: 204 }));
    }
    const profile = await upstream("auth/me");
    if (!profile.ok)
      return fail("Không xác thực được phiên đăng nhập.", profile.status);
    const user = (await profile.json()) as Dto<"UserResponseDto">;
    if (user.role !== "ADMIN")
      return clearSession(fail("Tài khoản không có quyền quản trị.", 403));
    if (route === "auth/me")
      return NextResponse.json(user, {
        headers: { "Cache-Control": "no-store" },
      });
    const response = await upstream(`${route}${request.nextUrl.search}`, {
      method,
      ...(method !== "GET" ? { body: await request.text() } : {}),
    });
    return new NextResponse(
      response.status === 204 ? null : await response.text(),
      {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return fail("Không kết nối được máy chủ. Vui lòng thử lại.", 502);
  }
}

export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };
