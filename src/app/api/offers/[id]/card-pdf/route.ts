import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  findAgreementById,
  updateAgreement,
} from "../../../../../lib/agreementStore";
import {
  getFounderNotificationRecipients,
  getResendFromAddress,
} from "../../../../../lib/emailConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/offers/[id]/card-pdf
 * Receives the client-generated ID card PDF (captured with the candidate's own
 * photo), saves it to the DB, then sends ONE combined email to both parties
 * containing the appointment letter + the correct ID card.
 *
 * This is the SOLE email dispatch point for the candidate-signing flow.
 * /sign intentionally skips email so that both parties receive a single,
 * complete email rather than two separate ones (the first of which would have
 * the pre-generated photo-less founder card).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const rawCardPdf: string = body.cardPDFdata || "";
    const cardPDFdata = rawCardPdf.replace(
      /^data:application\/pdf(?:;[^;]*)?;base64,/,
      "",
    );

    if (!cardPDFdata) {
      return NextResponse.json(
        { error: "No card PDF data provided." },
        { status: 400 },
      );
    }

    const agreement = await findAgreementById(id);
    if (!agreement) {
      return NextResponse.json(
        { error: "Agreement not found." },
        { status: 404 },
      );
    }

    const isInternship =
      (agreement.docSettings as Record<string, string> | undefined)
        ?.agreementTemplate === "internship";

    // Pull the appointment letter that /sign already saved to the DB
    const letterPDFdata =
      typeof agreement.letterPDFdata === "string"
        ? agreement.letterPDFdata.replace(
            /^data:application\/pdf(?:;[^;]*)?;base64,/,
            "",
          )
        : "";

    // Save the correct (candidate-photo) card PDF to DB
    await updateAgreement(id, {
      cardPDFdata,
      idCardGenerated: true,
    });

    let founderEmailSent = false;
    let partnerEmailSent = false;

    if (process.env.RESEND_API_KEY) {
      const founderRecipients = getFounderNotificationRecipients(
        process.env.FOUNDER_EMAIL,
        agreement.firstParty.email,
      );
      const partnerEmail = agreement.secondParty.email;
      const founderName = agreement.firstParty.representedBy;
      const partnerName = agreement.secondParty.fullName;
      const partnerID = agreement.secondParty.partnerId;

      console.log(
        `[card-pdf] Sending combined emails — founder: ${founderRecipients.join(", ")}, partner: ${partnerEmail}`,
      );

      // Build attachments — always include the card; add letter if available
      const attachments: { filename: string; content: string }[] = [
        { filename: `${id}-id-card.pdf`, content: cardPDFdata },
      ];
      if (letterPDFdata) {
        attachments.unshift({
          filename: isInternship ? `${id}-internship-offer.pdf` : `${id}-appointment.pdf`,
          content: letterPDFdata,
        });
      }

      // ── Per-template email copy ─────────────────────────────────────────────
      const founderSubject = isInternship
        ? `Internship Offer Signed — ${partnerName}`
        : "Appointment Letter Fully Executed";
      const founderText = isInternship
        ? `Dear ${founderName},\n\nThe internship offer letter and ID card for ${partnerName} (ID: ${partnerID}) have been fully executed. Please find the attached documents.\n\nBest,\nJEVXO HR System`
        : `Dear ${founderName},\n\nThe appointment letter for ${partnerName} (ID: ${partnerID}) has been fully executed. Please find the attached documents.\n\nBest,\nJEVXO HR System`;

      const partnerSubject = isInternship
        ? "Your JEVXO Internship Offer Letter & ID Card"
        : "Your Appointment Letter & ID Card from JEVXO";
      const partnerText = isInternship
        ? `Dear ${partnerName},\n\nWelcome aboard! Your signed internship offer letter and JEVXO ID card are attached.\n\nBest,\nJEVXO`
        : `Dear ${partnerName},\n\nYour appointment letter and ID card from JEVXO are attached.\n\nBest,\nJEVXO`;

      const [founderResult, partnerResult] = await Promise.all([
        resend.emails.send({
          from: getResendFromAddress(),
          to: founderRecipients,
          subject: founderSubject,
          text: founderText,
          attachments,
        }),
        resend.emails.send({
          from: getResendFromAddress(),
          to: [partnerEmail],
          subject: partnerSubject,
          text: partnerText,
          attachments,
        }),
      ]);

      if (founderResult.error)
        console.error("[card-pdf] Founder email failed:", founderResult.error);
      else {
        founderEmailSent = true;
        console.log(`[card-pdf] Founder email sent: ${founderResult.data?.id}`);
      }

      if (partnerResult.error)
        console.error("[card-pdf] Partner email failed:", partnerResult.error);
      else {
        partnerEmailSent = true;
        console.log(`[card-pdf] Partner email sent: ${partnerResult.data?.id}`);
      }
    }

    const sentToBoth = founderEmailSent && partnerEmailSent;
    await updateAgreement(id, {
      letterSentToBoth: sentToBoth,
    });

    return NextResponse.json({
      success: true,
      message: sentToBoth
        ? "The fully executed documents have been emailed to you and the Founder."
        : "Documents generated, but at least one email delivery failed.",
    });
  } catch (err: unknown) {
    console.error("[card-pdf] Error:", err);
    return NextResponse.json(
      { error: "Failed to process card PDF." },
      { status: 500 },
    );
  }
}
