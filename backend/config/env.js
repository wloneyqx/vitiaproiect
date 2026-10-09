const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || process.env.ADMIN_SESSION_SECRET || "",
};
