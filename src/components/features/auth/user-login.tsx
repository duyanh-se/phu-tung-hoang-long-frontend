"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useUserSession } from "@/hooks/use-user-session";
import { toApiError } from "@/api/api-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Title, Typography } from "@/components/ui/typography";

export function UserLogin({ mode = "login" }: { mode?: "login" | "register" }) {
  const isRegister = mode === "register";
  const { user, login, register } = useUserSession();
  const router = useRouter();
  const locked = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const data = new FormData(event.currentTarget);
    if (isRegister) {
      if (String(data.get("fullName")).trim().length < 2) {
        setError("Họ và tên cần ít nhất 2 ký tự.");
        return;
      }
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,128}$/.test(
          String(data.get("password")),
        )
      ) {
        setError("Mật khẩu cần 8–128 ký tự, có chữ hoa, chữ thường và số.");
        return;
      }
      if (data.get("password") !== data.get("confirmPassword")) {
        setError("Mật khẩu nhập lại không khớp.");
        return;
      }
    }
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      const credentials = {
        email: String(data.get("email")).trim(),
        password: String(data.get("password")),
      };
      if (isRegister)
        await register({
          ...credentials,
          fullName: String(data.get("fullName")).trim(),
        });
      else await login(credentials);
      router.replace("/san-pham");
    } catch (cause) {
      const problem = toApiError(cause);
      setError(
        problem.status === 409
          ? "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác."
          : problem.status === 401
            ? "Email hoặc mật khẩu không đúng."
            : problem.status === 429
              ? "Bạn gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau."
              : problem.message,
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="grid min-h-svh bg-surface lg:grid-cols-2">
      <div className="relative flex min-h-svh items-center justify-center px-6 py-24 sm:px-10">
        <Link
          href="/"
          className="absolute left-6 top-6 rounded-control text-label text-muted hover:text-brand-600 sm:left-8 sm:top-8"
        >
          ← Về trang chủ
        </Link>
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-7 flex items-center justify-center gap-3 rounded-control"
          >
            <BrandLogo size="small" decorative />
            <Typography variant="label">Phụ Tùng Hoàng Long</Typography>
          </Link>
          <Title className="text-center" variant="sectionTitle">
            {isRegister ? "Tạo tài khoản của bạn" : "Bắt đầu ngay bây giờ"}
          </Title>
          <Typography
            muted
            variant="label"
            className="mt-3 text-center font-normal"
          >
            {isRegister
              ? "Đăng ký để đồng hành cùng Hoàng Long và khám phá phụ tùng cho chiếc xe của bạn."
              : "Đăng nhập để tiếp tục khám phá phụ tùng và tìm lựa chọn phù hợp cho chiếc xe của bạn."}
          </Typography>
          {user ? (
            <div className="mt-6 space-y-4">
              <Typography>
                Bạn đã đăng nhập với tài khoản {user.email}.
              </Typography>
              <Link href="/san-pham" className="text-brand-600 underline">
                Tiếp tục xem sản phẩm
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 space-y-6">
              {isRegister && (
                <label className="grid gap-2">
                  <Typography as="span" variant="label">
                    Họ và tên
                  </Typography>
                  <Input
                    name="fullName"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    disabled={busy}
                    placeholder="Nhập họ và tên"
                    className="min-h-12 border-border"
                  />
                </label>
              )}
              <label className="grid gap-2">
                <Typography as="span" variant="label">
                  Email
                </Typography>
                <Input
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  maxLength={254}
                  disabled={busy}
                  placeholder="Email của bạn"
                  className="min-h-12 border-border"
                />
              </label>
              <div className="space-y-2">
                <label
                  htmlFor="user-password"
                  className="text-label font-medium"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    id="user-password"
                    name="password"
                    type={visible ? "text" : "password"}
                    required
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    minLength={isRegister ? 8 : undefined}
                    maxLength={isRegister ? 128 : undefined}
                    aria-describedby={isRegister ? "password-hint" : undefined}
                    disabled={busy}
                    placeholder="Nhập mật khẩu của bạn"
                    className="min-h-12 border-border pr-12"
                  />
                  <Button
                    variant="ghost"
                    className="absolute right-1 top-1/2 min-h-10 -translate-y-1/2 p-2"
                    onClick={() => setVisible(!visible)}
                    aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={visible}
                  >
                    <svg
                      aria-hidden="true"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                      {visible && <path d="m3 3 18 18" />}
                    </svg>
                  </Button>
                </div>
                {isRegister && (
                  <Typography id="password-hint" variant="caption" muted>
                    8–128 ký tự, gồm chữ hoa, chữ thường và số.
                  </Typography>
                )}
              </div>
              {isRegister && (
                <label className="grid gap-2">
                  <Typography as="span" variant="label">
                    Nhập lại mật khẩu
                  </Typography>
                  <Input
                    name="confirmPassword"
                    type={visible ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    disabled={busy}
                    placeholder="Nhập lại mật khẩu"
                    className="min-h-12 border-border"
                  />
                </label>
              )}
              {error && (
                <Typography
                  role="alert"
                  variant="label"
                  className="text-danger"
                >
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                disabled={busy}
                className="min-h-12 w-full rounded-full"
              >
                {busy
                  ? isRegister
                    ? "Đang tạo tài khoản…"
                    : "Đang đăng nhập…"
                  : isRegister
                    ? "Đăng ký"
                    : "Đăng nhập"}
              </Button>
            </form>
          )}
          {!user && (
            <Typography variant="label" className="mt-6 text-center text-muted">
              {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
              <Link
                href={isRegister ? "/dang-nhap" : "/dang-ky"}
                className="text-brand-600 hover:underline"
              >
                {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
              </Link>
            </Typography>
          )}
          <Link
            href="/san-pham"
            className="mt-6 block text-center text-label text-brand-600 hover:underline"
          >
            Tiếp tục xem sản phẩm
          </Link>
        </div>
      </div>
      <aside
        aria-label="Giới thiệu Hoàng Long"
        className="relative hidden min-h-svh overflow-hidden bg-brand-50 lg:block"
      >
        <Image
          src="/images/shop/introduction/cua-hang-1.jpg"
          alt="Cửa hàng phụ tùng Hoàng Long"
          fill
          sizes="50vw"
          preload
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 bg-foreground/40 px-10 py-10 text-surface backdrop-blur-xl xl:px-14 xl:py-12">
          <Typography variant="eyebrow" className="mb-5 text-brand-100">
            Đồng hành cùng chiếc xe của bạn
          </Typography>
          <Typography as="h2" variant="title" className="max-w-lg">
            Đúng phụ tùng.
            <br />
            Đúng nhu cầu.
          </Typography>
          <Typography className="mt-5 max-w-lg text-inverse-muted">
            Khám phá phụ tùng, dầu nhớt và những lựa chọn từ Hoàng Long.
          </Typography>
        </div>
      </aside>
    </section>
  );
}
