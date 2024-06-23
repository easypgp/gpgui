import { cn } from "@/lib/utils";
import { Base, MarginProps, PaddingProps } from "@/components/Base";

export interface TitleProps extends MarginProps, PaddingProps {
  /** Add an extra className to Title wrapper */
  className?: string;
  level?: "1" | "2" | "3" | "4" | "5" | "6";
  children: React.ReactNode;
}

const classNamesByLevel = {
  1: "text-4xl",
  2: "text-3xl",
  3: "text-2xl",
  4: "text-xl",
  5: "text-lg",
  6: "text-base",
};

export const Title: React.FunctionComponent<TitleProps> = ({
  level = "2",
  className,
  children,
  ...extraProps
}) => {
  const Tag = `h${level}` as React.ElementType;

  return (
    <Base
      as={Tag}
      className={cn(classNamesByLevel[level], className)}
      {...extraProps}
    >
      {children}
    </Base>
  );
};
