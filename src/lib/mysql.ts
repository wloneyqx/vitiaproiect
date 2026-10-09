import "server-only";

import mysql from "mysql2/promise";

declare global {
  var svidanieMysqlPool: mysql.Pool | undefined;
}

function requireEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") throw new Error(`${name} is required.`);
  return value;
}

export function getPool() {
  if (!globalThis.svidanieMysqlPool) {
    globalThis.svidanieMysqlPool = mysql.createPool({
      host: requireEnv("DB_HOST", "127.0.0.1"),
      port: Number(requireEnv("DB_PORT", "3306")),
      user: requireEnv("DB_USER", "root"),
      password: process.env.DB_PASSWORD ?? "",
      database: requireEnv("DB_NAME", "svidanie_art"),
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 10000,
      namedPlaceholders: true,
      decimalNumbers: true,
    });
  }
  return globalThis.svidanieMysqlPool;
}

export async function query<T>(sql: string, params: Record<string, unknown> | unknown[] = []) {
  const [rows] = await getPool().execute(sql, params as never);
  return rows as T;
}
