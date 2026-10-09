import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import "dotenv/config";

function requiredEnv(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

const host = requiredEnv("DB_HOST", "127.0.0.1");
const port = requiredEnv("DB_PORT", "3306");
const user = requiredEnv("DB_USER", "root");
const password = process.env.DB_PASSWORD ?? "";
const database = requiredEnv("DB_NAME", "svidanie_art");
const backupDir = process.env.DB_BACKUP_DIR || "backups";
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = path.resolve(process.cwd(), backupDir, `${database}-${stamp}.sql`);

await mkdir(path.dirname(outputPath), { recursive: true });

const args = [
  `--host=${host}`,
  `--port=${port}`,
  `--user=${user}`,
  "--single-transaction",
  "--routines",
  "--triggers",
  "--set-gtid-purged=OFF",
  database,
  `--result-file=${outputPath}`,
];

const env = { ...process.env };
if (password) env.MYSQL_PWD = password;

await new Promise((resolve, reject) => {
  const child = spawn("mysqldump", args, { env, stdio: ["ignore", "inherit", "inherit"], shell: process.platform === "win32" });
  child.on("error", reject);
  child.on("exit", (code) => {
    if (code === 0) resolve();
    else reject(new Error(`mysqldump exited with code ${code}. Make sure MySQL client tools are installed.`));
  });
});

console.log(`Backup saved to ${outputPath}`);
