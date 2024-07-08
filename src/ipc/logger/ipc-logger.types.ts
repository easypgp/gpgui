import { Logger } from "@/lib/logger/logger.types";

export interface IpcLoggerExposedCommands {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  getLogFilePath: () => Promise<string>;
  setLevel: (level: keyof Logger) => void;
}

export interface IpcLoggerCallParams {
  level: keyof Logger;
  params: unknown[];
}

declare global {
  interface Window {
    gpguiLogger: IpcLoggerExposedCommands;
  }
}
