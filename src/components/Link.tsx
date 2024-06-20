import { Link as RouterLink } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type RouterLinkProps = React.ComponentProps<typeof RouterLink>;
type ButtonProps = React.ComponentProps<typeof Button>;
type BaseLinkProps = Pick<RouterLinkProps, "to"> & Pick<ButtonProps, "variant">;

export interface LinkProps extends BaseLinkProps {
  children: React.ReactNode;
}

export const Link: React.FunctionComponent<LinkProps> = (props) => {
  return (
    <Button asChild>
      <RouterLink {...props} />
    </Button>
  );
};
