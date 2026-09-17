import type { Metadata } from "next";
import { UserLogin } from "@/components/features/auth/user-login";
export const metadata: Metadata = { title: "Đăng nhập" };
export default function LoginPage() {
  return <UserLogin />;
}
