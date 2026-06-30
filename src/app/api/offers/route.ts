import { NextResponse } from "next/server";
import {
  generateAgreementIds,
  listAgreements,
  saveAgreement,
  toAgreementSummary,
} from "../../../lib/agreementStore";

export async function GET() {
  try {
    const agreements = await listAgreements();
    return NextResponse.json({
      success: true,
      agreements: agreements.map(toAgreementSummary),
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error listing agreements:", err);
    return NextResponse.json({ error: "Failed to list agreements." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstParty, secondParty, docSettings, docType = "appointment", cardPDFdata } = body;

    const { agreementId, partnerId, storage } = await generateAgreementIds();

    const updatedSecondParty = { ...secondParty, partnerId };
    const updatedDocSettings = { ...docSettings, refId: agreementId };

    await saveAgreement({
      agreementId,
      partnerId,
      docType,
      status: "PENDING_PARTNER_SIGNATURE",
      founderSigned: true,
      partnerSigned: false,
      firstParty,
      secondParty: updatedSecondParty,
      docSettings: updatedDocSettings,
      // Store pre-generated pixel-perfect ID card PDF from client if provided
      ...(cardPDFdata ? { cardPDFdata, idCardGenerated: true } : {}),
    });

    console.log(
      `[Next.js API] Agreement saved (${storage}): ${agreementId}`
    );
    return NextResponse.json({ success: true, agreementId, partnerId, storage });
  } catch (err: unknown) {
    console.error("[Next.js API] Error saving agreement:", err);
    return NextResponse.json(
      {
        error: "Failed to save agreement.",
        details: process.env.NODE_ENV === "development" ? (err as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
