import axios, { AxiosError, AxiosHeaders } from "axios";
import { afterEach, describe, expect, it } from "vitest";
import { api } from "@/api/api-config";
import { ApiError } from "@/api/api-error";
import { productService } from "./product.service";

const originalAdapter = api.defaults.adapter;
afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe("productService with configured Axios", () => {
  it("passes normalized filters, cancellation signal and returns the response body", async () => {
    const body = { data: [], total: 0, page: 2, limit: 12, totalPages: 0 };
    const controller = new AbortController();
    api.defaults.adapter = async (config) => {
      expect(config.baseURL).toBe("http://localhost:3000/api/v1");
      expect(config.url).toBe("/products");
      expect(config.params).toEqual({ page: 2, limit: 12, search: "HL-01" });
      expect(config.signal).toBe(controller.signal);
      return { data: body, status: 200, statusText: "OK", headers: {}, config };
    };
    expect(
      await productService.list(
        { page: 2, limit: 12, search: "  HL-01  " },
        controller.signal,
      ),
    ).toEqual(body);
  });

  it("normalizes backend validation arrays and preserves status/details", async () => {
    api.defaults.adapter = async (config) => {
      throw new AxiosError(
        "Bad request",
        "ERR_BAD_REQUEST",
        config,
        undefined,
        {
          data: { message: ["Invalid page", "Invalid limit"] },
          status: 400,
          statusText: "Bad Request",
          headers: new AxiosHeaders(),
          config,
        },
      );
    };
    await expect(productService.list()).rejects.toMatchObject({
      name: "ApiError",
      message: "Invalid page, Invalid limit",
      status: 400,
      details: { message: ["Invalid page", "Invalid limit"] },
    });
  });

  it("keeps cancellation recognizable instead of presenting it as a server error", async () => {
    const controller = new AbortController();
    controller.abort();
    try {
      await productService.list({}, controller.signal);
      throw new Error("Expected cancellation");
    } catch (error) {
      expect(axios.isCancel(error)).toBe(true);
      expect(error).not.toBeInstanceOf(ApiError);
    }
  });
});
