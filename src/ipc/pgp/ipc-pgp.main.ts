import { spawn } from "child_process";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import { ipcPgpChannel } from "./ipc-pgp.constants";

import { IpcPgpParams, IpcPgpResult } from "./ipc-pgp.types";

export const registerIpcPgpMain = async () => {
  ipcMain.handle(
    ipcPgpChannel,
    async (
      _: IpcMainInvokeEvent,
      params: IpcPgpParams
    ): Promise<IpcPgpResult> => {
      return new Promise((resolve, reject) => {
        const stdErr: string[] = [];
        const stdOut: string[] = [];
        const pgp = spawn("gpg", [
          ...params.args,
          ...(params.plumbingArgs || []),
        ]);

        if (params.stdIn) {
          pgp.stdin.setDefaultEncoding("utf-8");
          pgp.stdin.write(params.stdIn);
          pgp.stdin.end();
        }

        pgp.stdout.on("data", (data) => {
          stdOut.push(data.toString());
        });
        pgp.on("error", (data) => {
          stdErr.push(data.toString());
        });
        pgp.on("close", (exitCode) => {
          if (exitCode) {
            return reject({
              exitCode,
              stdOut: stdOut.join("\n"),
              stdErr: stdErr.join("\n"),
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
