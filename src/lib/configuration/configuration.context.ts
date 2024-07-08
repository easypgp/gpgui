import React, { createContext } from "react";

export interface ConfigurationProps {
  /** Whether the application starts in stealth mode */
  startInStealthMode: boolean;
  /**
   * Whether the application should ask for the passphrase
   * or let the OS GUI do it
   */
  askForPassphrase: boolean;
  /** Path to the PGP binary */
  gpgPath: string;
  /** Log level */
  logLevel: "debug" | "info" | "warn" | "error";
}

export interface ConfigurationContextType {
  set: <K extends keyof ConfigurationProps>(
    propName: K,
    value: ConfigurationProps[K]
  ) => void;
  get: <K extends keyof ConfigurationProps>(
    propName: K
  ) => ConfigurationProps[K];
}
export const configurationContext = createContext<ConfigurationContextType>({
  set: () => {
    throw new Error("Not implemented");
  },
  get: () => {
    throw new Error("Not implemented");
  },
});
