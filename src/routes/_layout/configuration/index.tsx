import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Page } from "@/components/layout/Page";
import { Title } from "@/components/typography/Title";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useConfiguration } from "@/lib/configuration/use-configuration";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logger } from "@/lib/logger/renderer";
import { Logger } from "@/lib/logger/logger.types";

export const Configuration: React.FunctionComponent = () => {
  const config = useConfiguration();
  const { t } = useTranslation("common");

  const logFilePath = useQuery({
    queryKey: ["logFileName"],
    queryFn: () => window.gpguiLogger.getLogFilePath(),
  });

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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="log-file-path" className="text-right">
                {t("Log file path")}
              </Label>
              <div className="col-span-3">
                <p>
                  {logFilePath.isSuccess ? (
                    logFilePath.data
                  ) : (
                    <LoadingIndicator />
                  )}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="log-level" className="text-right">
                {t("Log Level")}
              </Label>
              <Select
                onValueChange={(value) => {
                  config.set("logLevel", value as keyof Logger);
                  logger.setLevel(value as keyof Logger);
                }}
                value={config.get("logLevel")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("log level")} />
                </SelectTrigger>
                <SelectContent>
                  {["debug", "info", "warn", "error"].map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
