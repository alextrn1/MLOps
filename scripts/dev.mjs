import { spawn } from "node:child_process";

const remotes = [
  ["@mlops/dashboard", "http://127.0.0.1:5174/remoteEntry.js"],
  ["@mlops/projects", "http://127.0.0.1:5175/remoteEntry.js"],
  ["@mlops/models", "http://127.0.0.1:5176/remoteEntry.js"],
  ["@mlops/experiments", "http://127.0.0.1:5177/remoteEntry.js"],
  ["@mlops/datasets", "http://127.0.0.1:5178/remoteEntry.js"],
  ["@mlops/deployments", "http://127.0.0.1:5179/remoteEntry.js"],
  ["@mlops/monitoring", "http://127.0.0.1:5180/remoteEntry.js"]
];

const children = new Set();
const pnpmCli = process.env.npm_execpath;
if (!pnpmCli) throw new Error("pnpm executable was not provided by the workspace runner");

function start(filter) {
  const child = spawn(process.execPath, [pnpmCli, "--filter", filter, "dev"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit"
  });
  children.add(child);
  child.once("exit", (code) => {
    children.delete(child);
    if (code && !stopping) {
      console.error(`${filter} завершился с кодом ${code}`);
      shutdown(code);
    }
  });
  return child;
}

async function waitForEntry(name, url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok && (response.headers.get("content-type") ?? "").includes("javascript")) return;
    } catch {
      // The Vite server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Remote ${name} не опубликовал ${url} за ${timeoutMs}ms`);
}

let stopping = false;
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill("SIGTERM");
  setTimeout(() => process.exit(code), 100).unref();
}

process.once("SIGINT", () => shutdown(0));
process.once("SIGTERM", () => shutdown(0));

for (const [name] of remotes) start(name);

try {
  await Promise.all(remotes.map(([name, url]) => waitForEntry(name, url)));
  start("@mlops/shell");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  shutdown(1);
}

await new Promise(() => {});
