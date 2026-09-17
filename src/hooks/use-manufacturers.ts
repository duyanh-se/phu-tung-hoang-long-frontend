"use client";

import { useCallback, useEffect, useState } from "react";
import { manufacturerService } from "@/services/manufacturer.service";
import type { ManufacturerDto } from "@/types/api";

export function useManufacturers() {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    data: ManufacturerDto[];
    isLoading: boolean;
    error: boolean;
  }>({ data: [], isLoading: true, error: false });
  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(async () => {
      if (controller.signal.aborted) return;
      setResult({ data: [], isLoading: true, error: false });
      try {
        const data = await manufacturerService.listAll(controller.signal);
        if (!controller.signal.aborted)
          setResult({ data, isLoading: false, error: false });
      } catch {
        if (!controller.signal.aborted)
          setResult({ data: [], isLoading: false, error: true });
      }
    });
    return () => controller.abort();
  }, [revision]);
  const retry = useCallback(() => setRevision((value) => value + 1), []);
  return { ...result, retry };
}
