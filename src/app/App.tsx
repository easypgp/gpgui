import { useTranslation } from "react-i18next";
export interface AppProps {
  /** Add an extra className to App wrapper */
  className?: string;
}

export const App: React.FunctionComponent<AppProps> = (props) => {
  const { t } = useTranslation();
  return <div className={props.className}>{t("Hello World")}</div>;
};
