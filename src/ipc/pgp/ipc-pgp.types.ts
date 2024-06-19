import { GpgPublicKey } from "src/lib/pgp/pgp.types";

/**
 * Params sent from the renderer to the main process
 */
export interface IpcPgpParams {
  contextId: string;
  /** Arguments to pass to the gpg command */
  args: string[];
  /**
   * Extra "plumbing" arguments for the gpg command
   *
   * Plumbing arguments are used to have gpg output machine-readable data.
   * For example, `--with-colons` will output colon-separated fields.
   *
   * Those arguments are not meant to be displayed to the
   * user as it has no interest when learning gpg.
   */
  plumbingArgs?: string[];
  /**
   * Input to pass to the stdin of the gpg command
   */
  stdIn?: string;
}
/**
 * Result sent from the main process to the renderer
 */
export interface IpcPgpResult {
  stdOut: string;
  stdErr: string;
  exitCode: number;
}

/**
 * Actual call from renderer to main process, exposed through contextBridge.
 */
export type IpcPgpCall = (params: IpcPgpParams) => Promise<IpcPgpResult>;

export interface IpcPgpExposedCommands {
  /** List all keys in the keyring */
  listKeys: () => Promise<GpgPublicKey[]>;
}

declare global {
  interface Window {
    pgp: IpcPgpExposedCommands;
  }
}
