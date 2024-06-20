import { ConfigurationProps } from "@/lib/configuration/configuration.context";

export interface IpcConfigurationExposedCommands {
  /** Save configuration to disk */
  save: (configuration: ConfigurationProps) => Promise<void>;
  /** Load configuration from disk */
  load: () => Promise<ConfigurationProps>;
}
declare global {
  interface Window {
    configuration: IpcConfigurationExposedCommands;
  }
}
