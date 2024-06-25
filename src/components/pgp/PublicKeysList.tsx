import React from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { PublicKeyAddDialog } from "./PublicKeyAddDialog";
import { GpgPublicKey } from "@/lib/pgp/pgp.types";
import { listKeys } from "@/lib/pgp";
import { Base, BorderProps, MarginProps, PaddingProps } from "../Base";
import { LoadingIndicator } from "../LoadingIndicator";
import { useTranslation } from "react-i18next";

interface PublicKeysListProps extends MarginProps, PaddingProps, BorderProps {
  className?: string;
  selectedFingerprint?: string;
  onSelectKey: (key: GpgPublicKey) => void;
  showRefresh?: boolean;
}

export const PublicKeysList: React.FC<PublicKeysListProps> = ({
  onSelectKey,
  selectedFingerprint,
  showRefresh,
  ...extraProps
}) => {
  const { t } = useTranslation("common");
  const {
    data: keys,
    refetch,
    isFetching,
  } = useQuery({
    /** Any query with `pgp` as the first key item is invalidated when the context changes */
    queryKey: ["pgp", "keys", window.pgp.currentContext()],
    queryFn: () => listKeys(),
  });

  return (
    <Base {...extraProps}>
      <Base className="border border-gray-200">
        {isFetching ? (
          <LoadingIndicator />
        ) : keys?.length === 0 ? (
          <Base className="p-4">{t(`No keys found`)}</Base>
        ) : (
          keys?.map((key, index) => (
            <Base
              key={index}
              onClick={() => onSelectKey(key)}
              hasBorderTop={index !== 0}
              className={cn(
                "cursor-pointer",
                "hover:bg-gray-100",
                "flex gap-x-1",
                selectedFingerprint === key.publicKey.keyId ? "bg-gray-200" : ""
              )}
            >
              <span>{key.publicKey.keyId}</span>
              <div className="flex-grow overflow-hidden whitespace-pre">
                {key.uids.map((uid, index) => (
                  <div key={index}>{uid.userId}</div>
                ))}
              </div>
            </Base>
          ))
        )}
      </Base>
      <div className="flex gap-4 justify-end py-4">
        {showRefresh && <Button onClick={() => refetch}>Refresh</Button>}
        <PublicKeyAddDialog
          onKeyAdded={() => {
            refetch();
          }}
        />
      </div>
    </Base>
  );
};
