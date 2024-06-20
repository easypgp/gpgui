import { ipcRenderer, contextBridge } from "electron";
import { ipcPgpChannel } from "./ipc-pgp.constants";

import { IpcPgpExposedCommands } from "./ipc-pgp.types";

export const registerIpcPgpRenderer = async () => {
  const commands: IpcPgpExposedCommands = {
    call: (params) => ipcRenderer.invoke(ipcPgpChannel, params),
  };

  contextBridge.exposeInMainWorld("pgp", commands);
};
