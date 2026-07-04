import { NextResponse } from "next/server";
import { findAgreementByVerifyId } from "../../../../lib/verify";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agreement = await findAgreementByVerifyId(id);

    if (!agreement) {
      return NextResponse.json(
        {
          valid: false,
          status: "NOT_FOUND",
          message: "No matching document was found in the JEVXO registry.",
        },
        { status: 404 }
      );
    }

    const isExecuted = agreement.status === "FULLY_EXECUTED";

    return NextResponse.json({
      valid: isExecuted,
      status: agreement.status,
      agreementId: agreement.agreementId,
      partnerId: agreement.partnerId,
      docType: agreement.docType || "appointment",
      agreementTemplate:
        agreement.docSettings?.agreementTemplate || "partner",
      companyName: agreement.firstParty?.companyName || "",
      partnerName: agreement.secondParty?.fullName || "",
      position: agreement.secondParty?.position || "",
      signedAt: agreement.signedAt?.toISOString?.() || null,
      createdAt: agreement.createdAt?.toISOString?.() || null,
      founderSigned: agreement.founderSigned,
      partnerSigned: agreement.partnerSigned,
      message: isExecuted
        ? "This document is authentic and fully executed."
        : "This document exists but is not yet fully executed.",
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Verification error:", err);
    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Verification service unavailable." },
      { status: 500 }
    );
  }
}
