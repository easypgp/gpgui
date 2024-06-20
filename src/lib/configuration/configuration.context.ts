import React from "react";

export interface ConfigurationProps {
  /** Whether the application starts in stealth mode */
  startInStealthMode: boolean;
  /**
   * Whether the application should ask for the passphrase
   * or let the OS GUI do it
   */
  askForPassphrase: boolean;
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
export const configurationContext =
  React.createContext<ConfigurationContextType>({
    set: () => {
      throw new Error("Not implemented");
    },
    get: () => {
      throw new Error("Not implemented");
    },
  });
