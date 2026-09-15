import { api } from "@/api/api-config";
import { endpoints } from "@/api/endpoints";
import type { ProductDto, ProductListDto, ProductQuery } from "@/types/api";

export const productService = {
  async list(
    query: ProductQuery = {},
    signal?: AbortSignal,
  ): Promise<ProductListDto> {
    const { data } = await api.get<ProductListDto>(endpoints.products, {
      params: { ...query, search: query.search?.trim() || undefined },
      signal,
    });
    return data;
  },
  async getById(id: string, signal?: AbortSignal): Promise<ProductDto> {
    const { data } = await api.get<ProductDto>(endpoints.product(id), {
      signal,
    });
    return data;
  },
};
