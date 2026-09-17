import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import type { Dto } from "@/types/api";

const accessCookie = "hl_user_access";
const refreshCookie = "hl_user_refresh";
const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/api/auth",
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
  if (!["login", "register", "refresh", "logout", "me"].includes(route))
    return fail("Không tìm thấy API.", 404);
  if (method !== (route === "me" ? "GET" : "POST"))
    return fail("Phương thức không hợp lệ.", 405);
  const token = request.cookies.get(accessCookie)?.value;
  const upstream = (target: string, init: RequestInit = {}) =>
    fetch(`${env.apiBaseUrl.replace(/\/$/, "")}/auth/${target}`, {
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
    if (route === "login" || route === "register" || route === "refresh") {
      const body =
        route !== "refresh"
          ? await request.json()
          : { refreshToken: request.cookies.get(refreshCookie)?.value };
      if (route === "refresh" && !body.refreshToken)
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
      const response = NextResponse.json(session.user);
      response.cookies.set(accessCookie, session.accessToken, {
        ...cookieOptions,
        maxAge: session.expiresIn,
      });
      response.cookies.set(refreshCookie, session.refreshToken, cookieOptions);
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    if (!token) return fail("Vui lòng đăng nhập.", 401);
    if (route === "logout") {
      const result = await upstream(route, { method: "POST" });
      if (!result.ok && result.status !== 401)
        return fail("Chưa đăng xuất được. Vui lòng thử lại.", result.status);
      return clearSession(new NextResponse(null, { status: 204 }));
    }
    const profile = await upstream("me");
    if (!profile.ok)
      return fail("Không xác thực được phiên đăng nhập.", profile.status);
    const user = (await profile.json()) as Dto<"UserResponseDto">;
    return NextResponse.json(user, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return fail("Không kết nối được máy chủ. Vui lòng thử lại.", 502);
  }
}

export { handle as GET, handle as POST };
