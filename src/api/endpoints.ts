export const endpoints = {
  manufacturers: "/manufacturers",
  products: "/products",
  product: (id: string) => "/products/" + encodeURIComponent(id),
} as const;
