import axios from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    const body: unknown = error.response?.data;
    const message =
      body && typeof body === "object" && "message" in body
        ? body.message
        : undefined;
    const messages = Array.isArray(message)
      ? message.filter((item): item is string => typeof item === "string")
      : [];
    return new ApiError(
      typeof message === "string"
        ? message
        : messages.length
          ? messages.join(", ")
          : error.response
            ? "Yêu cầu không thành công. Vui lòng thử lại."
            : "Không kết nối được máy chủ. Vui lòng thử lại.",
      error.response?.status,
      body,
    );
  }
  return new ApiError(
    error instanceof Error ? error.message : "Đã có lỗi xảy ra.",
  );
}
