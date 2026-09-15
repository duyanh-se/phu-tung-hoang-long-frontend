import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { buttonStyles, type ButtonVariant } from "@/styles/button";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonStyles(variant), className)}
      {...props}
    >
      {loading ? "Đang tải…" : children}
    </button>
  );
}
