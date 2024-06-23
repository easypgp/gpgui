import { cn } from "@/lib/utils";
import { CheckCircle2, ClipboardCopyIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export interface CopyButtonProps {
  /** Add an extra className to CopyButton wrapper */
  className?: string;
  content: string;
}

export const CopyButton: React.FunctionComponent<CopyButtonProps> = (props) => {
  const [effect, setEffect] = useState(false);
  const { t } = useTranslation("common");

  return (
    <Button
      title={t("Copy to clipboard")}
      aria-label={t("Copy to clipboard")}
      className={cn(
        ["cursor-pointer"],
        { "animate-pulse": effect },
        props.className
      )}
      onClick={() => {
        setEffect(true);
        setTimeout(() => setEffect(false), 1000);
        navigator.clipboard.writeText(props.content);
      }}
      variant="outline"
    >
      {effect ? (
        <CheckCircle2 className="text-green-600" />
      ) : (
        <ClipboardCopyIcon />
      )}
    </Button>
  );
};
