const pool = require("../database/pool");

function orderNumber(id) {
  return `SV-${new Date().getFullYear()}-${String(id).padStart(5, "0")}`;
}

async function createOrder(data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const ids = [...new Set(data.cart.map((item) => Number(item.productId)))];
    const [products] = await connection.query(`SELECT * FROM products WHERE id IN (?) AND active = TRUE`, [ids]);
    const byId = new Map(products.map((product) => [String(product.id), product]));
    const items = [];

    for (const item of data.cart) {
      const product = byId.get(String(item.productId));
      if (!product) throw new Error("A product is not available.");
      let variant = null;
      if (item.variantId) {
        const [variants] = await connection.execute(
          `SELECT * FROM product_variants WHERE id = :variantId AND product_id = :productId AND active = TRUE LIMIT 1`,
          { variantId: item.variantId, productId: item.productId },
        );
        variant = variants[0] || null;
      }
      const unitPrice = Number(variant?.price || product.sale_price || product.base_price);
      items.push({
        product,
        variant,
        quantity: Number(item.quantity),
        unitPrice,
        total: unitPrice * Number(item.quantity),
        customization: item.customization || {},
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const [orderResult] = await connection.execute(
      `INSERT INTO orders
       (order_number, customer_name, customer_email, customer_phone, delivery_country, delivery_city, delivery_address, delivery_postal_code, subtotal, discount, delivery_price, total)
       VALUES (:orderNumber, :customerName, :email, :phone, :country, :city, :address, :postalCode, :subtotal, 0, 0, :total)`,
      {
        orderNumber: `pending-${Date.now()}`,
        customerName: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        country: data.country,
        city: data.city,
        address: data.address,
        postalCode: data.postalCode || null,
        subtotal,
        total: subtotal,
      },
    );

    const number = orderNumber(orderResult.insertId);
    await connection.execute(`UPDATE orders SET order_number = :number WHERE id = :id`, { number, id: orderResult.insertId });
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, variant_id, product_name, product_image_url, material, size, style, quantity, unit_price, total_price, uploaded_photo_url, preview_image_url, customization_note)
         VALUES (:orderId, :productId, :variantId, :productName, NULL, :material, :size, :style, :quantity, :unitPrice, :total, :uploadedPhotoUrl, :previewImageUrl, :note)`,
        {
          orderId: orderResult.insertId,
          productId: item.product.id,
          variantId: item.variant?.id || null,
          productName: item.product.name,
          material: item.product.material,
          size: item.customization.size || item.variant?.size || null,
          style: item.customization.style || item.variant?.name || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          uploadedPhotoUrl: item.customization.uploadedPhotoUrl || null,
          previewImageUrl: item.customization.previewImageUrl || null,
          note: item.customization.note || null,
        },
      );
    }
    await connection.commit();
    return { id: orderResult.insertId, orderNumber: number, total: subtotal };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { createOrder };
