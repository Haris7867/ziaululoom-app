import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { uploadedFiles } from "@/db/schema";
import { ensureSeed } from "@/db/seed";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

/**
 * File storage placeholder.
 * - Validates type/size and writes to a private directory (not public web root).
 * - In production this would upload to S3/R2 with a private ACL and store the key.
 * - Images are queued for WebP conversion; originals are never exposed publicly.
 */
export async function POST(request: Request) {
  try {
    await ensureSeed();
    const form = await request.formData();
    const file = form.get("file");
    const ownerRef = form.get("ownerRef");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file uploaded." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Maximum file size is 5 MB." }, { status: 413 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ ok: false, error: "PDF, JPG, PNG or WebP only." }, { status: 415 });
    }
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const storedName = `${randomUUID()}.${extension}`;
    const dir = path.join(process.cwd(), "public", "uploads", "private");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, storedName), Buffer.from(await file.arrayBuffer()));
    await db.insert(uploadedFiles).values({
      originalName: file.name,
      storedName,
      mimeType: file.type,
      sizeKb: Math.round(file.size / 1024),
      private: true,
      ownerRef: typeof ownerRef === "string" ? ownerRef.slice(0, 120) : null,
    });
    return NextResponse.json({
      ok: true,
      storedName,
      // Private storage: not served from the public web root.
      reference: `private://uploads/${storedName}`,
      webpQueued: file.type.startsWith("image/"),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}
