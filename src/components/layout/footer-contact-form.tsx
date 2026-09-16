"use client";

import { type FormEvent } from "react";
import { useContactRequest } from "@/hooks/use-contact-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

export function FooterContactForm() {
  const { submit, isSubmitting, message } = useContactRequest();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const success = await submit({
      fullName: String(values.get("name") ?? ""),
      email: String(values.get("email") ?? ""),
      phoneNumber: String(values.get("phone") ?? ""),
      reason: String(values.get("reason") ?? "") || null,
    });
    if (success) form.reset();
  }

  return (
    <form
      className="footer-contact-form"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <Typography as="span" variant="label">
            Họ và tên <span className="text-brand-600">*</span>
          </Typography>
          <Input
            name="name"
            autoComplete="name"
            maxLength={100}
            pattern=".*\S.*"
            disabled={isSubmitting}
            required
            placeholder="Nhập tên của bạn"
          />
        </label>
        <label className="grid gap-2">
          <Typography as="span" variant="label">
            Email liên lạc <span className="text-brand-600">*</span>
          </Typography>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            disabled={isSubmitting}
            required
            placeholder="Email của bạn"
          />
        </label>
        <label className="grid gap-2">
          <Typography as="span" variant="label">
            Số điện thoại <span className="text-brand-600">*</span>
          </Typography>
          <Input
            name="phone"
            type="tel"
            autoComplete="tel"
            disabled={isSubmitting}
            required
            placeholder="Số điện thoại của bạn"
          />
        </label>
        <label className="grid gap-2">
          <Typography as="span" variant="label">
            Lý do liên hệ
          </Typography>
          <select
            name="reason"
            className="footer-contact-select"
            defaultValue=""
            disabled={isSubmitting}
          >
            <option value="">Chọn lý do liên hệ</option>
            <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
            <option value="Hợp tác">Hợp tác</option>
            <option value="Khác">Khác</option>
          </select>
        </label>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
        {message ? (
          <Typography role="status" variant="caption" className="text-muted">
            {message}
          </Typography>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
        </Button>
      </div>
    </form>
  );
}
