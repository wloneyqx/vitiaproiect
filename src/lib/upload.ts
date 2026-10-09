import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type SaveUploadResult = { ok: true; url: string } | { ok: false; error: string };

function customerUploadRoot() {
  return process.env.CUSTOMER_UPLOAD_DIR
    ? path.resolve(process.env.CUSTOMER_UPLOAD_DIR)
    : path.join(process.cwd(), ".data", "uploads", "customers");
}

function publicUploadRoot(subdir: "products") {
  return path.join(process.cwd(), "public", "uploads", subdir);
}

function detectImageMime(buffer: Buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export async function saveUploadedFile(
  file: File,
  subdir: "customers" | "products",
  maxBytes = 8 * 1024 * 1024
): Promise<SaveUploadResult> {
  if (!file || file.size === 0) return { ok: false, error: "No file provided." };
  if (file.size > maxBytes) {
    return { ok: false, error: `File is too large (max ${Math.round(maxBytes / 1024 / 1024)}MB).` };
  }
  if (!ALLOWED_MIME_TO_EXT[file.type]) return { ok: false, error: "Unsupported image type. Use JPG, PNG, or WEBP." };

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectImageMime(buffer);
  if (!detectedMime || detectedMime !== file.type) {
    return { ok: false, error: "The uploaded file is not a valid JPG, PNG, or WEBP image." };
  }

  const ext = ALLOWED_MIME_TO_EXT[detectedMime];
  const dir = subdir === "customers" ? customerUploadRoot() : publicUploadRoot("products");
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(/* turbopackIgnore: true */ dir, filename), buffer);

  const url = subdir === "customers" ? `/api/customer-uploads/${filename}` : `/uploads/products/${filename}`;
  return { ok: true, url };
}

export function getCustomerUploadPath(filename: string) {
  if (!/^[0-9a-f-]{36}\.(?:jpg|png|webp)$/.test(filename)) return null;
  return path.join(/* turbopackIgnore: true */ customerUploadRoot(), filename);
}

export function getUploadContentType(filename: string) {
  if (filename.endsWith(".jpg")) return "image/jpeg";
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}
