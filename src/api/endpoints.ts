export const endpoints = {
  contactRequests: "/contact-requests",
  manufacturers: "/manufacturers",
  products: "/products",
  product: (id: string) => "/products/" + encodeURIComponent(id),
} as const;
