import { NextResponse } from "next/server";
import { Resend } from "resend";
import { findAgreementById, updateAgreement } from "../../../../../lib/agreementStore";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/offers/[id]/card-pdf
 * Receives the client-generated ID card PDF base64, saves it to the DB,
 * and sends it via email to both parties alongside the already-stored letter PDF.
 * Called AFTER /sign succeeds — split to avoid FUNCTION_PAYLOAD_TOO_LARGE on Vercel.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const rawCardPdf: string = body.cardPDFdata || "";
    const cardPDFdata = rawCardPdf.replace(
      /^data:application\/pdf(?:;[^;]*)?;base64,/,
      ""
    );

    if (!cardPDFdata) {
      return NextResponse.json({ error: "No card PDF data provided." }, { status: 400 });
    }

    const agreement = await findAgreementById(id);
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found." }, { status: 404 });
    }

    // Save card PDF to DB
    await updateAgreement(id, {
      cardPDFdata,
      idCardGenerated: true,
      idCardSent: true,
    });

    // Send email with card PDF to both parties (letter PDF already sent by /sign)
    if (process.env.RESEND_API_KEY) {
      const founderEmail = process.env.FOUNDER_EMAIL || agreement.firstParty.email;
      const partnerEmail = agreement.secondParty.email;
      const founderName  = agreement.firstParty.representedBy;
      const partnerName  = agreement.secondParty.fullName;

      console.log(`[card-pdf] Sending ID card emails — founder: ${founderEmail}, partner: ${partnerEmail}`);

      const attachment = { filename: `${id}-id-card.pdf`, content: cardPDFdata };

      const [founderResult, partnerResult] = await Promise.all([
        resend.emails.send({
          from: "JEVXO <info@jevxo.com>",
          to: [founderEmail],
          subject: `ID Card Ready — ${partnerName}`,
          text: `Dear ${founderName},\n\nThe employee ID card for ${partnerName} is attached.\n\nBest,\nJEVXO HR System`,
          attachments: [attachment],
        }),
        resend.emails.send({
          from: "JEVXO <info@jevxo.com>",
          to: [partnerEmail],
          subject: "Your JEVXO Employee ID Card",
          text: `Dear ${partnerName},\n\nYour JEVXO employee ID card is attached.\n\nBest,\nJEVXO`,
          attachments: [attachment],
        }),
      ]);

      if (founderResult.error) console.error("[card-pdf] Founder email failed:", founderResult.error);
      else console.log(`[card-pdf] Founder email sent: ${founderResult.data?.id}`);

      if (partnerResult.error) console.error("[card-pdf] Partner email failed:", partnerResult.error);
      else console.log(`[card-pdf] Partner email sent: ${partnerResult.data?.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[card-pdf] Error:", err);
    return NextResponse.json({ error: "Failed to process card PDF." }, { status: 500 });
  }
}
