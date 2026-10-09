import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { z } from "zod";

const COOKIE_NAME = "svidanie_admin_session";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message = "Request failed.", status = 400) {
  return json({ error: message }, status);
}

export async function requireApiAdmin(request: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (!secret || !token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  const body = await request.json().catch(() => null);
  return schema.safeParse(body);
}
