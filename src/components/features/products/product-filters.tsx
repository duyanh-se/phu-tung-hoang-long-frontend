"use client";
import { useState, type FormEvent } from "react";
import type { CatalogQuery } from "@/lib/catalog-query";
import { useManufacturers } from "@/hooks/use-manufacturers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

type FilterChange = (filters: Partial<CatalogQuery>) => void;
const priceRanges = [
  { label: "Tất cả mức giá", min: undefined, max: undefined },
  { label: "Đến 100.000 VNĐ", min: undefined, max: 100000 },
  { label: "100.000 – 300.000 VNĐ", min: 100000, max: 300000 },
  { label: "300.000 – 500.000 VNĐ", min: 300000, max: 500000 },
  { label: "Từ 500.000 VNĐ", min: 500000, max: undefined },
];
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi");

function PriceRange({
  query,
  onApply,
}: {
  query: CatalogQuery;
  onApply: FilterChange;
}) {
  const [min, setMin] = useState(query.minPrice?.toString() ?? "");
  const [max, setMax] = useState(query.maxPrice?.toString() ?? "");
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (min && max && Number(min) > Number(max)) {
      setError("Giá từ không được lớn hơn giá đến.");
      return;
    }
    setError("");
    onApply({
      minPrice: min ? Number(min) : undefined,
      maxPrice: max ? Number(max) : undefined,
    });
  }
  return (
    <form
      onSubmit={submit}
      aria-label="Khoảng giá tùy chọn"
      className="space-y-3 border-t border-border pt-4"
    >
      <Typography variant="label">Hoặc nhập khoảng giá</Typography>
      <div className="grid grid-cols-2 gap-2">
        {[
          { id: "min", label: "Giá từ (VNĐ)", value: min, set: setMin },
          { id: "max", label: "Giá đến (VNĐ)", value: max, set: setMax },
        ].map((field) => (
          <div key={field.id} className="min-w-0 space-y-1">
            <label
              htmlFor={`product-${field.id}-price`}
              className="text-caption text-muted"
            >
              {field.label}
            </label>
            <Input
              id={`product-${field.id}-price`}
              type="number"
              inputMode="decimal"
              min="0"
              max="999999999999.99"
              step="0.01"
              placeholder={field.id === "min" ? "Từ" : "Đến"}
              value={field.value}
              onChange={(event) => {
                field.set(event.target.value);
                setError("");
              }}
              aria-invalid={!!error}
              aria-describedby={error ? "product-price-error" : undefined}
            />
          </div>
        ))}
      </div>
      {error && (
        <Typography
          id="product-price-error"
          role="alert"
          variant="caption"
          className="text-danger"
        >
          {error}
        </Typography>
      )}
      <Button type="submit" variant="secondary" className="w-full">
        Áp dụng khoảng giá
      </Button>
    </form>
  );
}

export function ProductFilters({
  query,
  onApply,
}: {
  query: CatalogQuery;
  onApply: FilterChange;
}) {
  const [keyword, setKeyword] = useState("");
  const suppliers = useManufacturers();
  const visible = suppliers.data.filter((item) =>
    normalize(item.name).includes(normalize(keyword.trim())),
  );
  return (
    <div className="divide-y divide-border">
      <details open className="p-5">
        <summary className="cursor-pointer text-subtitle font-semibold">
          Nhà phân phối
        </summary>
        <div className="mt-4 space-y-3">
          <label htmlFor="supplier-search" className="sr-only">
            Tìm nhà phân phối
          </label>
          <Input
            id="supplier-search"
            placeholder="Tìm nhà phân phối…"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <div
            role="radiogroup"
            aria-label="Nhà phân phối"
            className="max-h-64 overflow-y-auto overscroll-contain pr-1"
          >
            <label className="flex min-h-control cursor-pointer items-center gap-3 rounded-control px-2 text-label hover:bg-brand-50">
              <input
                type="radio"
                name="manufacturer"
                value=""
                checked={!query.manufacturer}
                onChange={() => onApply({ manufacturer: undefined })}
                className="size-4 shrink-0 accent-brand-600"
              />
              Tất cả nhà phân phối
            </label>
            {query.manufacturer &&
              !visible.some((item) => item.name === query.manufacturer) && (
                <label className="flex min-h-control items-center gap-3 px-2 text-label text-brand-600">
                  <input
                    type="radio"
                    name="manufacturer"
                    checked
                    readOnly
                    className="size-4 shrink-0 accent-brand-600"
                  />
                  {query.manufacturer}
                </label>
              )}
            {visible.map((item) => (
              <label
                key={item.id}
                className="flex min-h-control cursor-pointer items-center gap-3 rounded-control px-2 text-label hover:bg-brand-50"
              >
                <input
                  type="radio"
                  name="manufacturer"
                  value={item.name}
                  checked={query.manufacturer === item.name}
                  onChange={() => onApply({ manufacturer: item.name })}
                  className="size-4 shrink-0 accent-brand-600"
                />
                <span className="break-words">{item.name}</span>
              </label>
            ))}
          </div>
          {suppliers.isLoading && (
            <Typography role="status" variant="caption" muted>
              Đang tải nhà phân phối…
            </Typography>
          )}
          {!suppliers.isLoading && !suppliers.error && !visible.length && (
            <Typography role="status" variant="caption" muted>
              Không tìm thấy nhà phân phối.
            </Typography>
          )}
          {suppliers.error && (
            <div role="status">
              <Typography variant="caption" className="text-danger">
                Chưa tải được nhà phân phối.
              </Typography>
              <Button variant="ghost" onClick={suppliers.retry}>
                Tải lại danh sách
              </Button>
            </div>
          )}
        </div>
      </details>
      <details open className="p-5">
        <summary className="cursor-pointer text-subtitle font-semibold">
          Khoảng giá
        </summary>
        <div className="mt-3 space-y-4">
          <div role="radiogroup" aria-label="Mức giá nhanh">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex min-h-control cursor-pointer items-center gap-3 rounded-control px-2 text-label hover:bg-brand-50"
              >
                <input
                  type="radio"
                  name="price-range"
                  checked={
                    query.minPrice === range.min && query.maxPrice === range.max
                  }
                  onChange={() =>
                    onApply({ minPrice: range.min, maxPrice: range.max })
                  }
                  className="size-4 shrink-0 accent-brand-600"
                />
                {range.label}
              </label>
            ))}
          </div>
          <PriceRange
            key={`${query.minPrice}-${query.maxPrice}`}
            query={query}
            onApply={onApply}
          />
        </div>
      </details>
    </div>
  );
}
