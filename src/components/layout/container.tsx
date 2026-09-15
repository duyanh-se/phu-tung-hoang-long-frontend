import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-site px-5 sm:px-8", className)}
      {...props}
    />
  );
}
