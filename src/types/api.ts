import type { components, paths } from "./generated/api";

export type { components, paths, operations } from "./generated/api";
export type Dto<Name extends keyof components["schemas"]> =
  components["schemas"][Name];
export type ProductDto = Dto<"ProductResponseDto">;
export type ManufacturerDto = Dto<"ManufacturerResponseDto">;
export type ManufacturerListDto = Dto<"ManufacturerListResponseDto">;
export type ManufacturerQuery = NonNullable<
  paths["/api/v1/manufacturers"]["get"]["parameters"]["query"]
>;
export type ProductListDto = Dto<"ProductListResponseDto">;
export type ProductQuery = NonNullable<
  paths["/api/v1/products"]["get"]["parameters"]["query"]
>;
