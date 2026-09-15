const timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000);

export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
  apiTimeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : 15000,
} as const;
