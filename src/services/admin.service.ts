import axios, { type AxiosRequestConfig } from "axios";
import { toApiError } from "@/api/api-error";
import type { Dto } from "@/types/api";

const client = axios.create({ baseURL: "/api/admin", timeout: 20000 });
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
      config.url !== "/auth/login"
    ) {
      try {
        refreshing ??= client.post("/auth/refresh").finally(() => {
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

export type AdminModule =
  "products" | "categories" | "manufacturers" | "contact-requests" | "users";
export type AdminRecord =
  | Dto<"ProductResponseDto">
  | Dto<"CategoryResponseDto">
  | Dto<"ManufacturerResponseDto">
  | Dto<"ContactRequestResponseDto">
  | Dto<"UserResponseDto">;
export type AdminList = {
  data: AdminRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
export type AdminInput =
  | Dto<"CreateProductDto">
  | Dto<"CreateCategoryDto">
  | Dto<"CreateManufacturerDto">
  | Dto<"CreateContactRequestDto">
  | Dto<"UpdateContactRequestDto">
  | Dto<"UpdateRoleDto">;

export const adminService = {
  login: (data: Dto<"LoginDto">) =>
    request<Dto<"UserResponseDto">>({
      method: "POST",
      url: "/auth/login",
      data,
    }),
  me: () => request<Dto<"UserResponseDto">>({ url: "/auth/me" }),
  logout: () => request<void>({ method: "POST", url: "/auth/logout" }),
  list: (
    module: AdminModule,
    params: Record<string, string | number>,
    signal?: AbortSignal,
  ) => request<AdminList>({ url: `/${module}`, params, signal }),
  get: (module: AdminModule, id: string) =>
    request<AdminRecord>({ url: `/${module}/${encodeURIComponent(id)}` }),
  save: (module: AdminModule, data: AdminInput, id?: string) =>
    request<AdminRecord>({
      method: id ? "PATCH" : "POST",
      url: `/${module}${id ? `/${encodeURIComponent(id)}${module === "users" ? "/role" : ""}` : ""}`,
      data,
    }),
  remove: (module: AdminModule, id: string) =>
    request<void>({
      method: "DELETE",
      url: `/${module}/${encodeURIComponent(id)}`,
    }),
  async options(module: "categories" | "manufacturers") {
    const records: AdminRecord[] = [];
    let page = 1;
    while (true) {
      const result = await this.list(module, { page, limit: 100 });
      records.push(...result.data);
      if (page >= result.totalPages) return records;
      page++;
    }
  },
};
