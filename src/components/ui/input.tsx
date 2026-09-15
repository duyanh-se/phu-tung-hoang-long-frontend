import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { typographyVariants } from "@/styles/typography";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "motion-interaction min-h-control min-w-0 w-full rounded-control border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted enabled:hover:border-brand-600 focus-visible:border-brand-600 disabled:cursor-not-allowed disabled:opacity-50",
        typographyVariants.paragraph,
        className,
      )}
      {...props}
    />
  );
}
