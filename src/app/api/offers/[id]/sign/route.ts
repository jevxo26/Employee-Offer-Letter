import { NextResponse } from "next/server";
import { Resend } from "resend";
import { findAgreementById, updateAgreement } from "../../../../../lib/agreementStore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { signatureImg, pdfData } = body;
    const normalizedPdfData =
      typeof pdfData === "string"
        ? pdfData.replace(
            /^data:application\/pdf(?:;filename=[^;]+)?;base64,/,
            ""
          )
        : "";
    const isFinalizing = normalizedPdfData.length > 0;

    const agreement = await findAgreementById(id);
    if (!agreement) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const updatedSecondParty = {
      ...agreement.secondParty,
      signatureImg,
    };

    const updated = await updateAgreement(id, {
      secondParty: updatedSecondParty,
      ...(isFinalizing
        ? {
            status: "FULLY_EXECUTED",
            partnerSigned: true,
            signedAt: new Date().toISOString(),
            pdfData: normalizedPdfData,
          }
        : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: "Failed to update agreement." }, { status: 500 });
    }

    if (!isFinalizing) {
      console.log(`[Next.js API] Candidate signature updated: ${id}`);
      return NextResponse.json({ success: true, message: "Signature saved." });
    }

    console.log(`[Next.js API] Offer fully executed: ${id}`);

    if (process.env.RESEND_API_KEY) {
      const founderEmail = process.env.FOUNDER_EMAIL || updated.firstParty.email;
      const partnerEmail = updated.secondParty.email;
      const founderName = updated.firstParty.representedBy;
      const partnerName = updated.secondParty.fullName;

      await resend.emails.send({
        from: "JEVXO <info@jevxo.com>",
        to: [founderEmail],
        subject: "Appointment Letter Fully Executed",
        text: `Dear ${founderName},\n\nThe appointment letter for ${partnerName} has been fully executed. Please find the attached PDF.\n\nBest,\nJEVXO HR System`,
        attachments: [{ filename: `${id}.pdf`, content: normalizedPdfData }],
      });

      await resend.emails.send({
        from: "JEVXO <info@jevxo.com>",
        to: [partnerEmail],
        subject: "Your Appointment Letter from JEVXO",
        text: `Dear ${partnerName},\n\nYour appointment letter from JEVXO has been fully executed. Please find your copy attached.\n\nBest,\nJEVXO`,
        attachments: [{ filename: `${id}.pdf`, content: normalizedPdfData }],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Signature applied successfully! The fully executed PDF has been emailed to you and the Founder.",
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error signing offer:", err);
    return NextResponse.json(
      { error: "Failed to apply signature and finalize." },
      { status: 500 }
    );
  }
}
