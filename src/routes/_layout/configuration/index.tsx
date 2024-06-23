import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Page } from "@/components/layout/Page";
import { Title } from "@/components/typography/Title";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useConfiguration } from "@/lib/configuration/use-configuration";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Configuration: React.FunctionComponent = () => {
  const config = useConfiguration();
  const { t } = useTranslation("common");
  return (
    <Page className="mx-auto my-4 w-96">
      <Title marginBottom="lg">{t("Configuration")}</Title>
      <div className="flex flex-col gap-4">
        <div>
          <Title level="3">{t("General")}</Title>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("Language")}</Label>
              <LanguageSwitcher />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Switch
                id="start-in-stealth-mode"
                checked={config.get("startInStealthMode")}
                onCheckedChange={(startInStealthMode) =>
                  config.set("startInStealthMode", startInStealthMode)
                }
              />
              <Label htmlFor="start-in-stealth-mode" className="col-span-3">
                {t("Start in stealth mode?")}
              </Label>
            </div>
          </div>
        </div>
        <div>
          <Title level="3">PGP</Title>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Switch
                id="ask-for-passphrase"
                checked={config.get("askForPassphrase")}
                onCheckedChange={(askForPassphrase) =>
                  config.set("askForPassphrase", askForPassphrase)
                }
              />
              <Label htmlFor="ask-for-passphrase" className="col-span-3">
                {t("Ask for passphrase")}
              </Label>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pgp-path" className="text-right">
                {t("PGP path")}
              </Label>
              <Input
                id="pgp-path"
                className="col-span-3"
                value={config.get("gpgPath")}
                onChange={(event) => config.set("gpgPath", event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
export const Route = createFileRoute("/_layout/configuration/")({
  component: Configuration,
});
