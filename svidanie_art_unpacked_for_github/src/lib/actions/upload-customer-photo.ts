"use server";

import { saveUploadedFile } from "@/lib/upload";

export async function uploadCustomerPhoto(formData: FormData) {
  const file = formData.get("photo");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "No photo provided." };
  }
  return saveUploadedFile(file, "customers");
}
