import * as winston from "winston";
import util from "util";
import { app } from "electron";
import { join } from "path";

import { is } from "@/lib/is";
import { Logger } from "@/lib/logger/logger.types";

// https://github.com/winstonjs/winston/issues/1427
const combineMessageAndSplat = (): winston.Logform.Format => ({
  transform(info) {
    const { [Symbol.for("splat")]: args = [], message } = info;
    // eslint-disable-next-line no-param-reassign
    info.message = util.format(message, ...args);
    return info;
  },
});

export const logPath = join(app.getPath("userData"), "main.log");

const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    combineMessageAndSplat(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [],
});

if (is.development) {
  winstonLogger.add(new winston.transports.Console());
} else {
  winstonLogger.add(new winston.transports.File({ filename: logPath }));
}

export const setLevel = (level: keyof Logger) => {
  winstonLogger.transports.forEach((transport) => {
    transport.level = level;
  });
};

export const createLogger = (name: string): Logger => ({
  debug: (...args: unknown[]) => winstonLogger.debug(name, ...args),
  info: (...args: unknown[]) => winstonLogger.info(name, ...args),
  warn: (...args: unknown[]) => winstonLogger.warn(name, ...args),
  error: (...args: unknown[]) => winstonLogger.error(name, ...args),
});

export const logger = createLogger("main");
