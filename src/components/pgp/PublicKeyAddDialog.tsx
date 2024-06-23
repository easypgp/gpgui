import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { importKey } from "@/lib/pgp";

export interface PublicKeyAddDialogProps {
  /** Add an extra className to PublicKeyAddDialog wrapper */
  className?: string;
  onKeyAdded?: () => void;
}

export const PublicKeyAddDialog: React.FunctionComponent<
  PublicKeyAddDialogProps
> = ({ onKeyAdded, className }) => {
  const [open, setOpen] = useState(false);
  const [newKey, setNewKey] = useState<string>();

  const { t } = useTranslation("common");
  const { toast } = useToast();
  const onImportKeyClick = useCallback(async () => {
    if (!newKey) {
      return;
    }
    try {
      const message = await importKey({ key: newKey });
      setNewKey("");
      setOpen(false);
      onKeyAdded?.();
      toast({
        title: t("Key imported"),
        description: message.stdOut,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: t("Failed to import key"),
        description: (
          <pre>
            {(error as Error).message
              ? (error as Error).message
              : t("An error occured")}
          </pre>
        ),
        variant: "destructive",
      });
    }
  }, [newKey, onKeyAdded, toast, t]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={className}>
          <Button variant="outline">
            <UserPlus2 /> {t("Add Key")}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Add A New Key")}</DialogTitle>
          <DialogDescription>
            {t("Add a new public key to your keyring")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="name" className="grid-cols-4 items-center">
            {t("New Key")}
          </Label>
          <Textarea
            id="new-key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="grid-cols-4 items-center"
          />
        </div>
        <DialogFooter>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary">{t("Cancel")}</Button>
            </DialogClose>
            <Button type="submit" onClick={onImportKeyClick}>
              <UserPlus2 /> {t("Add Key")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
