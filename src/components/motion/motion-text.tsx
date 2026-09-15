import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextTag = "h1" | "h2" | "h3" | "p" | "span";

export function MotionText({
  as: Tag = "span",
  lines,
  className,
  lineClassName,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: TextTag;
  lines: readonly string[];
  lineClassName?: string;
}) {
  return (
    <Tag className={className} aria-label={lines.join(" ")} {...props}>
      {lines.map((line) => (
        <span
          key={line}
          className={cn(
            "motion-text-mask block overflow-hidden",
            lineClassName,
          )}
          aria-hidden="true"
        >
          <span data-motion-line className="block">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
