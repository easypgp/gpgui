import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export interface IndexProps {}

export const Index: React.FunctionComponent<IndexProps> = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <h1 className="underline">{t("Welcome to GPGui")}</h1>
      <p>{t("GPGui is a simple graphic intergace built on top of gpg.")}</p>
      <p>
        {t("See latest releases")}{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://github.com/easypgp/gpgui/releases"
        >
          on GitHub (easypgp/gpgui)
        </a>
      </p>
    </>
  );
};
export const Route = createFileRoute("/_layout/")({
  component: Index,
});
