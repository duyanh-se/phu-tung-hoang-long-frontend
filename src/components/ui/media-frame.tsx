"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Typography } from "./typography";

interface MediaFrameProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  preload?: boolean;
  contain?: boolean;
  fallbackLabel?: string;
}
export function MediaFrame({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  preload = false,
  contain = false,
  fallbackLabel = "Hình ảnh đang cập nhật",
}: MediaFrameProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasImage = src && failedSrc !== src;
  return (
    <div className={cn("relative overflow-hidden bg-background", className)}>
      {hasImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          unoptimized={/^https?:\/\//i.test(src)}
          onError={() => setFailedSrc(src)}
          className={cn(
            contain ? "object-contain" : "object-cover",
            imageClassName,
          )}
        />
      ) : (
        <div className="flex h-full min-h-40 items-center justify-center border border-border p-6 text-center">
          <Typography variant="caption" muted>
            {fallbackLabel}
          </Typography>
        </div>
      )}
    </div>
  );
}
