import { parseListKeysOutput } from "@/lib/pgp/list-keys";
import { GpgPublicKey } from "@/lib/pgp/pgp.types";
import { logger } from "@/lib/logger/renderer";

import {
  ConcealedParam,
  IpcPgpCall,
  IpcPgpError,
  IpcPgpResult,
} from "@/ipc/pgp/ipc-pgp.types";

const ipcPgpCall: IpcPgpCall = async (params) => {
  try {
    const result = await window.pgp.call(params);
    if (result.exitCode !== 0) {
      throw new IpcPgpError("Gpg error", result);
    }
    return result;
  } catch (error) {
    if (error instanceof IpcPgpError) {
      logger.error("Error in ipcPgpCall", error, error.result);
      throw error;
    }
    logger.error("Error in ipcPgpCall", error);
    throw new IpcPgpError(
      "Unknown IPC Gpg error",
      {
        stdOut: "",
        stdErr: "",
        exitCode: -1,
      },
      error
    );
  }
};

export const version = async (): Promise<string> => {
  const result = await ipcPgpCall({
    contextId: "",
    args: ["--version"],
  });

  return result.stdOut;
};

/** List all public keys in the keyring */
export const listKeys = async (): Promise<GpgPublicKey[]> => {
  const result = await ipcPgpCall({
    contextId: "",
    args: ["--list-keys"],
    plumbingArgs: ["--with-colons"],
  });

  return parseListKeysOutput(result.stdOut);
};

/** Encrypt a message for a recipient */
export const encrypt = async ({
  recipient,
  message,
}: {
  recipient: string;
  message: string;
}): Promise<string> => {
  const result = await ipcPgpCall({
    contextId: "",
    args: ["--encrypt", "--armor", "--recipient", recipient],
    stdIn: message,
  });

  return result.stdOut;
};
/** Decrypt a message */
export const decrypt = async ({
  message,
  passphrase,
}: {
  message: string;
  passphrase?: string;
}): Promise<string> => {
  const result = await ipcPgpCall({
    contextId: "",
    args: ["--decrypt"],
    plumbingArgs: [
      ...(passphrase
        ? // When a passphrase is provided, the following
          // combination of flags prevents the passphras
          // dialog from appearing
          [
            "--batch",
            "--pinentry-mode",
            "loopback",
            "--passphrase",
            new ConcealedParam(passphrase),
          ]
        : []),
    ],
    stdIn: message,
  });

  return result.stdOut;
};
/** Import a key into the keyring */
export const importKey = async ({
  key,
}: {
  key: string;
}): Promise<IpcPgpResult> => {
  const result = await ipcPgpCall({
    contextId: "",
    args: ["--import"],
    stdIn: key,
  });

  return result;
};

export const pgp = {
  listKeys,
  encrypt,
  decrypt,
  importKey,
};
