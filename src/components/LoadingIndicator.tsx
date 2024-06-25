import { MarginProps, PaddingProps, Base } from "./Base";

export interface LoadingIndicatorProps extends MarginProps, PaddingProps {
  /** Add an extra className to LoadingIndicator wrapper */
  className?: string;
}

export const LoadingIndicator: React.FunctionComponent<
  LoadingIndicatorProps
> = (props) => {
  return <Base {...props}>Loading...</Base>;
};
