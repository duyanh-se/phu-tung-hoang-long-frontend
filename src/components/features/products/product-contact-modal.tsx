"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useContactRequest } from "@/hooks/use-contact-request";
import { useUserSession } from "@/hooks/use-user-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import type { ProductDto } from "@/types/api";

export function ProductContactModal({
  product,
  onClose,
}: {
  product: ProductDto;
  onClose: () => void;
}) {
  const { user } = useUserSession();
  const { submit, isSubmitting, message } = useContactRequest();
  const [submitted, setSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reason, setReason] = useState(
    `Tôi muốn mua sản phẩm ${product.name || product.code} (${product.code}).`,
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const success = await submit({
      fullName: user?.fullName || String(values.get("fullName") || ""),
      email: user?.email || String(values.get("email") || ""),
      phoneNumber: String(values.get("phoneNumber") || phoneNumber),
      reason: String(values.get("reason") || reason),
    });
    setSubmitted(success);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-contact-title"
        className="max-h-[min(92svh,44rem)] w-full max-w-xl overflow-y-auto rounded-card bg-surface p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <Typography
              id="product-contact-title"
              as="h2"
              variant="sectionTitle"
            >
              Liên hệ mua sản phẩm
            </Typography>
            <Typography variant="caption" muted className="mt-2 block">
              {product.name || product.code}
            </Typography>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="min-h-10 shrink-0 px-3"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng biểu mẫu"
          >
            ×
          </Button>
        </div>

        {submitted ? (
          <div className="mt-8 space-y-4">
            <Typography role="status" className="text-success">
              {message || "Gửi yêu cầu thành công."}
            </Typography>
            <Button type="button" onClick={onClose}>
              Đóng
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            {!user && (
              <>
                <label className="grid gap-2">
                  <Typography as="span" variant="label">
                    Họ và tên <span className="text-brand-600">*</span>
                  </Typography>
                  <Input
                    name="fullName"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Nguyễn Văn An"
                  />
                </label>
                <label className="grid gap-2">
                  <Typography as="span" variant="label">
                    Email <span className="text-brand-600">*</span>
                  </Typography>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="guest@example.com"
                  />
                </label>
              </>
            )}
            <label className="grid gap-2">
              <Typography as="span" variant="label">
                Số điện thoại <span className="text-brand-600">*</span>
              </Typography>
              <Input
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="0901234567"
              />
            </label>
            <label className="grid gap-2">
              <Typography as="span" variant="label">
                Lý do liên hệ <span className="text-brand-600">*</span>
              </Typography>
              <textarea
                name="reason"
                required
                maxLength={500}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="min-h-28 rounded-control border border-input-border bg-surface px-3 py-3 text-label outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            {message && (
              <Typography
                role="alert"
                variant="caption"
                className="text-danger"
              >
                {message}
              </Typography>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu mua hàng"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
