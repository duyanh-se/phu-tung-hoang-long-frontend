import type { Metadata } from "next";
import { UserLogin } from "@/components/features/auth/user-login";
export const metadata: Metadata = { title: "Đăng ký tài khoản" };
export default function RegisterPage() {
  return <UserLogin key="register" mode="register" />;
}
