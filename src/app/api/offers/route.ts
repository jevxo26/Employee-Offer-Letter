import { NextResponse } from "next/server";
import {
  generateAgreementIds,
  generateInternIds,
  generateCountrySalesPartnerIds,
  generateSalesAgentIds,
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
      salesAgreementType,
    } = body;

    const resolvedTemplate = agreementTemplate || docSettings?.agreementTemplate || "partner";
    const isInternship = resolvedTemplate === "internship";
    const salesType: string | undefined = salesAgreementType || docSettings?.salesAgreementType;
    const isCountrySales = salesType === "countrySales";
    const isSalesAgent   = salesType === "salesAgent";
    const isSalesAgreement = isCountrySales || isSalesAgent;

    let agreementId: string;
    let partnerId: string;
    let storage: string;

    if (isInternship) {
      // Use intern-prefixed IDs; prefer the ones already in docSettings (set by the form)
      const generated = await generateInternIds();
      agreementId = docSettings?.internRefId || generated.internRefId;
      partnerId   = docSettings?.internId    || generated.internId;
      storage     = generated.storage;
    } else if (isCountrySales) {
      const generated = await generateCountrySalesPartnerIds();
      agreementId = docSettings?.salesRefId     || generated.salesRefId;
      partnerId   = docSettings?.salesPartnerId || generated.salesPartnerId;
      storage     = generated.storage;
    } else if (isSalesAgent) {
      const generated = await generateSalesAgentIds();
      agreementId = docSettings?.salesRefId     || generated.salesRefId;
      partnerId   = docSettings?.salesPartnerId || generated.salesPartnerId;
      storage     = generated.storage;
    } else {
      const generated = await generateAgreementIds();
      agreementId = docSettings?.refId || generated.agreementId;
      partnerId   = secondParty?.partnerId || generated.partnerId;
      storage     = generated.storage;
    }

    // ── Derive a descriptive docType label for MongoDB ────────────────────────
    let resolvedDocType: string = docType;
    if (docType === "both" || isSalesAgreement) {
      if (isInternship) {
        resolvedDocType = "Intern Offerletter & ID Card";
      } else if (isCountrySales) {
        resolvedDocType = "Country Sales Partner Agreement & ID Card";
      } else if (isSalesAgent) {
        resolvedDocType = "Sales Agent Agreement & ID Card";
      } else {
        resolvedDocType = "Partner Agreement & ID Card";
      }
    }

    // ── Build updated secondParty — use salesPartnerId for sales types ────────
    const updatedSecondParty = isSalesAgreement
      ? { ...secondParty, salesPartnerId: partnerId }
      : { ...secondParty, partnerId };

    const updatedDocSettings = {
      ...docSettings,
      agreementTemplate: resolvedTemplate,
      ...(isInternship
        ? { internRefId: agreementId, internId: partnerId }
        : isSalesAgreement
        ? { salesRefId: agreementId, salesPartnerId: partnerId, salesAgreementType: salesType }
        : { refId: agreementId }),
    };

    await saveAgreement({
      agreementId,
      partnerId,
      docType: resolvedDocType,
      ...(isSalesAgreement ? { salesAgreementType: salesType } : {}),
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
