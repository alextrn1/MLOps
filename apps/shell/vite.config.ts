import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", ["VITE_", "VERCEL"]);
  const isVercelBuild = env.VERCEL === "1";

  const remoteEntry = (variable: string, localUrl: string) => {
    const value = env[variable];
    if (isVercelBuild && !value) {
      throw new Error(`${variable} must be configured for the Vercel shell project`);
    }
    return value || localUrl;
  };

  return {
    plugins: [
      react(),
      federation({
        name: "shell",
        remotes: {
          dashboard: { type: "module", name: "dashboard", entry: remoteEntry("VITE_DASHBOARD_REMOTE_URL", "http://127.0.0.1:5174/remoteEntry.js") },
          projects: { type: "module", name: "projects", entry: remoteEntry("VITE_PROJECTS_REMOTE_URL", "http://127.0.0.1:5175/remoteEntry.js") },
          models: { type: "module", name: "models", entry: remoteEntry("VITE_MODELS_REMOTE_URL", "http://127.0.0.1:5176/remoteEntry.js") },
          experiments: { type: "module", name: "experiments", entry: remoteEntry("VITE_EXPERIMENTS_REMOTE_URL", "http://127.0.0.1:5177/remoteEntry.js") },
          datasets: { type: "module", name: "datasets", entry: remoteEntry("VITE_DATASETS_REMOTE_URL", "http://127.0.0.1:5178/remoteEntry.js") },
          deployments: { type: "module", name: "deployments", entry: remoteEntry("VITE_DEPLOYMENTS_REMOTE_URL", "http://127.0.0.1:5179/remoteEntry.js") },
          monitoring: { type: "module", name: "monitoring", entry: remoteEntry("VITE_MONITORING_REMOTE_URL", "http://127.0.0.1:5180/remoteEntry.js") }
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
          "react-router-dom": { singleton: true }
        }
      })
    ],
    server: { host: "127.0.0.1", port: 5173, strictPort: true },
    preview: { port: 5173, strictPort: true },
    build: { target: "esnext" }
  };
});
