"use client";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { contactStatuses } from "@/config/admin";
import type {
  AdminInput,
  AdminModule,
  AdminRecord,
} from "@/services/admin.service";
import type { Dto } from "@/types/api";

export const selectClass =
  "min-h-control w-full rounded-control border border-input-border bg-surface px-3 py-2 text-body";
export function recordValue(record: AdminRecord | null, key: string) {
  const value = record && (record as unknown as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <Typography as="span" variant="label">
        {label}
      </Typography>
      {children}
    </label>
  );
}

export function AdminEditor({
  module,
  record,
  options,
  busy,
  onSave,
  onCancel,
}: {
  module: AdminModule;
  record: AdminRecord | null;
  options: { categories: AdminRecord[]; manufacturers: AdminRecord[] };
  busy: boolean;
  onSave: (input: AdminInput) => void;
  onCancel: () => void;
}) {
  const value = (key: string) => recordValue(record, key);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    switch (module) {
      case "products":
        onSave({
          code: text("code"),
          name: text("name") || null,
          description: text("description") || null,
          imagePath: text("imagePath") || null,
          price: text("price") ? Number(text("price")) : null,
          manufacturerId: text("manufacturerId") || null,
          categoryIds: data.getAll("categoryIds").map(String),
        } satisfies Dto<"CreateProductDto">);
        break;
      case "categories":
        onSave({
          name: text("name"),
          description: text("description") || null,
        } satisfies Dto<"CreateCategoryDto">);
        break;
      case "manufacturers":
        onSave({ name: text("name") } satisfies Dto<"CreateManufacturerDto">);
        break;
      case "contact-requests":
        onSave({
          fullName: text("fullName"),
          email: text("email"),
          phoneNumber: text("phoneNumber"),
          reason: text("reason") || null,
          ...(record
            ? { status: text("status") as Dto<"ContactRequestStatus"> }
            : {}),
        } satisfies Dto<"UpdateContactRequestDto">);
        break;
      case "users":
        onSave({
          role: text("role") as Dto<"Role">,
        } satisfies Dto<"UpdateRoleDto">);
        break;
    }
  }
  const input = (
    key: string,
    label: string,
    required = false,
    maxLength = 255,
    type = "text",
  ) => (
    <Field label={label}>
      <Input
        name={key}
        defaultValue={value(key)}
        required={required}
        maxLength={maxLength}
        type={type}
        pattern={required && type === "text" ? ".*\\S.*" : undefined}
      />
    </Field>
  );
  const categories =
    record && "categories" in record
      ? record.categories.map((item) => item.id)
      : [];
  return (
    <section
      aria-label="Biểu mẫu bản ghi"
      className="rounded-card border border-border bg-surface p-5 md:p-6"
    >
      <Typography as="h2" variant="subtitle">
        {module === "users"
          ? "Đổi vai trò"
          : record
            ? "Chỉnh sửa bản ghi"
            : "Thêm bản ghi"}
      </Typography>
      <form onSubmit={submit} className="mt-5">
        <fieldset disabled={busy} className="grid min-w-0 gap-5 md:grid-cols-2">
          {(module === "categories" ||
            module === "manufacturers" ||
            module === "products") &&
            input(
              "name",
              "Tên",
              module !== "products",
              module === "products" ? 255 : 200,
            )}
          {module === "products" && (
            <>
              {input("code", "Mã sản phẩm", true, 100)}
              <Field label="Giá (VNĐ)">
                <Input
                  name="price"
                  type="number"
                  min="0"
                  max="999999999999.99"
                  step="0.01"
                  defaultValue={value("price")}
                />
              </Field>
              {input("imagePath", "Đường dẫn / URL ảnh", false, 2048)}
              <Field label="Hãng sản xuất">
                <select
                  name="manufacturerId"
                  className={selectClass}
                  defaultValue={value("manufacturerId")}
                >
                  <option value="">Chưa chọn hãng</option>
                  {options.manufacturers.map((item) => (
                    <option value={item.id} key={item.id}>
                      {recordValue(item, "name")}
                    </option>
                  ))}
                </select>
              </Field>
              <fieldset className="rounded-control border border-border p-3">
                <legend className="px-1 text-label">Danh mục sản phẩm</legend>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {options.categories.length === 0 && (
                    <Typography variant="caption" muted>
                      Chưa có danh mục.
                    </Typography>
                  )}
                  {options.categories.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 text-label"
                    >
                      <input
                        type="checkbox"
                        name="categoryIds"
                        value={item.id}
                        defaultChecked={categories.includes(item.id)}
                      />
                      {recordValue(item, "name")}
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}
          {(module === "categories" || module === "products") && (
            <div className="md:col-span-2">
              <Field label="Mô tả">
                <textarea
                  name="description"
                  rows={4}
                  className={selectClass}
                  maxLength={module === "products" ? 10000 : 5000}
                  defaultValue={value("description")}
                />
              </Field>
            </div>
          )}
          {module === "contact-requests" && (
            <>
              {input("fullName", "Họ và tên", true, 100)}
              {input("email", "Email", true, 254, "email")}
              {input("phoneNumber", "Số điện thoại", true, 30, "tel")}
              {input("reason", "Lý do liên hệ", false, 200)}
              {record && (
                <Field label="Trạng thái">
                  <select
                    name="status"
                    className={selectClass}
                    defaultValue={value("status")}
                  >
                    {Object.entries(contactStatuses).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </>
          )}
          {module === "users" && (
            <>
              <div>
                <Typography variant="label">{value("fullName")}</Typography>
                <Typography muted>{value("email")}</Typography>
              </div>
              <Field label="Vai trò">
                <select
                  name="role"
                  className={selectClass}
                  defaultValue={value("role")}
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </Field>
            </>
          )}
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Đang lưu…" : "Lưu"}
            </Button>
            <Button variant="secondary" onClick={onCancel} disabled={busy}>
              Hủy
            </Button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
