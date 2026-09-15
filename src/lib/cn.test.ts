import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("semantic typography class merging", () => {
  it("keeps font size when a component receives a text color", () => {
    const result = cn("font-heading text-title font-bold", "text-brand-600");
    expect(result.split(" ")).toContain("text-title");
    expect(result.split(" ")).toContain("text-brand-600");
  });

  it("replaces a size override independently of color and weight", () => {
    const result = cn(
      "text-body font-normal text-muted",
      "text-caption font-bold",
    );
    expect(result.split(" ")).toEqual([
      "text-muted",
      "text-caption",
      "font-bold",
    ]);
  });
});
