import { NextResponse } from "next/server";
import {
  generateAgreementIds,
  generateInternIds,
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
    const {
      firstParty,
      secondParty,
      docSettings,
      docType = "appointment",
      agreementTemplate,
      cardPDFdata,
    } = body;

    const resolvedTemplate = agreementTemplate || docSettings?.agreementTemplate || "partner";
    const isInternship = resolvedTemplate === "internship";

    let agreementId: string;
    let partnerId: string;
    let storage: string;

    if (isInternship) {
      // Use intern-prefixed IDs; prefer the ones already in docSettings (set by the form)
      const generated = await generateInternIds();
      agreementId = docSettings?.internRefId || generated.internRefId;
      partnerId   = docSettings?.internId    || generated.internId;
      storage     = generated.storage;
    } else {
      const generated = await generateAgreementIds();
      agreementId = generated.agreementId;
      partnerId   = generated.partnerId;
      storage     = generated.storage;
    }

    // ── Derive a descriptive docType label for MongoDB ────────────────────────
    let resolvedDocType: string = docType;
    if (docType === "both") {
      resolvedDocType = isInternship
        ? "Intern Offerletter & ID Card"
        : "Partner Agreement & ID Card";
    }

    const updatedSecondParty = { ...secondParty, partnerId };
    const updatedDocSettings = {
      ...docSettings,
      agreementTemplate: resolvedTemplate,
      ...(isInternship
        ? { internRefId: agreementId, internId: partnerId }
        : { refId: agreementId }),
    };

    await saveAgreement({
      agreementId,
      partnerId,
      docType: resolvedDocType,
      status: "PENDING_PARTNER_SIGNATURE",
      founderSigned: true,
      partnerSigned: false,
      firstParty,
      secondParty: updatedSecondParty,
      docSettings: updatedDocSettings,
      ...(cardPDFdata ? { cardPDFdata, idCardGenerated: true } : {}),
    });

    console.log(`[Next.js API] Agreement saved (${storage}): ${agreementId}`);
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
