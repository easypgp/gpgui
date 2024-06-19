import { parseListKeysOutput } from "@/lib/pgp/list-keys";
import { ipcRenderer, contextBridge } from "electron";
import { ipcPgpChannel } from "./ipc-pgp.constants";

import { IpcPgpCall, IpcPgpExposedCommands } from "./ipc-pgp.types";

export const registerIpcPgpRenderer = async () => {
  const ipcPgpCall: IpcPgpCall = async (params) => {
    return ipcRenderer.invoke(ipcPgpChannel, params);
  };
  const commands: IpcPgpExposedCommands = {
    listKeys: async () => {
      const result = await ipcPgpCall({
        contextId: "",
        args: ["--list-keys"],
        plumbingArgs: ["--with-colons"],
      });

      return parseListKeysOutput(result.stdOut);
    },
  };
  contextBridge.exposeInMainWorld("pgp", commands);
};
