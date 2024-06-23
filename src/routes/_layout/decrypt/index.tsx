import { createFileRoute, redirect } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useConfiguration } from "@/lib/configuration/use-configuration";
import { AskPasswordDialog } from "@/components/pgp/AskPasswordDialog";
import { decrypt } from "@/lib/pgp";
import { IpcPgpError } from "@/ipc/pgp/ipc-pgp.types";
import { useToast } from "@/components/ui/use-toast";
import { Title } from "@/components/typography/Title";

export interface DecryptProps {
  /** Add an extra className to Decrypt wrapper */
  className?: string;
}

export const Decrypt: React.FunctionComponent<DecryptProps> = (props) => {
  const [message, setMessage] = useState<string>();
  const [decryptedMessage, setDecryptedMessage] = useState<string>();
  const [passphrase, setPassphrase] = useState<string>();
  const askForPassphrase = useConfiguration().get("askForPassphrase");
  const [showPassphraseDialog, setShowPassphraseDialog] = useState(false);

  const { toast } = useToast();

  const updateMessage = useCallback(
    (text: string) => {
      setDecryptedMessage("");
      setMessage(text);
    },
    [setMessage, setDecryptedMessage]
  );
  const decryptMessage = useCallback(
    async (oneTimePassphrase?: string) => {
      if (!message) {
        return;
      }
      const passPhraseInUse = oneTimePassphrase || passphrase;
      if (askForPassphrase && !passPhraseInUse) {
        setShowPassphraseDialog(true);
        return;
      }
      try {
        const decrypted = await decrypt({
          message,
          passphrase: askForPassphrase ? passPhraseInUse : undefined,
        });
        setDecryptedMessage(decrypted);
      } catch (error) {
        if (error instanceof IpcPgpError) {
          toast({
            title: t("Failed to decrypt message"),
            description: error.stdErr,
            variant: "destructive",
          });
        }
        if (passphrase) {
          // Reset passphrase if it was wrong
          setPassphrase(undefined);
        }
      }
    },
    [message, askForPassphrase, passphrase, setDecryptedMessage]
  );

  const { t } = useTranslation("common");
  return (
    <Page className={props.className}>
      <div className="p-4">
        <Title paddingBottom="lg">{t("Decrypt message")}</Title>
        <Textarea
          value={message}
          onChange={(e) => updateMessage(e.target.value)}
          placeholder={t("Paste your encrypted message here")}
        />
        <div className="my-4 text-right">
          <Button disabled={!message} onClick={() => decryptMessage()}>
            {t("Decrypt")}
          </Button>
        </div>
        <div>{decryptedMessage}</div>
        <AskPasswordDialog
          open={showPassphraseDialog}
          onClose={() => {
            setShowPassphraseDialog(false);
          }}
          onValidate={(password) => {
            decryptMessage(password);
            setPassphrase(password);
            decryptMessage();
          }}
        />
      </div>
    </Page>
  );
};

export const Route = createFileRoute("/_layout/decrypt/")({
  component: Decrypt,
  beforeLoad: async () => {
    const config = await window.configuration.load();
    if (!config.gpgPath) {
      throw redirect({ to: "/configuration/" });
    }
  },
});
