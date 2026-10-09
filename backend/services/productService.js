const pool = require("../database/pool");

async function listProducts({ active } = {}) {
  const where = active === undefined ? "" : "WHERE p.active = :active";
  const [products] = await pool.execute(
    `SELECT p.*, c.name AS category_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY p.active DESC, COALESCE(p.sort_order, 9999), p.created_at DESC`,
    active === undefined ? {} : { active: active ? 1 : 0 },
  );
  return products;
}

async function getProductBySlug(slug) {
  const [products] = await pool.execute(
    `SELECT p.*, c.name AS category_name
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE p.slug = :slug LIMIT 1`,
    { slug },
  );
  if (!products[0]) return null;
  const [images] = await pool.execute(`SELECT * FROM product_images WHERE product_id = :id ORDER BY sort_order`, { id: products[0].id });
  const [variants] = await pool.execute(`SELECT * FROM product_variants WHERE product_id = :id AND active = TRUE ORDER BY sort_order`, { id: products[0].id });
  return { ...products[0], images, variants };
}

async function ensureCategory(connection, name, material) {
  const slug = material || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const [existing] = await connection.execute(`SELECT id FROM categories WHERE slug = :slug LIMIT 1`, { slug });
  if (existing[0]) return existing[0].id;
  const [result] = await connection.execute(`INSERT INTO categories (name, slug, active) VALUES (:name, :slug, TRUE)`, { name, slug });
  return result.insertId;
}

async function createProduct(data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const categoryId = await ensureCategory(connection, data.category || "Custom Portrait", data.material || "canvas");
    const [result] = await connection.execute(
      `INSERT INTO products
       (category_id, name, slug, short_description, description, base_price, compare_at_price, sale_price, sale_percent, sku, stock, material, occasion, theme, active, featured, sort_order)
       VALUES (:categoryId, :name, :slug, :shortDescription, :description, :price, :compareAtPrice, :salePrice, :salePercent, :sku, :stock, :material, :occasion, :theme, :active, :featured, :sortOrder)`,
      {
        categoryId,
        name: data.name,
        slug: data.slug,
        shortDescription: (data.description || "").slice(0, 300),
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        salePrice: data.salePrice || null,
        salePercent: data.salePercent || null,
        sku: data.sku || data.slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
        stock: data.stock || 0,
        material: data.material || "canvas",
        occasion: data.occasion || null,
        theme: data.theme || null,
        active: data.active === false ? 0 : 1,
        featured: data.featured ? 1 : 0,
        sortOrder: data.topSellerRank || null,
      },
    );
    await connection.commit();
    return { id: result.insertId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateProduct(id, data) {
  await pool.execute(
    `UPDATE products SET
      name = COALESCE(:name, name),
      slug = COALESCE(:slug, slug),
      description = COALESCE(:description, description),
      base_price = COALESCE(:price, base_price),
      compare_at_price = :compareAtPrice,
      sale_price = :salePrice,
      sale_percent = :salePercent,
      stock = COALESCE(:stock, stock),
      active = COALESCE(:active, active),
      featured = COALESCE(:featured, featured)
     WHERE id = :id`,
    {
      id,
      name: data.name || null,
      slug: data.slug || null,
      description: data.description || null,
      price: data.price || null,
      compareAtPrice: data.compareAtPrice || null,
      salePrice: data.salePrice || null,
      salePercent: data.salePercent || null,
      stock: data.stock ?? null,
      active: data.active === undefined ? null : data.active ? 1 : 0,
      featured: data.featured === undefined ? null : data.featured ? 1 : 0,
    },
  );
}

async function softDeleteProduct(id) {
  await pool.execute(`UPDATE products SET active = FALSE WHERE id = :id`, { id });
}

module.exports = { listProducts, getProductBySlug, createProduct, updateProduct, softDeleteProduct };
