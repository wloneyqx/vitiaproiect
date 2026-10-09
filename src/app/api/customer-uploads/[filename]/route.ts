import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getCustomerUploadPath, getUploadContentType } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const filePath = getCustomerUploadPath(filename);
  if (!filePath) return new NextResponse("Not found", { status: 404 });

  try {
    const file = await readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": getUploadContentType(filename),
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
