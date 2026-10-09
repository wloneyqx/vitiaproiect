const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token || !jwtSecret) return res.status(401).json({ error: "Unauthorized." });

  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.role !== "admin") return res.status(403).json({ error: "Forbidden." });
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized." });
  }
}

module.exports = { requireAdmin };
