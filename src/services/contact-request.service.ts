import { api } from "@/api/api-config";
import { endpoints } from "@/api/endpoints";
import type { ContactRequestDto, CreateContactRequestDto } from "@/types/api";

export const contactRequestService = {
  async create(input: CreateContactRequestDto): Promise<ContactRequestDto> {
    const { data } = await api.post<ContactRequestDto>(
      endpoints.contactRequests,
      {
        fullName: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        phoneNumber: input.phoneNumber.replace(/[\s().-]/g, ""),
        reason: input.reason?.trim() || null,
      } satisfies CreateContactRequestDto,
    );
    return data;
  },
};
