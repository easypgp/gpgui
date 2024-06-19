/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("No root element found");
}
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <h1>💖 Hello World!</h1>
    <p>Welcome to your Electron application.</p>
  </React.StrictMode>
);

if (window.pgp && window.pgp.listKeys) {
  window.pgp.listKeys().then((result) => {
    console.log("Received result:", result);
  });
}
