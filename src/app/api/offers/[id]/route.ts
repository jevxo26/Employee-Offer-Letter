import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OFFERS_DIR = path.join(process.cwd(), "data", "offers");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filePath = path.join(OFFERS_DIR, `${id}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Next.js API] Error retrieving offer:", err);
    return NextResponse.json({ error: "Failed to retrieve offer." }, { status: 500 });
  }
}
