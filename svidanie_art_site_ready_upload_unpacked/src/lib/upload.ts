import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
};

export type SaveUploadResult = { ok: true; url: string } | { ok: false; error: string };

export async function saveUploadedFile(
  file: File,
  subdir: "customers" | "products",
  maxBytes = 8 * 1024 * 1024
): Promise<SaveUploadResult> {
  if (!file || file.size === 0) return { ok: false, error: "No file provided." };
  if (file.size > maxBytes) {
    return { ok: false, error: `File is too large (max ${Math.round(maxBytes / 1024 / 1024)}MB).` };
  }
  const ext = ALLOWED_MIME_TO_EXT[file.type];
  if (!ext) return { ok: false, error: "Unsupported image type. Use JPG, PNG, WEBP, or GIF." };

  const dir = path.join(process.cwd(), "public", "uploads", subdir);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return { ok: true, url: `/uploads/${subdir}/${filename}` };
}
