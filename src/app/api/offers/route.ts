import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Agreement from "../../../models/Agreement";
import { generateIds } from "../../../lib/idGenerator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstParty, secondParty, docSettings } = body;

    await dbConnect();

    const { agreementId, partnerId } = await generateIds();

    // The document might already have an offerId from the frontend, but we override it with the real DB generated ID
    const updatedSecondParty = { ...secondParty, partnerId };
    const updatedDocSettings = { ...docSettings, refId: agreementId };

    const newAgreement = new Agreement({
      agreementId,
      partnerId,
      status: "PENDING_PARTNER_SIGNATURE",
      founderSigned: true,
      partnerSigned: false,
      firstParty,
      secondParty: updatedSecondParty,
      docSettings: updatedDocSettings,
    });

    await newAgreement.save();

    console.log(`[Next.js API] Agreement saved successfully: ${agreementId}`);
    return NextResponse.json({ success: true, agreementId, partnerId });
  } catch (err: any) {
    console.error("[Next.js API] Error saving agreement:", err);
    return NextResponse.json({ error: "Failed to save agreement." }, { status: 500 });
  }
}
