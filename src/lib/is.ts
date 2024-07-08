// copied from https://github.com/sindresorhus/electron-util/blob/main/source/shared/is.ts
// given it is not available with types at the time of writing.
import process from "node:process";
import { app } from "electron";

/*
Check for various things.
*/
type Is = {
  /**
	Running on macOS.
	*/
  readonly macos: boolean;

  /**
	Running on Linux.
	*/
  readonly linux: boolean;

  /**
	Running on Windows.
	*/
  readonly windows: boolean;

  /**
	Running on the [main process](https://electronjs.org/docs/tutorial/quick-start/#main-process).
	*/
  readonly main: boolean;

  /**
	Running on the [renderer process](https://electronjs.org/docs/tutorial/quick-start/#renderer-process).
	*/
  readonly renderer: boolean;

  /**
	The app is an Mac App Store build.
	*/
  readonly macAppStore: boolean;

  /**
	The app is a Windows Store AppX build.
	*/
  readonly windowsStore: boolean;

  /**
   the app is in development mode
   */
  readonly development: boolean;

  /**
   the app is in production mode
   */
  readonly production: boolean;
};

export const is: Is = {
  macos: process.platform === "darwin",
  linux: process.platform === "linux",
  windows: process.platform === "win32",
  main: process.type === "browser",
  renderer: process.type === "renderer",
  macAppStore: process.mas,
  windowsStore: process.windowsStore,
  development: app.isPackaged === false,
  production: app.isPackaged === true,
};
