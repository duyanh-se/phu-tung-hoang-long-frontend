"use client";
import { useEffect, useRef, useState } from "react";
import {
  adminService,
  type AdminInput,
  type AdminList,
  type AdminModule,
  type AdminRecord,
} from "@/services/admin.service";
import { toApiError } from "@/api/api-error";
import { useAdminSession } from "./use-admin-session";

export function useAdminModule(module: AdminModule) {
  const { expire } = useAdminSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<AdminList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [options, setOptions] = useState<{
    categories: AdminRecord[];
    manufacturers: AdminRecord[];
  }>({ categories: [], manufacturers: [] });
  const [optionsReady, setOptionsReady] = useState(module !== "products");
  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(async () => {
      if (controller.signal.aborted) return;
      setLoading(true);
      setError("");
      try {
        const data = await adminService.list(
          module,
          {
            page,
            limit: 10,
            ...(search && module !== "users" ? { search } : {}),
            ...(status ? { status } : {}),
          },
          controller.signal,
        );
        if (!controller.signal.aborted) setResult(data);
      } catch (cause) {
        if (!controller.signal.aborted) {
          const problem = toApiError(cause);
          setError(problem.message);
          if (problem.status === 401 || problem.status === 403) expire();
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    });
    return () => controller.abort();
  }, [module, page, search, status, revision, expire]);
  useEffect(() => {
    if (module !== "products") return;
    let active = true;
    Promise.all([
      adminService.options("categories"),
      adminService.options("manufacturers"),
    ])
      .then(([categories, manufacturers]) => {
        if (active) {
          setOptions({ categories, manufacturers });
          setOptionsReady(true);
        }
      })
      .catch((cause) => {
        if (active) setError(toApiError(cause).message);
      });
    return () => {
      active = false;
    };
  }, [module, revision]);
  async function save(input: AdminInput, id?: string) {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminService.save(module, input, id);
      setMessage(id ? "Đã lưu thay đổi." : "Đã thêm bản ghi.");
      setRevision((v) => v + 1);
      return true;
    } catch (cause) {
      const problem = toApiError(cause);
      setError(problem.message);
      if (problem.status === 401) expire();
      return false;
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function remove(id: string) {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminService.remove(module, id);
      setMessage("Đã xóa bản ghi.");
      if (result?.data.length === 1 && page > 1) setPage(page - 1);
      else setRevision((v) => v + 1);
      return true;
    } catch (cause) {
      const problem = toApiError(cause);
      setError(problem.message);
      if (problem.status === 401) expire();
      return false;
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return {
    result,
    loading,
    error,
    message,
    busy,
    options,
    optionsReady,
    page,
    setPage,
    search,
    status,
    filter: (text: string, state: string) => {
      setPage(1);
      setSearch(text.trim());
      setStatus(state);
    },
    reload: () => setRevision((v) => v + 1),
    save,
    remove,
  };
}
