import { Logger } from "@/lib/logger/logger.types";
import { ipcRenderer, contextBridge } from "electron";
import { IPC_LOGGER_CHANNEL_NAME } from "./ipc-logger.constants";
import {
  IpcLoggerExposedCommands,
  IpcLoggerCallParams,
} from "./ipc-logger.types";

export const registerIpcLoggerRenderer = async () => {
  const call = (params: IpcLoggerCallParams) => {
    return ipcRenderer.invoke(`${IPC_LOGGER_CHANNEL_NAME}:call`, params);
  };
  const commands: IpcLoggerExposedCommands = {
    debug: (...args: unknown[]) => call({ level: "debug", params: args }),
    info: (...args: unknown[]) => call({ level: "info", params: args }),
    warn: (...args: unknown[]) => call({ level: "warn", params: args }),
    error: (...args: unknown[]) => call({ level: "error", params: args }),
    getLogFilePath: () =>
      ipcRenderer.invoke(`${IPC_LOGGER_CHANNEL_NAME}:logFileName`),
    setLevel: (level: keyof Logger) =>
      ipcRenderer.invoke(`${IPC_LOGGER_CHANNEL_NAME}:setLevel`, level),
  };

  contextBridge.exposeInMainWorld("gpguiLogger", commands);
};
