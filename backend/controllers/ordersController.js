const orderService = require("../services/orderService");
const pool = require("../database/pool");
const { validEmail } = require("../utils/validators");

async function create(req, res, next) {
  try {
    if (!validEmail(req.body.email) || !Array.isArray(req.body.cart) || req.body.cart.length === 0) {
      return res.status(422).json({ error: "Invalid order data." });
    }
    res.status(201).json({ order: await orderService.createOrder(req.body) });
  } catch (error) {
    next(error);
  }
}

async function byId(req, res, next) {
  try {
    const [orders] = await pool.execute(`SELECT * FROM orders WHERE id = :id LIMIT 1`, { id: req.params.id });
    if (!orders[0]) return res.status(404).json({ error: "Order not found." });
    const [items] = await pool.execute(`SELECT * FROM order_items WHERE order_id = :id`, { id: req.params.id });
    res.json({ order: { ...orders[0], items } });
  } catch (error) {
    next(error);
  }
}

async function adminList(_req, res, next) {
  try {
    const [orders] = await pool.execute(`SELECT * FROM orders ORDER BY created_at DESC`);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

async function status(req, res, next) {
  try {
    await pool.execute(`UPDATE orders SET order_status = :status WHERE id = :id`, { id: req.params.id, status: req.body.status });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, byId, adminList, status };
