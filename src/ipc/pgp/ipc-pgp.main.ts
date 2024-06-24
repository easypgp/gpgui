import { rmdir, mkdtemp, readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "child_process";
import { IpcMainInvokeEvent, ipcMain, app } from "electron";
import { readConfiguration } from "../configuration/ipc-configuration.main";
import { defaultTimeout, IPC_PGP_CHANNEL } from "./ipc-pgp.constants";

import {
  IpcPgpChangeContextType,
  IpcPgpParams,
  IpcPgpResult,
} from "./ipc-pgp.types";

const stealthDirectoryPath = app.getPath("temp");

export const registerIpcPgpMain = async () => {
  ipcMain.handle(
    `${IPC_PGP_CHANNEL}:call`,
    async (
      _: IpcMainInvokeEvent,
      params: IpcPgpParams
    ): Promise<IpcPgpResult> => {
      return readConfiguration().then((config) => {
        return new Promise((resolve) => {
          const stdErr: string[] = [];
          const stdOut: string[] = [];
          const pgp = spawn(
            config.gpgPath,
            [...params.args, ...(params.plumbingArgs || [])],
            { timeout: defaultTimeout, killSignal: "SIGKILL" }
          );

          if (params.stdIn) {
            pgp.stdin.setDefaultEncoding("utf-8");
            pgp.stdin.write(params.stdIn);
            pgp.stdin.end();
          }

          pgp.stdout.on("data", (data) => {
            stdOut.push(data.toString());
          });
          pgp.stderr.on("data", (data) => {
            stdErr.push(data.toString());
          });
          pgp.on("close", (exitCode, signal) => {
            if (exitCode || signal === "SIGKILL") {
              return resolve({
                exitCode: exitCode || -1,
                stdOut: stdOut.join("\n"),
                stdErr: stdErr.join("\n") || `Signal: ${signal}`,
              });
            }
            return resolve({
              stdOut: stdOut.join("\n"),
              stdErr: stdErr.join("\n"),
              exitCode: 0,
            });
          });
        });
      });
    }
  );

  ipcMain.handle(
    `${IPC_PGP_CHANNEL}:changeContext`,
    async (_: IpcMainInvokeEvent, contextType: IpcPgpChangeContextType) => {
      // First clean all existing stealth context
      const allStealthContexts = (await readdir(stealthDirectoryPath))
        .filter((f) => f.startsWith("gpgenv-"))
        .map((f) => join(stealthDirectoryPath, f));

      await Promise.all(
        allStealthContexts.map(async (f) => {
          await rmdir(f, { recursive: true });
        })
      );

      // Default context is the one used by gpg by default.
      // so return empty
      if (contextType === "default") {
        return "";
      }

      // Create a new stealth context
      const contextPath = await mkdtemp(join(stealthDirectoryPath, "gpgenv-"));

      return contextPath;
    }
  );
};
