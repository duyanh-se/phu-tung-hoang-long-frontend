import { Button } from "./button";
import { Typography } from "./typography";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Phân trang"
      className="flex flex-wrap items-center justify-center gap-4"
    >
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Trước
      </Button>
      <Typography variant="label" className="tabular-nums">
        Trang {page} / {totalPages}
      </Typography>
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Sau
      </Button>
    </nav>
  );
}
