import { spawn } from "child_process";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import { defaultTimeout, ipcPgpChannel } from "./ipc-pgp.constants";

import { IpcPgpParams, IpcPgpResult } from "./ipc-pgp.types";

export const registerIpcPgpMain = async () => {
  ipcMain.handle(
    ipcPgpChannel,
    async (
      _: IpcMainInvokeEvent,
      params: IpcPgpParams
    ): Promise<IpcPgpResult> => {
      return new Promise((resolve) => {
        const stdErr: string[] = [];
        const stdOut: string[] = [];
        const pgp = spawn(
          "/opt/homebrew/bin/gpg",
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
    }
  );
};
