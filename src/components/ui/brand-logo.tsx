import Image from "next/image";
import { cn } from "@/lib/cn";

export interface BrandLogoProps {
  size?: "small" | "regular";
  decorative?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "regular",
  decorative = false,
  className,
}: BrandLogoProps) {
  const dimension = size === "small" ? 48 : 64;
  return (
    <Image
      src="/images/shop/logo/Logo_Hoang_Long.jpg"
      alt={decorative ? "" : "Logo Phụ Tùng Hoàng Long"}
      width={dimension}
      height={dimension}
      sizes={`${dimension}px`}
      className={cn(
        "shrink-0 rounded-control object-contain",
        size === "small" ? "size-12" : "size-16",
        className,
      )}
    />
  );
}
