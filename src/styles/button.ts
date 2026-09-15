import { cn } from "@/lib/cn";
import { typographyVariants } from "./typography";

const variants = {
  primary:
    "bg-brand-600 text-surface hover:bg-brand-700 active:bg-brand-700 disabled:bg-brand-600",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-brand-50 hover:border-brand-600 disabled:border-border disabled:bg-surface",
  ghost:
    "text-muted hover:bg-background hover:text-foreground disabled:bg-transparent",
} as const;
export type ButtonVariant = keyof typeof variants;

export function buttonStyles(variant: ButtonVariant = "primary") {
  return cn(
    "motion-interaction inline-flex min-h-control shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50",
    typographyVariants.button,
    variants[variant],
  );
}
