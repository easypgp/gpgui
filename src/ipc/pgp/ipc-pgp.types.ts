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

export class IpcPgpError extends Error {
  stdOut: string;
  stdErr: string;
  exitCode: number;

  constructor(
    message: string,
    public readonly result: IpcPgpResult,
    public readonly originalError?: Error
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "IpcPgpError";
    this.stdOut = result.stdOut;
    this.stdErr = result.stdErr;
    this.exitCode = result.exitCode;
  }
  toString() {
    return `IpcPgpError: ${this.message}
    stdErr: ${this.stdErr}
    stdOut: ${this.stdOut}
    exitCode: ${this.exitCode}
    ${this.stack}
    ${this.originalError && "originalError:"}
    ${this.originalError?.toString()}`;
  }
  toJSON() {
    return {
      message: this.message,
      stdErr: this.stdErr,
      stdOut: this.stdOut,
      exitCode: this.exitCode,
      stack: this.stack,
      originalError: this.originalError?.toString(),
    };
  }
}

/**
 * Actual call from renderer to main process, exposed through contextBridge.
 */
export type IpcPgpCall = (params: IpcPgpParams) => Promise<IpcPgpResult>;

export interface IpcPgpExposedCommands {
  call: IpcPgpCall;
}

declare global {
  interface Window {
    pgp: IpcPgpExposedCommands;
  }
}
