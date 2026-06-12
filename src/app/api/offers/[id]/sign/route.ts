import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OFFERS_DIR = path.join(process.cwd(), "data", "offers");

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { signatureImg } = body;
    const filePath = path.join(OFFERS_DIR, `${id}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const offerData = JSON.parse(rawData);

    // Update candidate signature
    offerData.secondParty.signatureImg = signatureImg;
    offerData.updatedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(offerData, null, 2), "utf-8");
    console.log(`[Next.js API] Offer signed successfully by candidate: ${id}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Next.js API] Error signing offer:", err);
    return NextResponse.json({ error: "Failed to apply signature." }, { status: 500 });
  }
}
