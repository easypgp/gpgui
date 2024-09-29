/** A parama that should be redacted in logs */
export interface SerilizedConcealedParam {
  __type: "ConcealedParam";
  value: { value: string; isConcealed: boolean };
}
export class ConcealedParam {
  constructor(
    public readonly value: string,
    public readonly isConcealed = true
  ) {}
  public toString = () => {
    return this.isConcealed ? "<redacted>" : this.value;
  };
  public serialize = (): SerilizedConcealedParam => {
    return {
      __type: "ConcealedParam",
      value: { value: this.value, isConcealed: this.isConcealed },
    };
  };
  public static from = (serialized: SerilizedConcealedParam) => {
    return new ConcealedParam(
      serialized.value.value,
      serialized.value.isConcealed
    );
  };
}

/**
 * Params sent from the renderer to the main process
 */
export interface IpcPgpParams {
  contextId: string;
  /** Arguments to pass to the gpg command */
  args: Array<string | ConcealedParam>;
  /**
   * Extra "plumbing" arguments for the gpg command
   *
   * Plumbing arguments are used to have gpg output machine-readable data.
   * For example, `--with-colons` will output colon-separated fields.
   *
   * Those arguments are not meant to be displayed to the
   * user as it has no interest when learning gpg.
   */
  plumbingArgs?: Array<string | ConcealedParam>;
  /**
   * Input to pass to the stdin of the gpg command
   */
  stdIn?: string;
}

export interface IpcPgpParamsSerialized {
  contextId: string;
  args: Array<string | SerilizedConcealedParam>;
  plumbingArgs?: Array<string | SerilizedConcealedParam>;
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

/**
 * Params to change the context of the gpg command
 *
 * Creating a new context will delete any stealth existing context.
 *
 * Default context is the one used by gpg by default.
 */
export type IpcPgpChangeContextType = "stealth" | "default";

export interface IpcPgpExposedCommands {
  call: IpcPgpCall;
  /**
   * Create a new context for GPG command and clear any existing stealth context
   *
   * Returns the new context path.
   */
  changeContext: (context: IpcPgpChangeContextType) => Promise<string>;
  /**
   * Get the current context
   */
  currentContext: () => string;
  /**
   * Get the history of commands executed
   */
  history: () => IpcPgpParamsSerialized[];
}

declare global {
  interface Window {
    pgp: IpcPgpExposedCommands;
  }
}
