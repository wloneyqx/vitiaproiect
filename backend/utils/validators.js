function requireString(value, min = 1) {
  return typeof value === "string" && value.trim().length >= min;
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function validPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

module.exports = { requireString, validEmail, validPositiveNumber };
