"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

export function FooterContactForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Form đang chờ kết nối kênh tiếp nhận liên hệ.");
  }

  return (
    <form className="footer-contact-form" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <Typography as="span" variant="label">
            Họ và tên <span className="text-brand-600">*</span>
          </Typography>
          <Input
            name="name"
            autoComplete="name"
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
          >
            <option value="">Chọn lý do liên hệ</option>
            <option value="tu-van">Tư vấn sản phẩm</option>
            <option value="hop-tac">Hợp tác</option>
            <option value="khac">Khác</option>
          </select>
        </label>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
        {message ? (
          <Typography role="status" variant="caption" className="text-muted">
            {message}
          </Typography>
        ) : null}
        <Button type="submit">Gửi liên hệ</Button>
      </div>
    </form>
  );
}
