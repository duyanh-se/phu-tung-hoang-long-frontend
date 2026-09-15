import axios from "axios";
import { env } from "@/config/env";
import { toApiError } from "./api-error";

// Keep this instance stateless: pass bearer tokens per request when auth is added.
export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) =>
    Promise.reject(axios.isCancel(error) ? error : toApiError(error)),
);
