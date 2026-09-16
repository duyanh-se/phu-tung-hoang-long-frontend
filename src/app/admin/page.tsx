import Link from "next/link";
import { adminModules } from "@/config/admin";
import { Title, Typography } from "@/components/ui/typography";
export default function Page() {
  return (
    <>
      <Typography variant="eyebrow" className="text-brand-600">
        KHÔNG GIAN QUẢN TRỊ
      </Typography>
      <Title className="mt-3">Quản lý cửa hàng</Title>
      <Typography muted className="mt-3">
        Chọn module để cập nhật dữ liệu và xử lý công việc.
      </Typography>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminModules.map((item) => (
          <Link
            key={item.key}
            href={`/admin/${item.key}`}
            className="motion-interaction rounded-card border border-border bg-surface p-6 hover:border-brand-600"
          >
            <Typography as="h2" variant="subtitle">
              {item.label} ↗
            </Typography>
            <Typography muted className="mt-3">
              {item.description}
            </Typography>
          </Link>
        ))}
      </div>
    </>
  );
}
