import type { ProductDto } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Paragraph, Typography } from "@/components/ui/typography";
import { MediaFrame } from "@/components/ui/media-frame";

export function ProductCard({ product }: { product: ProductDto }) {
  return (
    <Card className="product-card group flex h-full min-h-64 flex-col gap-5 border-t-2 border-t-brand-600 p-6 sm:p-8">
      {product.imageUrl && (
        <MediaFrame
          src={product.imageUrl}
          alt={product.name || product.code}
          contain
          className="aspect-square rounded-control"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
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
      <Typography as="h3" variant="cardTitle" className="break-words">
        {product.name || product.code}
      </Typography>
      <Paragraph
        weight="bold"
        className="mt-auto break-words pt-4 tabular-nums"
      >
        {product.price === null
          ? "Liên hệ báo giá"
          : product.price + " " + product.currency}
      </Paragraph>
    </Card>
  );
}
