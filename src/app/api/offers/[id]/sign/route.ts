import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  findAgreementById,
  updateAgreement,
} from "../../../../../lib/agreementStore";
import { generateIdCardPdf } from "../../../../../lib/idCardPdf";
import {
  getFounderNotificationRecipients,
  getResendFromAddress,
} from "../../../../../lib/emailConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
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
            "",
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
        return NextResponse.json(
          { error: "Failed to update agreement." },
          { status: 500 },
        );
      }

      console.log(`[Next.js API] Candidate signature updated: ${id}`);
      return NextResponse.json({ success: true, message: "Signature saved." });
    }

    // ── Finalizing: generate ID card PDF, update DB, send emails ─────────────
    console.log(`[Next.js API] Finalizing offer: ${id}`);

    // Prefer the exact client/workspace-generated PDF before using the simplified server fallback.
    const storedCardPdf =
      typeof agreement.cardPDFdata === "string"
        ? agreement.cardPDFdata.replace(
            /^data:application\/pdf(?:;[^;]*)?;base64,/,
            "",
          )
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
      status: "FULLY_EXECUTED",
      partnerSigned: true,
      signedAt: new Date().toISOString(),
      letterPDFdata: normalizedLetterPdf,
      letterSentToBoth: false,
      idCardGenerated: idCardPdfBase64.length > 0,
      cardPDFdata: idCardPdfBase64 || undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update agreement." },
        { status: 500 },
      );
    }

    console.log(`[Next.js API] Offer fully executed: ${id}`);

    // ── Email dispatch ────────────────────────────────────────────────────────
    // For internship offers there is no /card-pdf step, so we send the signed
    // letter email right here.  For partner/seller/agent offers, email is
    // deferred to /card-pdf so both letter + ID card arrive in one message.
    const docTemplate =
      (updated.docSettings as Record<string, string> | undefined)
        ?.agreementTemplate ?? "partner";

    if (docTemplate === "internship" && process.env.RESEND_API_KEY) {
      const founderRecipients = getFounderNotificationRecipients(
        process.env.FOUNDER_EMAIL,
        updated.firstParty.email,
      );
      const internEmail  = updated.secondParty.email;
      const founderName  = updated.firstParty.representedBy;
      const internName   = updated.secondParty.fullName;
      const attachments  = [{ filename: `${id}-internship-offer.pdf`, content: normalizedLetterPdf }];

      const [founderResult, internResult] = await Promise.all([
        resend.emails.send({
          from: getResendFromAddress(),
          to: founderRecipients,
          subject: `Internship Offer Signed — ${internName}`,
          text: `Dear ${founderName},\n\nThe internship offer letter for ${internName} has been signed and is attached.\n\nBest,\nJEVXO HR System`,
          attachments,
        }),
        resend.emails.send({
          from: getResendFromAddress(),
          to: [internEmail],
          subject: "Your JEVXO Internship Offer Letter",
          text: `Dear ${internName},\n\nYour signed internship offer letter from JEVXO is attached. Welcome aboard!\n\nBest,\nJEVXO`,
          attachments,
        }),
      ]);

      const sentToBoth = !founderResult.error && !internResult.error;
      await updateAgreement(id, { letterSentToBoth: sentToBoth, idCardSent: false });

      if (founderResult.error) console.error("[sign] Founder email failed:", founderResult.error);
      else console.log(`[sign] Founder email sent: ${founderResult.data?.id}`);
      if (internResult.error) console.error("[sign] Intern email failed:", internResult.error);
      else console.log(`[sign] Intern email sent: ${internResult.data?.id}`);
    }
    // For all other templates: no emails here — /card-pdf handles the combined dispatch.

    return NextResponse.json({
      success: true,
      message: "Signature applied successfully! Generating your ID card…",
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error signing offer:", err);
    return NextResponse.json(
      { error: "Failed to apply signature and finalize." },
      { status: 500 },
    );
  }
}
