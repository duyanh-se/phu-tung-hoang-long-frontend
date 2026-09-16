"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminModules } from "@/config/admin";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/api/api-error";

export function AdminShell({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  const pathname = usePathname();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (session.loading)
    return (
      <Typography role="status" className="p-8">
        Đang kiểm tra phiên đăng nhập…
      </Typography>
    );
  if (session.error)
    return (
      <div className="space-y-4 p-8">
        <Typography role="alert">{session.error}</Typography>
        <Button onClick={session.reload}>Thử lại</Button>
      </div>
    );
  if (pathname === "/admin/login") return <>{children}</>;
  if (!session.user)
    return (
      <Typography role="status" className="p-8">
        Đang chuyển đến đăng nhập…
      </Typography>
    );
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="border-b border-border bg-surface p-5 lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <Link href="/admin">
          <Typography variant="eyebrow" className="text-brand-600">
            HOÀNG LONG
          </Typography>
          <Typography variant="subtitle" className="mt-2">
            Trang quản trị
          </Typography>
        </Link>
        <nav
          aria-label="Quản trị"
          className="my-6 flex flex-wrap gap-2 lg:flex-col"
        >
          <Link
            className={`rounded-control px-3 py-3 text-label ${pathname === "/admin" ? "bg-brand-50 text-brand-600" : "text-muted"}`}
            href="/admin"
          >
            Tổng quan
          </Link>
          {adminModules.map((item) => (
            <Link
              key={item.key}
              aria-current={
                pathname === `/admin/${item.key}` ? "page" : undefined
              }
              className={`motion-interaction rounded-control px-3 py-3 text-label hover:bg-brand-50 ${pathname === `/admin/${item.key}` ? "bg-brand-50 font-semibold text-brand-600" : "text-muted"}`}
              href={`/admin/${item.key}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-3 border-t border-border pt-5">
          <Typography variant="label" className="break-words">
            {session.user.fullName}
          </Typography>
          <Link className="block text-label text-muted" href="/">
            Xem website ↗
          </Link>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await session.logout();
              } catch (cause) {
                setError(toApiError(cause).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Đang đăng xuất…" : "Đăng xuất"}
          </Button>
          {error && (
            <Typography role="alert" variant="caption" className="text-danger">
              {error}
            </Typography>
          )}
        </div>
      </aside>
      <div className="min-w-0 p-5 md:p-8 lg:p-10">{children}</div>
    </div>
  );
}
