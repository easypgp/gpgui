import { ConfigurationProps } from "@/lib/configuration/configuration.context";

export const IPC_CONFIGURATION_CHANNEL = "ipc-configuration";

export const defaultConfiguration: ConfigurationProps = {
  startInStealthMode: true,
  askForPassphrase: true,
};
