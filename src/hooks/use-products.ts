"use client";

import { useCallback, useEffect, useState } from "react";
import { toApiError, type ApiError } from "@/api/api-error";
import { catalogService } from "@/services/catalog.service";
import type { ProductListDto, ProductQuery } from "@/types/api";

type Result = {
  key: string;
  data: ProductListDto | null;
  error: ApiError | null;
  isLoading: boolean;
};

export function useProducts(
  query: ProductQuery = {},
  manufacturerName?: string,
) {
  const { page = 1, limit = 12, search, categoryId, manufacturerId } = query;
  const [revision, setRevision] = useState(0);
  const key = JSON.stringify([
    page,
    limit,
    search,
    categoryId,
    manufacturerId,
    manufacturerName,
    revision,
  ]);
  const [result, setResult] = useState<Result>({
    key,
    data: null,
    error: null,
    isLoading: true,
  });
  const refetch = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    // Defer the loading update; cleanup suppresses stale requests, including Strict Mode.
    void Promise.resolve().then(async () => {
      if (controller.signal.aborted) return;
      setResult({ key, data: null, error: null, isLoading: true });
      try {
        const data = await catalogService.list(
          { page, limit, search, categoryId, manufacturerId },
          manufacturerName,
          controller.signal,
        );
        if (!controller.signal.aborted)
          setResult({ key, data, error: null, isLoading: false });
      } catch (error) {
        if (!controller.signal.aborted)
          setResult({
            key,
            data: null,
            error: toApiError(error),
            isLoading: false,
          });
      }
    });
    return () => controller.abort();
  }, [
    page,
    limit,
    search,
    categoryId,
    manufacturerId,
    manufacturerName,
    revision,
    key,
  ]);

  return {
    ...(result.key === key
      ? result
      : { data: null, error: null, isLoading: true }),
    refetch,
  };
}
