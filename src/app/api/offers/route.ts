import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OFFERS_DIR = path.join(process.cwd(), "data", "offers");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offerId, firstParty, secondParty, docSettings } = body;

    if (!offerId) {
      return NextResponse.json({ error: "offerId is required." }, { status: 400 });
    }

    // Ensure data directory exists
    if (!fs.existsSync(OFFERS_DIR)) {
      fs.mkdirSync(OFFERS_DIR, { recursive: true });
    }

    const filePath = path.join(OFFERS_DIR, `${offerId}.json`);
    const offerData = {
      firstParty,
      secondParty,
      docSettings,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(offerData, null, 2), "utf-8");
    console.log(`[Next.js API] Offer saved successfully: ${offerId}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Next.js API] Error saving offer:", err);
    return NextResponse.json({ error: "Failed to save offer." }, { status: 500 });
  }
}
