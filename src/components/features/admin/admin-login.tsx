"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAdminSession } from "@/hooks/use-admin-session";
import { toApiError } from "@/api/api-error";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Title, Typography } from "@/components/ui/typography";

export function AdminLogin() {
  const { login } = useAdminSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await login({
        email: String(data.get("email")).trim(),
        password: String(data.get("password")),
      });
    } catch (cause) {
      setError(toApiError(cause).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid min-h-screen place-items-center bg-brand-50 px-5 py-12">
      <div className="w-full max-w-md rounded-card border border-border bg-surface p-7 shadow-card sm:p-10">
        <Typography variant="eyebrow" className="text-brand-600">
          PHỤ TÙNG HOÀNG LONG
        </Typography>
        <Title className="mt-4">Đăng nhập quản trị</Title>
        <Typography muted className="mt-3">
          Sử dụng tài khoản quản trị của cửa hàng.
        </Typography>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="grid gap-2">
            <Typography as="span" variant="label">
              Email
            </Typography>
            <Input
              name="email"
              type="email"
              required
              autoComplete="username"
              disabled={busy}
            />
          </label>
          <label className="grid gap-2">
            <Typography as="span" variant="label">
              Mật khẩu
            </Typography>
            <Input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={busy}
            />
          </label>
          {error && (
            <Typography role="alert" variant="label" className="text-danger">
              {error}
            </Typography>
          )}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>
        </form>
        <Link href="/" className="mt-6 block text-label text-muted">
          ← Về website
        </Link>
      </div>
    </div>
  );
}
