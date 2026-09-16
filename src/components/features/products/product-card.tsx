import type { ProductDto } from "@/types/api";
import { formatMoney } from "@/lib/format-money";
import { Card } from "@/components/ui/card";
import { Paragraph, Typography } from "@/components/ui/typography";
import { MediaFrame } from "@/components/ui/media-frame";

export function ProductCard({
  product,
  compact = false,
}: {
  product: ProductDto;
  compact?: boolean;
}) {
  return (
    <Card
      className={`product-card group flex min-h-64 flex-col border-t-2 border-t-brand-600 ${
        compact
          ? "product-card-compact h-auto self-stretch gap-3 p-4"
          : "h-full gap-5 p-6 sm:p-8"
      }`}
    >
      {(product.imageUrl || compact) && (
        <MediaFrame
          src={product.imageUrl}
          alt={product.name || product.code}
          contain
          fallbackLabel="DENIS"
          className={
            compact
              ? "aspect-[4/3] rounded-control"
              : "aspect-square rounded-control"
          }
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
        />
      )}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b border-border ${
          compact ? "pb-3" : "pb-4"
        }`}
      >
        <Typography variant="eyebrow" className="text-brand-600">
          {product.manufacturer?.name || "Phụ tùng"}
        </Typography>
        <Typography
          variant="caption"
          className="product-card-code break-all text-muted"
        >
          {product.code}
        </Typography>
      </div>
      <Typography
        as="h3"
        variant="cardTitle"
        className={`break-words ${compact ? "line-clamp-3" : ""}`}
      >
        {product.name || product.code}
      </Typography>
      <Paragraph
        weight="bold"
        className={`mt-auto ${compact ? "pt-1" : "pt-4"} break-words tabular-nums`}
      >
        {product.price === null
          ? "Liên hệ báo giá"
          : formatMoney(product.price, product.currency)}
      </Paragraph>
    </Card>
  );
}
