import { ConfigurationProps } from "@/lib/configuration/configuration.context";
import { IpcMainInvokeEvent, ipcMain, app } from "electron";
import { readFile, writeFile } from "fs";
import {
  defaultConfiguration,
  IPC_CONFIGURATION_CHANNEL,
} from "./ipc-configuration.constants";

const configurationFilePath = app.getPath("userData") + "/config.json";

export const readConfiguration = async (): Promise<ConfigurationProps> => {
  return new Promise((resolve) => {
    readFile(configurationFilePath, {}, (_, content) => {
      try {
        resolve(JSON.parse(content.toString()));
      } catch (error) {
        resolve(defaultConfiguration);
      }
    });
  });
};

export const registerIpcConfigurationMain = async () => {
  ipcMain.handle(
    `${IPC_CONFIGURATION_CHANNEL}:save`,
    async (
      _: IpcMainInvokeEvent,
      configuration: ConfigurationProps
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        console.log(
          configurationFilePath,
          JSON.stringify(configuration, null, 2)
        );
        writeFile(
          configurationFilePath,
          JSON.stringify(configuration, null, 2),
          (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          }
        );
      });
    }
  );

  ipcMain.handle(
    `${IPC_CONFIGURATION_CHANNEL}:load`,
    async (): Promise<ConfigurationProps> => {
      return readConfiguration();
    }
  );
};
