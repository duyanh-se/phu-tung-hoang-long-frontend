"use client";

import { useCallback, useState } from "react";
import type { ProductDto } from "@/types/api";
import { formatMoney } from "@/lib/format-money";
import { Card } from "@/components/ui/card";
import { MediaFrame } from "@/components/ui/media-frame";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { ProductContactModal } from "./product-contact-modal";

export function CatalogProductCard({
  product,
  list,
}: {
  product: ProductDto;
  list: boolean;
}) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const closeContact = useCallback(() => setIsContactOpen(false), []);

  return (
    <>
      <Card
        className={cn(
          "product-card catalog-product-card flex h-full min-w-0 flex-col overflow-hidden border-t-2 border-t-brand-600 p-3 sm:p-3",
          list && "catalog-product-list sm:flex-row",
        )}
      >
        <MediaFrame
          src={product.imageUrl}
          alt={product.name || product.code}
          contain
          fallbackLabel={product.manufacturer?.name || "Phụ tùng Hoàng Long"}
          className="catalog-product-media aspect-[4/3] shrink-0 rounded-control bg-brand-50"
          imageClassName="p-5"
          sizes={
            list
              ? "(max-width: 639px) 90vw, 240px"
              : "(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 360px"
          }
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-3 pt-5 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Typography
              variant="eyebrow"
              className="break-words text-brand-600"
            >
              {product.manufacturer?.name || "Phụ tùng"}
            </Typography>
            <Typography
              variant="caption"
              className="product-card-code break-all text-muted"
            >
              {product.code}
            </Typography>
          </div>
          <Typography as="h3" variant="cardTitle" className="break-words">
            {product.name || product.code}
          </Typography>
          <div className="mt-auto border-t border-border pt-4">
            <Typography variant="caption" muted>
              Giá sản phẩm
            </Typography>
            <Typography
              variant="subtitle"
              className="mt-1 break-words tabular-nums"
            >
              {product.price === null
                ? "Liên hệ báo giá"
                : formatMoney(product.price, product.currency)}
            </Typography>
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={() => setIsContactOpen(true)}
          >
            Liên hệ để mua
          </Button>
        </div>
      </Card>
      {isContactOpen && (
        <ProductContactModal product={product} onClose={closeContact} />
      )}
    </>
  );
}
