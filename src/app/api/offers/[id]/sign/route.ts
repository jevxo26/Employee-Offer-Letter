import { NextResponse } from "next/server";
import { Resend } from "resend";
import dbConnect from "../../../../../lib/mongodb";
import Agreement from "../../../../../models/Agreement";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { signatureImg, pdfData } = body;
    
    await dbConnect();
    const agreement = await Agreement.findOne({ agreementId: id });

    if (!agreement) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    // Update candidate signature and status
    agreement.secondParty.signatureImg = signatureImg;
    // Notify mongoose of mixed type change
    agreement.markModified('secondParty');
    
    agreement.status = "FULLY_EXECUTED";
    agreement.partnerSigned = true;
    agreement.signedAt = new Date();
    
    if (pdfData) {
      agreement.pdfData = pdfData;
    }

    await agreement.save();
    console.log(`[Next.js API] Offer fully executed: ${id}`);

    // Send emails with PDF attachment
    if (pdfData) {
      const founderEmail = process.env.FOUNDER_EMAIL || agreement.firstParty.email;
      const partnerEmail = agreement.secondParty.email;
      const founderName = agreement.firstParty.representedBy;
      const partnerName = agreement.secondParty.fullName;
      
      // We expect pdfData to be a base64 string starting with "data:application/pdf;base64,..."
      const base64Content = pdfData.replace(/^data:application\/pdf;base64,/, "");

      // 1. Email to Founder
      await resend.emails.send({
        from: "JEVXO <info@jevxo.com>",
        to: [founderEmail],
        subject: "Appointment Letter Fully Executed",
        text: `Dear ${founderName},\n\nThe appointment letter for ${partnerName} has been fully executed. Please find the attached PDF.\n\nBest,\nJEVXO HR System`,
        attachments: [
          {
            filename: `${id}.pdf`,
            content: base64Content,
          },
        ],
      });

      // 2. Email to Partner
      await resend.emails.send({
        from: "JEVXO <info@jevxo.com>",
        to: [partnerEmail],
        subject: "Your Appointment Letter from JEVXO",
        text: `Dear ${partnerName},\n\nYour appointment letter from JEVXO has been fully executed. Please find your copy attached.\n\nBest,\nJEVXO`,
        attachments: [
          {
            filename: `${id}.pdf`,
            content: base64Content,
          },
        ],
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Next.js API] Error signing offer:", err);
    return NextResponse.json({ error: "Failed to apply signature and finalize." }, { status: 500 });
  }
}
