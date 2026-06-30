import { NextResponse } from "next/server";
import { Resend } from "resend";
import { findAgreementById, updateAgreement } from "../../../../../lib/agreementStore";
import { generateIdCardPdf } from "../../../../../lib/idCardPdf";
import {
  getFounderNotificationRecipients,
  getResendFromAddress,
} from "../../../../../lib/emailConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      signatureImg,
      letterPDFdata: rawLetterPdf,
      cardPDFdata: rawCardPdf,
      photoUrl,
    } = body;

    const normalizedLetterPdf =
      typeof rawLetterPdf === "string"
        ? rawLetterPdf.replace(
            /^data:application\/pdf(?:;filename=[^;]+)?;base64,/,
            ""
          )
        : "";

    // Client-generated pixel-perfect card PDF (strip data URI prefix if present)
    const clientCardPdf =
      typeof rawCardPdf === "string"
        ? rawCardPdf.replace(/^data:application\/pdf(?:;[^;]*)?;base64,/, "")
        : "";
    const isFinalizing = normalizedLetterPdf.length > 0;

    const agreement = await findAgreementById(id);
    if (!agreement) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const updatedSecondParty = {
      ...agreement.secondParty,
      signatureImg,
      ...(typeof photoUrl === "string" ? { photoUrl } : {}),
    };

    // ── Signature-only save (not finalizing yet) ──────────────────────────────
    if (!isFinalizing) {
      const updated = await updateAgreement(id, {
        secondParty: updatedSecondParty,
      });

      if (!updated) {
        return NextResponse.json({ error: "Failed to update agreement." }, { status: 500 });
      }

      console.log(`[Next.js API] Candidate signature updated: ${id}`);
      return NextResponse.json({ success: true, message: "Signature saved." });
    }

    // ── Finalizing: generate ID card PDF, update DB, send emails ─────────────
    console.log(`[Next.js API] Finalizing offer: ${id}`);

    // Prefer the exact client/workspace-generated PDF before using the simplified server fallback.
    const storedCardPdf =
      typeof agreement.cardPDFdata === "string"
        ? agreement.cardPDFdata.replace(/^data:application\/pdf(?:;[^;]*)?;base64,/, "")
        : "";

    let idCardPdfBase64 = clientCardPdf || storedCardPdf;
    if (!idCardPdfBase64) {
      try {
        idCardPdfBase64 = await generateIdCardPdf({
          ...agreement,
          secondParty: updatedSecondParty,
        });
      } catch (pdfErr) {
        console.error("[Next.js API] ID card PDF generation failed:", pdfErr);
      }
    } else {
      console.log(`[Next.js API] Using pre-generated ID card PDF for: ${id}`);
    }

    const updated = await updateAgreement(id, {
      secondParty: updatedSecondParty,
      status:           "FULLY_EXECUTED",
      partnerSigned:    true,
      signedAt:         new Date().toISOString(),
      letterPDFdata:    normalizedLetterPdf,
      letterSentToBoth: false,
      idCardGenerated:  idCardPdfBase64.length > 0,
      idCardSent:       false,
      cardPDFdata:      idCardPdfBase64 || undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Failed to update agreement." }, { status: 500 });
    }

    console.log(`[Next.js API] Offer fully executed: ${id}`);

    let founderEmailSent = false;
    let partnerEmailSent = false;

    if (process.env.RESEND_API_KEY) {
      const founderRecipients = getFounderNotificationRecipients(
        process.env.FOUNDER_EMAIL,
        updated.firstParty.email,
      );
      const partnerEmail = updated.secondParty.email;
      const founderName  = updated.firstParty.representedBy;
      const partnerName  = updated.secondParty.fullName;

      console.log(
        `[Next.js API] Sending emails — founder: ${founderRecipients.join(", ")}, partner: ${partnerEmail}`
      );

      const attachments: { filename: string; content: string }[] = [
        { filename: `${id}-appointment.pdf`, content: normalizedLetterPdf },
      ];
      if (idCardPdfBase64) {
        attachments.push({ filename: `${id}-id-card.pdf`, content: idCardPdfBase64 });
      }

      const [founderResult, partnerResult] = await Promise.all([
        resend.emails.send({
          from: getResendFromAddress(),
          to: founderRecipients,
          subject: "Appointment Letter Fully Executed",
          text: `Dear ${founderName},\n\nThe appointment letter for ${partnerName} has been fully executed. Please find the attached documents.\n\nBest,\nJEVXO HR System`,
          attachments,
        }),
        resend.emails.send({
          from: getResendFromAddress(),
          to: [partnerEmail],
          subject: "Your Appointment Letter & ID Card from JEVXO",
          text: `Dear ${partnerName},\n\nYour appointment letter and employee ID card from JEVXO are attached.\n\nBest,\nJEVXO`,
          attachments,
        }),
      ]);

      if (founderResult.error) {
        console.error("[Next.js API] Founder email failed:", founderResult.error);
      } else {
        founderEmailSent = true;
        console.log(`[Next.js API] Founder email sent: ${founderResult.data?.id}`);
      }
      if (partnerResult.error) {
        console.error("[Next.js API] Partner email failed:", partnerResult.error);
      } else {
        partnerEmailSent = true;
        console.log(`[Next.js API] Partner email sent: ${partnerResult.data?.id}`);
      }
    }

    const lettersSentToBoth = founderEmailSent && partnerEmailSent;
    const idCardSentToBoth = lettersSentToBoth && idCardPdfBase64.length > 0;

    await updateAgreement(id, {
      letterSentToBoth: lettersSentToBoth,
      idCardSent: idCardSentToBoth,
    });

    return NextResponse.json({
      success: true,
      message: lettersSentToBoth
        ? "Signature applied successfully! The fully executed documents have been emailed to you and the Founder."
        : "Signature applied successfully! The fully executed documents were generated, but at least one email delivery failed.",
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error signing offer:", err);
    return NextResponse.json(
      { error: "Failed to apply signature and finalize." },
      { status: 500 }
    );
  }
}
