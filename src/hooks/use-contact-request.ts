"use client";

import { useRef, useState } from "react";
import { toApiError } from "@/api/api-error";
import { contactRequestService } from "@/services/contact-request.service";
import type { CreateContactRequestDto } from "@/types/api";

export function useContactRequest() {
  const pending = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(input: CreateContactRequestDto) {
    if (pending.current) return false;
    pending.current = true;
    setIsSubmitting(true);
    setMessage("");
    try {
      await contactRequestService.create(input);
      setMessage("Gửi liên hệ thành công. Hoàng Long sẽ liên hệ lại với bạn.");
      return true;
    } catch (error) {
      const apiError = toApiError(error);
      setMessage(
        apiError.status === 429
          ? "Bạn gửi yêu cầu quá nhanh. Vui lòng chờ một lát rồi thử lại."
          : apiError.message,
      );
      return false;
    } finally {
      pending.current = false;
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, message };
}
