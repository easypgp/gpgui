import { rm, mkdtemp, readdir, access, constants } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "child_process";
import { IpcMainInvokeEvent, ipcMain, app } from "electron";
import { readConfiguration } from "../configuration/ipc-configuration.main";
import { defaultTimeout, IPC_PGP_CHANNEL } from "./ipc-pgp.constants";

import {
  ConcealedParam,
  IpcPgpChangeContextType,
  IpcPgpParams,
  IpcPgpParamsSerialized,
  IpcPgpResult,
} from "./ipc-pgp.types";
import { logger } from "@/lib/logger/main";

const stealthDirectoryPath = app.getPath("temp");

export const registerIpcPgpMain = async () => {
  ipcMain.handle(
    `${IPC_PGP_CHANNEL}:call`,
    async (
      _: IpcMainInvokeEvent,
      paramsSerialized: IpcPgpParamsSerialized
    ): Promise<IpcPgpResult> => {
      const config = await readConfiguration();
      const gpgPath = config.gpgPath;
      // Deserialize params
      const params: IpcPgpParams = {
        ...paramsSerialized,
        args: paramsSerialized.args.map((arg) =>
          typeof arg === "string" ? arg : ConcealedParam.from(arg)
        ),
        plumbingArgs: paramsSerialized.plumbingArgs?.map((arg) =>
          typeof arg === "string" ? arg : ConcealedParam.from(arg)
        ),
      };

      // Ensure the executable exists
      try {
        if (!gpgPath) {
          throw new Error("GPG path not set");
        }
        await access(gpgPath, constants.X_OK);
      } catch (error) {
        return Promise.resolve({
          stdOut: "",
          stdErr: "GPG path does not exist",
          exitCode: -1,
        });
      }

      return new Promise((resolve) => {
        const done = (result: IpcPgpResult) => {
          if (result.exitCode !== 0) {
            logger.error("Error in ipcPgpCall", result);
            return resolve(result);
          }
          logger.debug("ipcPgpCall", result);
          return resolve(result);
        };
        try {
          const stdErr: string[] = [];
          const stdOut: string[] = [];
          logger.info(
            "config.gpgPath",
            [...params.args, ...(params.plumbingArgs || [])].map((arg) =>
              typeof arg === "string" ? arg : arg.toString()
            )
          );
          const pgp = spawn(
            config.gpgPath,
            [...params.args, ...(params.plumbingArgs || [])].map((arg) =>
              typeof arg === "string" ? arg : arg.value
            ),
            { timeout: defaultTimeout, killSignal: "SIGKILL" }
          );

          pgp.stdout.on("error", (error) => {
            return resolve({
              stdOut: "",
              stdErr: error.toString(),
              exitCode: -1,
            });
          });
          pgp.stdout.on("data", (data) => {
            stdOut.push(data.toString());
          });
          pgp.stderr.on("data", (data) => {
            stdErr.push(data.toString());
          });
          pgp.on("close", (exitCode, signal) => {
            if (exitCode || signal === "SIGKILL") {
              return done({
                exitCode: exitCode || -1,
                stdOut: stdOut.join("\n"),
                stdErr: stdErr.join("\n") || `Signal: ${signal}`,
              });
            }
            return done({
              stdOut: stdOut.join("\n"),
              stdErr: stdErr.join("\n"),
              exitCode: 0,
            });
          });

          if (params.stdIn) {
            pgp.stdin.setDefaultEncoding("utf-8");
            pgp.stdin.write(params.stdIn);
            pgp.stdin.end();
          }
        } catch (error) {
          return done({
            stdOut: "",
            stdErr: error.toString(),
            exitCode: -1,
          });
        }
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
          await rm(f, { recursive: true });
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
