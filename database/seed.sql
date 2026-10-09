USE svidanie_art;

INSERT INTO users (id, name, email, phone, password_hash, role, active) VALUES
  (1, 'Svidanie Admin', 'admin@svidanie.art', NULL, '$2b$12$kORrMM7RIikkw4M7t4emi./BzsNIRguxHUJQS1z7DoRZ9stVUHAvO', 'admin', TRUE);

INSERT INTO categories (id, name, slug, description, active, sort_order) VALUES
  (1, 'Canvas Portraits', 'canvas', 'Premium personalized canvas portraits.', TRUE, 1),
  (2, 'Metal Portraits', 'metal', 'Modern aluminum portraits with luminous finish.', TRUE, 2),
  (3, 'String Art', 'string', 'Handcrafted thread portraits.', TRUE, 3);

INSERT INTO products
  (id, category_id, name, slug, short_description, description, base_price, compare_at_price, sale_price, sale_percent, sku, stock, material, occasion, theme, active, featured, sort_order)
VALUES
  (1, 1, 'Portret pe panza', 'the-heirloom', 'Portret personalizat pe panza premium.', 'Portret personalizat pe panza premium, pregatit pentru rama si pentru un cadou memorabil.', 299.00, 369.00, 299.00, 19, 'CANVAS-HEIRLOOM', 100, 'canvas', 'Family Tributes', NULL, TRUE, TRUE, 1),
  (2, 2, 'Portret pe metal', 'modern-radiance', 'Portret luminos pe aluminiu.', 'Portret luminos pe aluminiu, cu finisaj modern, rezistent si potrivit pentru interioare minimaliste.', 349.00, NULL, NULL, NULL, 'METAL-RADIANCE', 100, 'metal', 'Anniversaries', NULL, TRUE, TRUE, 2),
  (3, 3, 'String art 50x50', 'threaded-legacy', 'Portret din fire pentru cadouri memorabile.', 'Portret din fire pentru fotografie de familie, nunta sau cadou personalizat cu impact vizual.', 999.00, 1199.00, 999.00, 17, 'STRING-LEGACY-50', 50, 'string', 'Family Tributes', NULL, TRUE, TRUE, 3);

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
  (1, '/uploads/products/gallery/portret-panza-1.jpg', 'Portret pe panza', 0, TRUE),
  (1, '/uploads/products/gallery/portret-panza-2.jpg', 'Portret pe panza galerie', 1, FALSE),
  (1, '/uploads/products/gallery/portret-panza-3.jpg', 'Portret pe panza galerie', 2, FALSE),
  (1, '/uploads/products/gallery/portret-panza-4.jpg', 'Portret pe panza galerie', 3, FALSE),
  (1, '/uploads/products/gallery/portret-panza-5.jpg', 'Portret pe panza galerie', 4, FALSE),
  (2, '/uploads/products/gallery/portret-metal-1.png', 'Portret pe metal', 0, TRUE),
  (2, '/uploads/products/gallery/portret-metal-2.png', 'Portret pe metal galerie', 1, FALSE),
  (2, '/uploads/products/gallery/portret-metal-3.png', 'Portret pe metal galerie', 2, FALSE),
  (2, '/uploads/products/gallery/portret-metal-4.png', 'Portret pe metal galerie', 3, FALSE),
  (2, '/uploads/products/gallery/portret-metal-5.png', 'Portret pe metal galerie', 4, FALSE),
  (3, '/uploads/products/gallery/string-art-50x50-1.png', 'String art 50x50', 0, TRUE),
  (3, '/uploads/products/gallery/string-art-50x50-2.png', 'String art galerie', 1, FALSE),
  (3, '/uploads/products/gallery/string-art-50x50-3.png', 'String art galerie', 2, FALSE),
  (3, '/uploads/products/gallery/string-art-50x50-4.png', 'String art galerie', 3, FALSE),
  (3, '/uploads/products/gallery/string-art-50x50-5.png', 'String art galerie', 4, FALSE);

INSERT INTO product_variants (product_id, name, size, material, price, stock, sku, active, sort_order) VALUES
  (1, 'Canvas 30x40', '30x40', 'canvas', 299.00, 30, 'CANVAS-HEIRLOOM-30X40', TRUE, 1),
  (1, 'Canvas 40x60', '40x60', 'canvas', 399.00, 30, 'CANVAS-HEIRLOOM-40X60', TRUE, 2),
  (2, 'Metal 20x30', '20x30', 'metal', 349.00, 25, 'METAL-RADIANCE-20X30', TRUE, 1),
  (2, 'Metal 30x40', '30x40', 'metal', 449.00, 25, 'METAL-RADIANCE-30X40', TRUE, 2),
  (2, 'Metal 40x60', '40x60', 'metal', 649.00, 25, 'METAL-RADIANCE-40X60', TRUE, 3),
  (3, 'String Art 50x50', '50x50', 'string', 999.00, 10, 'STRING-LEGACY-50X50', TRUE, 1);

INSERT INTO reviews (product_id, customer_name, rating, comment, approved) VALUES
  (1, 'Ana', 5, 'Calitate foarte buna si livrare rapida.', TRUE),
  (2, 'Mihai', 5, 'Finisajul metalic arata premium.', TRUE);

INSERT INTO promotions (id, name, code, discount_type, discount_value, active) VALUES
  (1, 'Launch Promo', 'SVIDANIE10', 'percent', 10.00, TRUE);

INSERT INTO promotion_products (promotion_id, product_id) VALUES
  (1, 1),
  (1, 3);
