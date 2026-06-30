import { NextResponse } from "next/server";
import { Resend } from "resend";
import { findAgreementById, updateAgreement } from "../../../../../lib/agreementStore";
import { generateIdCardPdf } from "../../../../../lib/idCardPdf";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { signatureImg, letterPDFdata: rawLetterPdf, cardPDFdata: rawCardPdf } = body;

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

    // Use client-generated pixel-perfect PDF if available; fall back to server-side generator
    let idCardPdfBase64 = clientCardPdf;
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
      console.log(`[Next.js API] Using client-generated ID card PDF for: ${id}`);
    }

    const updated = await updateAgreement(id, {
      secondParty: updatedSecondParty,
      status:           "FULLY_EXECUTED",
      partnerSigned:    true,
      signedAt:         new Date().toISOString(),
      letterPDFdata:    normalizedLetterPdf,
      letterSentToBoth: true,
      idCardGenerated:  idCardPdfBase64.length > 0,
      idCardSent:       idCardPdfBase64.length > 0,
      cardPDFdata:      idCardPdfBase64 || undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Failed to update agreement." }, { status: 500 });
    }

    console.log(`[Next.js API] Offer fully executed: ${id}`);

    if (process.env.RESEND_API_KEY) {
      const founderEmail = process.env.FOUNDER_EMAIL || updated.firstParty.email;
      const partnerEmail = updated.secondParty.email;
      const founderName  = updated.firstParty.representedBy;
      const partnerName  = updated.secondParty.fullName;

      const attachments: { filename: string; content: string }[] = [
        { filename: `${id}-appointment.pdf`, content: normalizedLetterPdf },
      ];
      if (idCardPdfBase64) {
        attachments.push({ filename: `${id}-id-card.pdf`, content: idCardPdfBase64 });
      }

      await Promise.all([
        resend.emails.send({
          from: "JEVXO <info@jevxo.com>",
          to: [founderEmail],
          subject: "Appointment Letter Fully Executed",
          text: `Dear ${founderName},\n\nThe appointment letter for ${partnerName} has been fully executed. Please find the attached documents.\n\nBest,\nJEVXO HR System`,
          attachments,
        }),
        resend.emails.send({
          from: "JEVXO <info@jevxo.com>",
          to: [partnerEmail],
          subject: "Your Appointment Letter & ID Card from JEVXO",
          text: `Dear ${partnerName},\n\nYour appointment letter and employee ID card from JEVXO are attached.\n\nBest,\nJEVXO`,
          attachments,
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      message:
        "Signature applied successfully! The fully executed documents have been emailed to you and the Founder.",
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error signing offer:", err);
    return NextResponse.json(
      { error: "Failed to apply signature and finalize." },
      { status: 500 }
    );
  }
}
