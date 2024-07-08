// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { registerIpcPgpRenderer } from "./ipc/pgp/ipc-pgp.preload";
import { registerIpcConfigurationRenderer } from "./ipc/configuration/ipc-configuration.client";
import { registerIpcLoggerRenderer } from "./ipc/logger/ipc-logger.preload";

registerIpcLoggerRenderer();
registerIpcPgpRenderer();
registerIpcConfigurationRenderer();
