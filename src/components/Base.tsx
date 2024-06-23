import { cn } from "@/lib/utils";
import { omit } from "lodash";

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

export interface BorderProps {
  hasBorder?: boolean;
  hasBorderTop?: boolean;
  hasBorderBottom?: boolean;
  hasBorderLeft?: boolean;
  hasBorderRight?: boolean;
  hasBorderX?: boolean;
  hasBorderY?: boolean;
}

export interface BaseProps
  extends MarginProps,
    PaddingProps,
    BorderProps,
    React.HTMLAttributes<HTMLElement> {
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

const convertSpacingPropsToClassNames = (props: BaseProps) => {
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

const borderSuffixesMap = {
  "": "",
  Top: "-t",
  Bottom: "-b",
  Left: "-l",
  Right: "-r",
  X: "-x",
  Y: "-y",
};
const convertBorderPropsToClassNames = (props: BorderProps) => {
  return Object.keys(props).map((key) => {
    const value = props[key as keyof BorderProps];
    if (!key.startsWith("hasBorder")) {
      return;
    }
    const transformedValue = value ? "" : "-0";

    const suffix = key.replace("hasBorder", "");
    return `border${borderSuffixesMap[suffix as keyof typeof borderSuffixesMap]}${transformedValue}`;
  });
};

export const Base: React.FunctionComponent<BaseProps> = (props) => {
  const Component = props.as || "div";

  const rest = omit(props, [
    "margin",
    "marginX",
    "marginY",
    "marginTop",
    "marginBottom",
    "marginLeft",
    "marginRight",
    "padding",
    "paddingX",
    "paddingY",
    "paddingTop",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "hasBorder",
    "hasBorderTop",
    "hasBorderBottom",
    "hasBorderLeft",
    "hasBorderRight",
    "hasBorderX",
    "hasBorderY",
    "className",
    "as",
    "children",
  ]);

  return (
    <Component
      className={cn(
        convertSpacingPropsToClassNames(props),
        convertBorderPropsToClassNames(props),
        props.className
      )}
      {...rest}
    >
      {props.children}
    </Component>
  );
};
