import { api } from "@/api/api-config";
import { ApiError } from "@/api/api-error";
import { endpoints } from "@/api/endpoints";
import type { ManufacturerDto, ManufacturerListDto } from "@/types/api";

export const manufacturerService = {
  async findByName(
    name: string,
    signal?: AbortSignal,
  ): Promise<ManufacturerDto> {
    const normalized = name.trim().toLocaleLowerCase("vi-VN");
    if (!normalized || name.length > 200)
      throw new ApiError("Tên hãng không hợp lệ.", 400);
    let page = 1;
    let match: ManufacturerDto | undefined;
    do {
      const { data } = await api.get<ManufacturerListDto>(
        endpoints.manufacturers,
        {
          params: { search: name.trim(), page, limit: 100 },
          signal,
        },
      );
      for (const manufacturer of data.data) {
        if (
          manufacturer.name.trim().toLocaleLowerCase("vi-VN") === normalized
        ) {
          if (match && match.id !== manufacturer.id)
            throw new ApiError(
              "Có nhiều hãng trùng tên. Vui lòng kiểm tra lại.",
              409,
            );
          match = manufacturer;
        }
      }
      if (page >= data.totalPages) break;
      page++;
    } while (!signal?.aborted);
    if (signal?.aborted) signal.throwIfAborted();
    if (!match)
      throw new ApiError("Chưa tìm thấy hãng " + name.trim() + ".", 404);
    return match;
  },
};
