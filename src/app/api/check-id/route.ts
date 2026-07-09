import { NextResponse } from "next/server";
import {
  generateAgreementIds,
  generateInternIds,
  generateCountrySalesPartnerIds,
  generateSalesAgentIds,
  listAgreements,
} from "../../../lib/agreementStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "next") {
      const { agreementId, partnerId, storage } = await generateAgreementIds();
      return NextResponse.json({ agreementId, partnerId, storage });
    }

    if (action === "nextIntern") {
      const { internId, internRefId, storage } = await generateInternIds();
      return NextResponse.json({ internId, internRefId, storage });
    }

    if (action === "nextCountrySales") {
      const { salesRefId, salesPartnerId, storage } = await generateCountrySalesPartnerIds();
      return NextResponse.json({ salesRefId, salesPartnerId, storage });
    }

    if (action === "nextSalesAgent") {
      const { salesRefId, salesPartnerId, storage } = await generateSalesAgentIds();
      return NextResponse.json({ salesRefId, salesPartnerId, storage });
    }

    if (action === "check") {
      const agreementId = searchParams.get("agreementId");
      const partnerId = searchParams.get("partnerId");
      const agreements = await listAgreements();

      const agreementTaken = agreementId
        ? agreements.some((agreement) => agreement.agreementId === agreementId)
        : false;
      const partnerTaken = partnerId
        ? agreements.some((agreement) => agreement.partnerId === partnerId)
        : false;

      return NextResponse.json({
        agreementTaken,
        partnerTaken,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    console.error("[check-id API] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
