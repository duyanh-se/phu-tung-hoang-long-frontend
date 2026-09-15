import { Card } from "@/components/ui/card";

export function ProductSkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Đang tải sản phẩm"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Card
          key={index}
          className="product-skeleton min-h-64 border-t-2 border-t-brand-100 p-6 sm:p-8"
          aria-hidden="true"
        >
          <div className="product-skeleton-line h-3 w-24" />
          <div className="product-skeleton-line mt-6 h-px w-full" />
          <div className="product-skeleton-line mt-6 h-6 w-4/5" />
          <div className="product-skeleton-line mt-3 h-6 w-3/5" />
          <div className="product-skeleton-line mt-12 h-5 w-28" />
        </Card>
      ))}
    </div>
  );
}
