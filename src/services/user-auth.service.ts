import axios, { type AxiosRequestConfig } from "axios";
import { toApiError } from "@/api/api-error";
import type { Dto } from "@/types/api";

const client = axios.create({ baseURL: "/api/auth", timeout: 20000 });
let refreshing: Promise<unknown> | null = null;

async function request<T>(
  config: AxiosRequestConfig,
  retry = true,
): Promise<T> {
  try {
    return (await client.request<T>(config)).data;
  } catch (error) {
    if (
      retry &&
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      config.url !== "/login" &&
      config.url !== "/register"
    ) {
      try {
        refreshing ??= client.post("/refresh").finally(() => {
          refreshing = null;
        });
        await refreshing;
      } catch (refreshError) {
        throw toApiError(refreshError);
      }
      return request<T>(config, false);
    }
    throw toApiError(error);
  }
}

export const userAuthService = {
  register: (data: Dto<"RegisterDto">) =>
    request<Dto<"UserResponseDto">>({ method: "POST", url: "/register", data }),
  login: (data: Dto<"LoginDto">) =>
    request<Dto<"UserResponseDto">>({ method: "POST", url: "/login", data }),
  me: () => request<Dto<"UserResponseDto">>({ url: "/me" }),
  logout: () => request<void>({ method: "POST", url: "/logout" }),
};
