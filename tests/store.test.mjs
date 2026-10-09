import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const store = JSON.parse(readFileSync(path.join(root, "data", "store.json"), "utf8"));

test("store has active products with unique slugs", () => {
  assert.ok(Array.isArray(store.products));
  assert.ok(store.products.length >= 3);
  const slugs = new Set(store.products.map((product) => product.slug));
  assert.equal(slugs.size, store.products.length);
  assert.ok(store.products.some((product) => product.active));
});

test("product images referenced by the storefront exist", () => {
  for (const product of store.products) {
    assert.ok(product.imageUrl, `${product.slug} needs a primary image`);
    const images = [product.imageUrl, ...(product.galleryImageUrls ?? [])].filter(Boolean);
    assert.ok(images.length > 0, `${product.slug} needs at least one image`);
    for (const imageUrl of images) {
      assert.ok(imageUrl.startsWith("/uploads/"), `${imageUrl} should be a public upload path`);
      const filePath = path.join(root, "public", imageUrl.replace(/^\//, ""));
      assert.ok(existsSync(filePath), `${imageUrl} does not exist on disk`);
    }
  }
});

test("variants, when present, are valid for checkout pricing", () => {
  for (const product of store.products) {
    for (const variant of product.variants ?? []) {
      assert.equal(variant.productId, product.id);
      assert.ok(variant.size);
      if (variant.priceOverride !== null) assert.ok(variant.priceOverride > 0);
    }
  }
});
