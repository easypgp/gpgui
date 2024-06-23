import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface AskPasswordDialogProps {
  /** Callback called when the password is entered */
  onValidate?: (password: string) => void;
  /** Callback called when the dialog is canceled */
  onCancel?: () => void;
  /** Always called when the dialog is closed */
  onClose?: () => void;
  /** Open state of the dialog */
  open: boolean;
}

export const AskPasswordDialog: React.FunctionComponent<
  AskPasswordDialogProps
> = ({ open, onClose, onCancel, onValidate }) => {
  const { t } = useTranslation("common");
  const [password, setPassword] = useState<string>("");

  const onOkClick = () => {
    onValidate(password);
    onClose?.();
  };
  const onCancelClick = useCallback(() => {
    onCancel?.();
  }, [onCancel, onClose]);
  return (
    <Dialog
      open={open}
      onOpenChange={(newVal) => {
        if (!newVal) {
          onClose?.();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Enter password")}</DialogTitle>
          <DialogDescription>
            {t("Enter the password to unlock the key.")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="name" className="grid-cols-4 items-center">
            {t("New Key")}
          </Label>
          <Input
            id="new-key"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="grid-cols-4 items-center"
          />
        </div>
        <DialogFooter>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary" onClick={onCancelClick}>
                {t("Cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" onClick={onOkClick}>
              {t("OK")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
