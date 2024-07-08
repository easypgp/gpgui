import { createLogger } from "@/lib/logger/main";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import { IPC_LOGGER_CHANNEL_NAME } from "./ipc-logger.constants";
import { IpcLoggerCallParams } from "./ipc-logger.types";

export const registerIpcLoggerMain = async () => {
  const logger = createLogger("renderer");

  ipcMain.handle(
    `${IPC_LOGGER_CHANNEL_NAME}:call`,
    async (_: IpcMainInvokeEvent, params: IpcLoggerCallParams) => {
      if (logger) {
        logger[params.level](...params.params);
      }
    }
  );
};
