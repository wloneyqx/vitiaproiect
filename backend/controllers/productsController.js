const productService = require("../services/productService");
const { requireString, validPositiveNumber } = require("../utils/validators");

async function list(req, res, next) {
  try {
    const active = req.query.active === undefined ? undefined : req.query.active === "true";
    res.json({ products: await productService.listProducts({ active }) });
  } catch (error) {
    next(error);
  }
}

async function bySlug(req, res, next) {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json({ product });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await productService.softDeleteProduct(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    if (!requireString(req.body.name, 2) || !requireString(req.body.slug, 3) || !validPositiveNumber(req.body.price)) {
      return res.status(422).json({ error: "Invalid product data." });
    }
    res.status(201).json({ product: await productService.createProduct(req.body) });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    await productService.updateProduct(req.params.id, req.body);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, bySlug, create, update, remove };
