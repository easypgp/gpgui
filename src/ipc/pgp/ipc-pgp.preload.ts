import { ipcRenderer, contextBridge } from "electron";
import { IPC_PGP_CHANNEL } from "./ipc-pgp.constants";

import { IpcPgpExposedCommands } from "./ipc-pgp.types";

export const registerIpcPgpRenderer = async () => {
  let currentContext = "";
  const commands: IpcPgpExposedCommands = {
    call: (params) => {
      params.plumbingArgs = [
        // Inject currentContext into plumbingArgs
        ...(currentContext ? ["--homedir", currentContext] : []),
        // Always trust keys
        "--trust-model",
        "always",
        ...(params.plumbingArgs || []),
      ];
      return ipcRenderer.invoke(`${IPC_PGP_CHANNEL}:call`, params);
    },
    changeContext: async (contextType) => {
      currentContext = await ipcRenderer.invoke(
        `${IPC_PGP_CHANNEL}:changeContext`,
        contextType
      );
      return currentContext;
    },
    currentContext: () => currentContext,
  };

  contextBridge.exposeInMainWorld("pgp", commands);
};
