import { readConfiguration } from "../configuration/ipc-configuration.main";
import { Logger } from "@/lib/logger/logger.types";
import { createLogger, logPath, setLevel } from "@/lib/logger/main";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import { IPC_LOGGER_CHANNEL_NAME } from "./ipc-logger.constants";
import { IpcLoggerCallParams } from "./ipc-logger.types";

export const registerIpcLoggerMain = async () => {
  const logger = createLogger("renderer");
  const config = await readConfiguration();
  setLevel(config.logLevel);

  ipcMain.handle(
    `${IPC_LOGGER_CHANNEL_NAME}:call`,
    async (_: IpcMainInvokeEvent, params: IpcLoggerCallParams) => {
      if (logger) {
        logger[params.level](...params.params);
      }
    }
  );
  ipcMain.handle(
    `${IPC_LOGGER_CHANNEL_NAME}:logFileName`,
    async (_: IpcMainInvokeEvent) => {
      return logPath;
    }
  );
  ipcMain.handle(
    `${IPC_LOGGER_CHANNEL_NAME}:setLevel`,
    async (_: IpcMainInvokeEvent, params: keyof Logger) => {
      setLevel(params);
    }
  );
};
