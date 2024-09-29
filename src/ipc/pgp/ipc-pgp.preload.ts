import { ipcRenderer, contextBridge } from "electron";
import { IPC_PGP_CHANNEL } from "./ipc-pgp.constants";

import { IpcPgpExposedCommands, IpcPgpParamsSerialized } from "./ipc-pgp.types";

export const registerIpcPgpRenderer = async () => {
  let currentContext = "";
  const historyOfCommands: IpcPgpParamsSerialized[] = [];

  const commands: IpcPgpExposedCommands = {
    call: (params) => {
      historyOfCommands.push(params);
      params.plumbingArgs = [
        // Inject currentContext into plumbingArgs
        ...(currentContext ? ["--homedir", currentContext] : []),
        // Always trust keys
        "--trust-model",
        "always",
        ...(params.plumbingArgs || []),
      ];
      const serializedParams: IpcPgpParamsSerialized = {
        ...params,
        args: params.args.map((arg) =>
          typeof arg === "string" ? arg : arg.serialize()
        ),
        plumbingArgs: params.plumbingArgs?.map((arg) =>
          typeof arg === "string" ? arg : arg.serialize()
        ),
      };
      return ipcRenderer.invoke(`${IPC_PGP_CHANNEL}:call`, serializedParams);
    },
    changeContext: async (contextType) => {
      currentContext = await ipcRenderer.invoke(
        `${IPC_PGP_CHANNEL}:changeContext`,
        contextType
      );
      return currentContext;
    },
    currentContext: () => currentContext,
    history: () => historyOfCommands,
  };

  contextBridge.exposeInMainWorld("pgp", commands);
};
