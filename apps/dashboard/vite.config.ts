import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "dashboard",
      filename: "remoteEntry.js",
      exposes: { "./routes": "./src/routes.tsx" },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "react-router-dom": { singleton: true }
      }
    })
  ],
  server: { host: "127.0.0.1", port: 5174, strictPort: true, cors: true },
  preview: { port: 5174, strictPort: true, cors: true },
  build: { target: "esnext" }
});
