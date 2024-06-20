import { ipcRenderer, contextBridge } from "electron";
import { IPC_CONFIGURATION_CHANNEL } from "./ipc-configuration.constants";
import { IpcConfigurationExposedCommands } from "./ipc-configuration.types";

export const registerIpcConfigurationRenderer = async () => {
  const commands: IpcConfigurationExposedCommands = {
    save: async (configuration) => {
      await ipcRenderer.invoke(
        `${IPC_CONFIGURATION_CHANNEL}:save`,
        configuration
      );
    },
    load: async () => {
      return await ipcRenderer.invoke(`${IPC_CONFIGURATION_CHANNEL}:load`);
    },
  };

  contextBridge.exposeInMainWorld("configuration", commands);
};
