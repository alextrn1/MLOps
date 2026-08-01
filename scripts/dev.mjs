import { spawn } from "node:child_process";
import { once } from "node:events";

const remotes = [
  ["@mlops/dashboard", "http://127.0.0.1:5174/remoteEntry.js"],
  ["@mlops/projects", "http://127.0.0.1:5175/remoteEntry.js"],
  ["@mlops/models", "http://127.0.0.1:5176/remoteEntry.js"],
  ["@mlops/experiments", "http://127.0.0.1:5177/remoteEntry.js"],
  ["@mlops/datasets", "http://127.0.0.1:5178/remoteEntry.js"],
  ["@mlops/deployments", "http://127.0.0.1:5179/remoteEntry.js"],
  ["@mlops/monitoring", "http://127.0.0.1:5180/remoteEntry.js"]
];

const isWindows = process.platform === "win32";
const minimumRemoteTimeoutMs = 90_000;
const configuredRemoteTimeoutMs = Number.parseInt(process.env.DEV_REMOTE_ENTRY_TIMEOUT_MS ?? "120000", 10);
if (!Number.isFinite(configuredRemoteTimeoutMs) || configuredRemoteTimeoutMs <= 0) {
  throw new Error("DEV_REMOTE_ENTRY_TIMEOUT_MS must be a positive integer");
}
const remoteTimeoutMs = Math.max(configuredRemoteTimeoutMs, minimumRemoteTimeoutMs);

const children = new Map();
const pnpmCli = process.env.npm_execpath;
if (!pnpmCli) throw new Error("pnpm executable was not provided by the workspace runner");

let stopping = false;

function start(filter) {
  const child = spawn(process.execPath, [pnpmCli, "--filter", filter, "dev"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    windowsHide: true
  });
  children.set(child.pid, child);
  child.once("error", (error) => {
    if (!stopping) {
      console.error(`[dev] Не удалось запустить ${filter}:`, error);
      void shutdown(1);
    }
  });
  child.once("exit", (code, signal) => {
    children.delete(child.pid);
    if (!stopping) {
      console.error(`[dev] ${filter} завершился (code=${code ?? "null"}, signal=${signal ?? "none"})`);
      void shutdown(code || 1);
    }
  });
  return child;
}

async function waitForEntry(name, url, timeoutMs = remoteTimeoutMs) {
  const startedAt = Date.now();
  const deadline = startedAt + timeoutMs;
  let nextProgressMessageAt = startedAt + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(2_000)
      });
      if (response.ok && (response.headers.get("content-type") ?? "").includes("javascript")) {
        console.log(`[dev] ${name} готов: ${url}`);
        return;
      }
    } catch {
      // The Vite server is still starting.
    }
    if (Date.now() >= nextProgressMessageAt) {
      console.log(`[dev] ${name} всё ещё запускается (${Date.now() - startedAt}ms)`);
      nextProgressMessageAt += 30_000;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Remote ${name} не опубликовал ${url} за ${timeoutMs}ms`);
}

async function terminateChild(child) {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;

  if (isWindows) {
    await Promise.race([
      once(child, "exit").catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, 3_000))
    ]);
    if (child.exitCode !== null || child.signalCode !== null) return;
    const killer = spawn("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true
    });
    await once(killer, "exit").catch(() => undefined);
    return;
  }

  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit").catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, 5_000))
  ]);
  if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
}

async function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  console.log("\n[dev] Останавливаю дочерние процессы…");
  const activeChildren = [...children.values()];
  await Promise.allSettled(activeChildren.map(terminateChild));
  process.exit(code);
}

process.once("SIGINT", () => void shutdown(0));
process.once("SIGTERM", () => void shutdown(0));

console.log(`[dev] Запускаю 7 remote; timeout remoteEntry.js: ${remoteTimeoutMs}ms`);
for (const [name] of remotes) start(name);

try {
  await Promise.all(remotes.map(([name, url]) => waitForEntry(name, url)));
  start("@mlops/shell");
  console.log("[dev] Shell запущен. Всего приложений: 8.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  await shutdown(1);
}

await new Promise(() => {});
