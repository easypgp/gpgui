import { Link } from "@/components/Link";
import { useTranslation } from "react-i18next";

export interface NavigationProps {
  /** Add an extra className to Navigation wrapper */
  className?: string;
}

export const Navigation: React.FunctionComponent<NavigationProps> = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <Link to="/encrypt">{t("Encrypt")}</Link>
      <Link to="/decrypt">{t("Decrypt")}</Link>
    </>
  );
};
