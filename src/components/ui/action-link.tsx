import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { buttonStyles, type ButtonVariant } from "@/styles/button";

export function ActionLink({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      className={cn(buttonStyles(variant), "action-link gap-6", className)}
      {...props}
    >
      {children}
      <span className="action-link-arrow" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}
