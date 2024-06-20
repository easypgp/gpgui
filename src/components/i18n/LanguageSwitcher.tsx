import React from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportedLanguages } from "@/lib/i18n";

export interface LanguageSwitcherProps {
  /** Add an extra className to LanguageSwitcher wrapper */
  className?: string;
}

export const LanguageSwitcher: React.FunctionComponent<
  LanguageSwitcherProps
> = (props) => {
  const { t, i18n } = useTranslation("common");
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className={props.className}>
      <Select onValueChange={changeLanguage} value={i18n.language}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("language")} />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map(({ code, label }) => (
            <SelectItem key={code} value={code}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
