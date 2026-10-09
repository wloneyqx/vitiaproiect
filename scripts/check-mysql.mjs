import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const database = process.env.DB_NAME || "svidanie_art";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database,
  connectTimeout: 10000,
});

try {
  const [tables] = await connection.query("SHOW TABLES");
  const [products] = await connection.query("SELECT COUNT(*) AS count FROM products");
  const [orders] = await connection.query("SELECT COUNT(*) AS count FROM orders");
  const [admins] = await connection.query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin' AND active = TRUE");

  console.log(`MySQL connected: ${database}`);
  console.log(`Tables: ${tables.length}`);
  console.log(`Products: ${products[0].count}`);
  console.log(`Orders: ${orders[0].count}`);
  console.log(`Active admins: ${admins[0].count}`);
} finally {
  await connection.end();
}
