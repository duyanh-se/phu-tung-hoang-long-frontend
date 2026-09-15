"use client";

import { useState, type FormEvent } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { typographyVariants } from "@/styles/typography";

export function ProductToolbar({
  onSearch,
  initialSearch = "",
}: {
  initialSearch?: string;
  onSearch: (search: string) => void;
}) {
  const [value, setValue] = useState(initialSearch);
  const view = useAppStore((state) => state.productView);
  const setView = useAppStore((state) => state.setProductView);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value.trim());
  }
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <form onSubmit={submit} role="search" className="w-full max-w-xl">
        <label
          htmlFor="product-search"
          className={cn("mb-2 block", typographyVariants.label)}
        >
          Tìm theo tên hoặc mã phụ tùng
        </label>
        <div className="flex gap-2">
          <Input
            id="product-search"
            type="search"
            maxLength={200}
            placeholder="Nhập tên hoặc mã sản phẩm…"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Button type="submit">Tìm kiếm</Button>
        </div>
      </form>
      <div className="flex gap-2" role="group" aria-label="Kiểu hiển thị">
        <Button
          aria-pressed={view === "grid"}
          variant={view === "grid" ? "primary" : "secondary"}
          onClick={() => setView("grid")}
        >
          Lưới
        </Button>
        <Button
          aria-pressed={view === "list"}
          variant={view === "list" ? "primary" : "secondary"}
          onClick={() => setView("list")}
        >
          Danh sách
        </Button>
      </div>
    </div>
  );
}
