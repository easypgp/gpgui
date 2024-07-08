import { Logger } from "@/lib/logger/logger.types";

export const logger: Logger & { setLevel: (level: keyof Logger) => void } = {
  debug: (...args: unknown[]) => window.gpguiLogger.debug(...args),
  info: (...args: unknown[]) => window.gpguiLogger.info(...args),
  warn: (...args: unknown[]) => window.gpguiLogger.warn(...args),
  error: (...args: unknown[]) => window.gpguiLogger.error(...args),
  setLevel: (level) => window.gpguiLogger.setLevel(level),
};
