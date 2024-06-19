import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { pluginExposeRenderer } from "./vite.base.config";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"renderer">;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  return {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      pluginExposeRenderer(name),
      react({
        babel: {
          plugins: [
            [
              "i18next-extract",
              {
                outputPath: "locales/{{locale}}/{{ns}}.json",
                nsSeparator: "~",
                keyAsDefaultValue: ["en"],
              },
            ],
          ],
        },
      }),
      viteTsconfigPaths(),
    ],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig;
});
