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

      // Email the Sales Agent now that CSP has signed
      try {
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { getBaseUrl, getResendFromAddress } = require("../../../../../lib/emailConfig");
        
        const ctaLink = `${getBaseUrl()}/?candidateView=${id}`;
        const sender = getResendFromAddress();
        
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
              <div style="height: 3px; background: linear-gradient(to right, transparent, #10b981, transparent); margin-top: 12px; width: 100%;"></div>
            </div>
            <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${agreement.secondParty.fullName},</p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
              Your Country Sales Partner has signed and issued your <strong style="color: #10b981;">Sales Agent Agreement</strong>. 
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 8px;">To complete your onboarding:</p>
            <ol style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 20px 0; line-height: 1.8;">
              <li>Review the full agreement terms carefully.</li>
              <li>Upload your professional photo to the ID Card tab.</li>
              <li>Apply your digital signature to confirm acceptance.</li>
            </ol>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${ctaLink}" target="_blank" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px;">
                View & Sign Agreement
              </a>
            </div>
          </div>
        `;
        
        await resend.emails.send({
          from: sender,
          to: [agreement.secondParty.email],
          subject: "Sales Agent Agreement — JEVXO",
          html: emailHtml,
        });
      } catch (e) {
        console.error("Failed to email Sales Agent", e);
      }

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
