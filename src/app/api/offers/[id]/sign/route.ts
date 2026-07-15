import { NextResponse } from "next/server";
import {
  findAgreementById,
  updateAgreement,
} from "../../../../../lib/agreementStore";
import { generateIdCardPdf } from "../../../../../lib/idCardPdf";

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

    
    const isPendingCSP = agreement.status === "PENDING_CSP_SIGNATURE";
    const salesType = (agreement.docSettings as Record<string, unknown>)?.salesAgreementType as string | undefined;
    const isSalesAgent = salesType === "salesAgent";

    if (isPendingCSP && isSalesAgent) {
      const updatedDocSettings = {
        ...agreement.docSettings,
        salesPartner: {
          ...(agreement.docSettings as any).salesPartner,
          signatureImg: signatureImg,
        }
      };

      if (!isFinalizing) {
        await updateAgreement(id, { docSettings: updatedDocSettings });
        return NextResponse.json({ success: true, message: "CSP Signature saved." });
      }

      await updateAgreement(id, {
        docSettings: updatedDocSettings,
        status: "PENDING_PARTNER_SIGNATURE",
        letterPDFdata: normalizedLetterPdf,
      });

      return NextResponse.json({
        success: true,
        message: "Agreement forwarded to Sales Agent successfully.",
        isPendingCSP: true // Tell frontend it was CSP
      });
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

    // ── Email dispatch deferred to /card-pdf for ALL templates ───────────────
    // /card-pdf receives the candidate-photo ID card PDF and sends ONE combined
    // email (letter + card) to both parties.  We never send email here so that
    // internship and partner flows behave identically and both attachments always
    // arrive in a single message.

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
