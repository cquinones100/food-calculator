import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import setEnvironment from "./src/scripts/setEnvironment";

setEnvironment();

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["vitest.setup.ts"],
    fileParallelism: false,
  },
});
