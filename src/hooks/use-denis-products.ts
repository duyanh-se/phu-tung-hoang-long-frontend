"use client";
import { useProducts } from "./use-products";
import { landingContent } from "@/config/landing";

export function useDenisProducts() {
  return useProducts(
    { page: 1, limit: 6 },
    landingContent.featuredManufacturer,
  );
}
