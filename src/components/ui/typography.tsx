import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { typographyVariants, fontWeights } from "@/styles/typography";

type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: TextTag;
  variant?: keyof typeof typographyVariants;
  weight?: keyof typeof fontWeights;
  muted?: boolean;
}

export function Typography({
  as: Tag = "p",
  variant = "paragraph",
  weight,
  muted,
  className,
  ...props
}: TypographyProps) {
  return (
    <Tag
      className={cn(
        typographyVariants[variant],
        weight && fontWeights[weight],
        muted && "text-muted",
        className,
      )}
      {...props}
    />
  );
}
export function Title(props: TypographyProps) {
  return <Typography as="h1" variant="title" {...props} />;
}
export function Subtitle(props: TypographyProps) {
  return <Typography as="h2" variant="subtitle" {...props} />;
}
export function Paragraph(props: TypographyProps) {
  return <Typography variant="paragraph" {...props} />;
}
