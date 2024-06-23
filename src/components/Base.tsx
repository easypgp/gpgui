import { cn } from "@/lib/utils";

type Spacing = "none" | "sm" | "md" | "lg" | "xl" | "0" | "1" | "2" | "3" | "4";

export interface MarginProps {
  margin?: Spacing;
  marginX?: Spacing;
  marginY?: Spacing;
  marginTop?: Spacing;
  marginBottom?: Spacing;
  marginLeft?: Spacing;
  marginRight?: Spacing;
}

export interface PaddingProps {
  padding?: Spacing;
  paddingX?: Spacing;
  paddingY?: Spacing;
  paddingTop?: Spacing;
  paddingBottom?: Spacing;
  paddingLeft?: Spacing;
  paddingRight?: Spacing;
}

export interface BaseProps extends MarginProps, PaddingProps {
  /** Add an extra className to Base wrapper */
  className?: string;
  /** The element type to render, default div */
  as?: React.ElementType;
  children?: React.ReactNode;
}

const convertSpacingToClassSuffix = (spacing: Spacing): string => {
  switch (spacing) {
    case "none":
      return "0";
    case "sm":
      return "1";
    case "md":
      return "2";
    case "lg":
      return "4";
    case "xl":
      return "8";
    default:
      return `${spacing}`;
  }
};

const convertMarginPropsToClassNames = (props: BaseProps) => {
  return Object.keys(props).map((key) => {
    const value = props[key as keyof BaseProps];
    if (!key.startsWith("margin") && !key.startsWith("padding")) {
      return;
    }

    const prefix = key.startsWith("margin") ? "m" : "p";
    const position = key.replace("margin", "").replace("padding", "");
    const suffix = convertSpacingToClassSuffix(value as Spacing);
    if (!suffix) {
      return;
    }

    switch (position) {
      case "":
        return `${prefix}-${suffix}`;
      case "X":
        return `${prefix}x-${suffix}`;
      case "Y":
        return `${prefix}y-${suffix}`;
      case "Top":
        return `${prefix}t-${suffix}`;
      case "Bottom":
        return `${prefix}b-${suffix}`;
      case "Left":
        return `${prefix}l-${suffix}`;
      case "Right":
        return `${prefix}r-${suffix}`;
      default:
        return;
    }
  });
};

export const Base: React.FunctionComponent<BaseProps> = (props) => {
  const Component = props.as || "div";

  return (
    <Component
      className={cn(convertMarginPropsToClassNames(props), props.className)}
    >
      {props.children}
    </Component>
  );
};
