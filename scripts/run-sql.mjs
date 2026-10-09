import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-sql.mjs database/schema.sql");
  process.exit(1);
}

const sql = await readFile(file, "utf8");
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  connectTimeout: 10000,
  multipleStatements: true,
});

try {
  await connection.query(sql);
  console.log(`Imported ${file}`);
} finally {
  await connection.end();
}
