import { createFileRoute, redirect } from "@tanstack/react-router";
import { CopyButton } from "@/components/CopyButton";
import { PublicKeysList } from "@/components/pgp/PublicKeysList";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { LucideUserX2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { encrypt } from "@/lib/pgp";
import { Title } from "@/components/typography/Title";

export interface EncryptProps {
  /** Add an extra className to Encrypt wrapper */
  className?: string;
  // gpgContext: GpgContext;
}

export const Encrypt: React.FunctionComponent<EncryptProps> = (props) => {
  const [toKeyFingerprint, setToKeyFingerprint] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [encryptedMessage, setEncryptedMessage] = useState<string>();

  const updateMessage = useCallback(
    (text: string) => {
      setEncryptedMessage("");
      setMessage(text);
    },
    [setMessage, setEncryptedMessage]
  );

  const { t } = useTranslation("common");
  const { toast } = useToast();

  const encryptMessage = async () => {
    console.log({ toKeyFingerprint, message });
    if (!toKeyFingerprint || !message) {
      return;
    }
    try {
      const encrypted = await encrypt({
        // context: props.gpgContext,
        recipient: toKeyFingerprint,
        message,
      });
      setEncryptedMessage(encrypted);
    } catch (error) {
      console.error(error);
      toast({
        title: t("Failed to encrypt message"),
        description: t("An error occurred while encrypting the message."),
        variant: "destructive",
      });
    }
  };

  return (
    <Page className={props.className}>
      {!toKeyFingerprint ? (
        <div className="p-4">
          <Title paddingBottom="lg">{t("Select recipent key")}</Title>
          <PublicKeysList
            selectedFingerprint={toKeyFingerprint}
            onSelectKey={(pubKey) =>
              setToKeyFingerprint(pubKey.publicKey.keyId)
            }
          />
        </div>
      ) : (
        <div className="p-4">
          <div className="flex justify-start items-center gap-4 my-4">
            <span>
              {t("Recipient: {{keyId}}", { keyId: toKeyFingerprint })}
            </span>{" "}
            <Button onClick={() => setToKeyFingerprint(undefined)}>
              <LucideUserX2 />
            </Button>
          </div>
          <Textarea
            placeholder={t("Type your message here.")}
            value={message}
            onChange={(e) => updateMessage(e.target.value)}
          />
          <div className="my-4 text-right">
            <Button
              disabled={!message || !toKeyFingerprint}
              onClick={() => encryptMessage()}
            >
              {t("Encrypt")}
            </Button>
          </div>
          {encryptedMessage && (
            <div>
              <div className="text-right">
                <CopyButton content={encryptedMessage} />
              </div>
              <pre>{encryptedMessage}</pre>
            </div>
          )}
        </div>
      )}
    </Page>
  );
};

export const Route = createFileRoute("/_layout/encrypt/")({
  component: Encrypt,
  beforeLoad: async () => {
    const config = await window.configuration.load();
    if (!config.gpgPath) {
      throw redirect({ to: "/configuration/" });
    }
  },
});
