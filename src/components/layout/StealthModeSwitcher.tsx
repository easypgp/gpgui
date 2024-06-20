import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

interface StealthModeSwitcherProps {
  onChange: (activateStealthMode: boolean) => void;
  isStealthModeActive: boolean;
}

export function StealthModeSwitcher({
  onChange,
  isStealthModeActive,
}: StealthModeSwitcherProps) {
  const { t } = useTranslation("common");

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="stealth-mode"
        checked={isStealthModeActive}
        onCheckedChange={onChange}
      />
      <Label htmlFor="stealth-mode">{t("Stealth Mode")}</Label>
    </div>
  );
}
