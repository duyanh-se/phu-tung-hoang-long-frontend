import { manufacturerService } from "./manufacturer.service";
import { productService } from "./product.service";
import type { ProductQuery } from "@/types/api";

export const catalogService = {
  async list(
    query: ProductQuery = {},
    manufacturerName?: string,
    signal?: AbortSignal,
  ) {
    if (manufacturerName !== undefined) {
      const manufacturer = await manufacturerService.findByName(
        manufacturerName,
        signal,
      );
      return productService.list(
        { ...query, manufacturerId: manufacturer.id },
        signal,
      );
    }
    return productService.list(query, signal);
  },
};
