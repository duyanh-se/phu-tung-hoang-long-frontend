"use client";
import { useState } from "react";
import { useAdminModule } from "@/hooks/use-admin-module";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminModules, contactStatuses } from "@/config/admin";
import { AdminEditor, recordValue, selectClass } from "./admin-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Title, Typography } from "@/components/ui/typography";
import type { AdminModule, AdminRecord } from "@/services/admin.service";
import { formatMoney } from "@/lib/format-money";

export function AdminModuleScreen({ module }: { module: AdminModule }) {
  const state = useAdminModule(module);
  const { user } = useAdminSession();
  const [editor, setEditor] = useState<{ record: AdminRecord | null } | null>(
    null,
  );
  const [deleting, setDeleting] = useState<AdminRecord | null>(null);
  const config = adminModules.find((item) => item.key === module)!;
  const columns =
    module === "products"
      ? [
          ["code", "Mã sản phẩm"],
          ["name", "Tên"],
          ["price", "Giá"],
        ]
      : module === "contact-requests"
        ? [
            ["fullName", "Họ và tên"],
            ["email", "Email"],
            ["phoneNumber", "Điện thoại"],
            ["reason", "Lý do"],
            ["status", "Trạng thái"],
          ]
        : module === "users"
          ? [
              ["fullName", "Họ và tên"],
              ["email", "Email"],
              ["role", "Vai trò"],
            ]
          : module === "categories"
            ? [
                ["name", "Tên"],
                ["description", "Mô tả"],
              ]
            : [["name", "Tên hãng"]];
  function display(record: AdminRecord, key: string) {
    const value = recordValue(record, key);
    if (key === "price") return value ? formatMoney(value, "VND") : "Liên hệ";
    if (key === "status")
      return contactStatuses[value as keyof typeof contactStatuses] || value;
    if (key === "role")
      return value === "ADMIN" ? "Quản trị viên" : "Người dùng";
    return value || "—";
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Typography variant="eyebrow" className="text-brand-600">
            QUẢN TRỊ
          </Typography>
          <Title className="mt-2">{config.label}</Title>
          <Typography muted className="mt-2">
            {config.description}
          </Typography>
        </div>
        {module !== "users" && (
          <Button
            disabled={state.busy || !state.optionsReady}
            onClick={() => {
              setEditor({ record: null });
              setDeleting(null);
            }}
          >
            Thêm mới
          </Button>
        )}
      </div>
      {state.error && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-control border border-danger bg-surface p-4"
        >
          <Typography className="text-danger">{state.error}</Typography>
          <Button variant="secondary" onClick={state.reload}>
            Thử tải lại
          </Button>
        </div>
      )}
      {state.message && (
        <Typography role="status" className="text-success">
          {state.message}
        </Typography>
      )}
      {editor && (
        <AdminEditor
          key={editor.record?.id ?? "new"}
          module={module}
          record={editor.record}
          options={state.options}
          busy={state.busy}
          onCancel={() => setEditor(null)}
          onSave={async (input) => {
            if (await state.save(input, editor.record?.id)) setEditor(null);
          }}
        />
      )}
      {deleting && (
        <section
          aria-label="Xác nhận xóa"
          className="space-y-4 rounded-card border border-danger bg-surface p-5"
        >
          <Typography as="h2" variant="subtitle">
            Xóa “
            {recordValue(deleting, "name") ||
              recordValue(deleting, "fullName") ||
              recordValue(deleting, "code")}
            ”?
          </Typography>
          <Typography muted>
            {module === "products"
              ? "Sản phẩm sẽ bị ẩn khỏi danh sách bán hàng."
              : "Bản ghi sẽ bị xóa vĩnh viễn. Hãy kiểm tra trước khi xác nhận."}
          </Typography>
          <div className="flex gap-3">
            <Button
              disabled={state.busy}
              onClick={async () => {
                if (await state.remove(deleting.id)) setDeleting(null);
              }}
            >
              Xác nhận xóa
            </Button>
            <Button
              variant="secondary"
              disabled={state.busy}
              onClick={() => setDeleting(null)}
            >
              Hủy
            </Button>
          </div>
        </section>
      )}
      {module !== "users" && (
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            state.filter(
              String(form.get("search") ?? ""),
              String(form.get("status") ?? ""),
            );
          }}
        >
          <label className="grid min-w-0 flex-1 gap-2">
            <Typography as="span" variant="label">
              Tìm kiếm
            </Typography>
            <Input
              name="search"
              placeholder="Nhập từ khóa…"
              maxLength={200}
              defaultValue={state.search}
            />
          </label>
          {module === "contact-requests" && (
            <label className="grid gap-2">
              <Typography as="span" variant="label">
                Lọc trạng thái
              </Typography>
              <select
                name="status"
                className={selectClass}
                defaultValue={state.status}
              >
                <option value="">Tất cả</option>
                {Object.entries(contactStatuses).map(([key, label]) => (
                  <option value={key} key={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Button type="submit" disabled={state.loading}>
            Tìm kiếm
          </Button>
        </form>
      )}
      {state.loading ? (
        <Typography role="status">Đang tải dữ liệu…</Typography>
      ) : (
        <>
          <div className="overflow-x-auto rounded-card border border-border bg-surface">
            <table className="w-full text-left text-label">
              <caption className="sr-only">Danh sách {config.label}</caption>
              <thead className="bg-brand-50">
                <tr>
                  {columns.map(([key, label]) => (
                    <th
                      key={key}
                      scope="col"
                      className="whitespace-nowrap px-4 py-4 font-semibold"
                    >
                      {label}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-4">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.result?.data.map((record) => (
                  <tr key={record.id} className="border-t border-border">
                    {columns.map(([key]) => (
                      <td key={key} className="max-w-xs px-4 py-4 break-words">
                        {display(record, key)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          disabled={
                            state.busy ||
                            !state.optionsReady ||
                            (module === "users" && user?.id === record.id)
                          }
                          onClick={() => {
                            setEditor({ record });
                            setDeleting(null);
                            window.scrollTo({ top: 0 });
                          }}
                        >
                          {module === "users" ? "Đổi vai trò" : "Sửa"}
                        </Button>
                        {module !== "users" && (
                          <Button
                            variant="ghost"
                            disabled={state.busy}
                            onClick={() => {
                              setDeleting(record);
                              setEditor(null);
                              window.scrollTo({ top: 0 });
                            }}
                          >
                            Xóa
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!state.result?.data.length && (
              <Typography muted className="p-6">
                Chưa có dữ liệu phù hợp.
              </Typography>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Typography variant="label" muted>
              {state.result?.total ?? 0} bản ghi · Trang {state.page} /{" "}
              {Math.max(1, state.result?.totalPages ?? 1)}
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={state.page <= 1}
                onClick={() => state.setPage(state.page - 1)}
              >
                Trang trước
              </Button>
              <Button
                variant="secondary"
                disabled={state.page >= (state.result?.totalPages ?? 1)}
                onClick={() => state.setPage(state.page + 1)}
              >
                Trang sau
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
