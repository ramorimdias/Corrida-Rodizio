import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
]);

export async function GET() {
  const avatarsDir = path.join(process.cwd(), "public", "avatars");
  try {
    const entries = await fs.readdir(avatarsDir, { withFileTypes: true });
    const avatars = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) =>
        ALLOWED_EXTENSIONS.has(path.extname(name).toLowerCase())
      )
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ avatars });
  } catch {
    return NextResponse.json({ avatars: [] });
  }
}
