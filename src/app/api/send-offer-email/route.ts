import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Resend } from "resend";

const OFFERS_DIR = path.join(process.cwd(), "data", "offers");

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offerId, candidateEmail, candidateName, fromAddress } = body;

    if (!offerId || !candidateEmail || !candidateName) {
      return NextResponse.json(
        { error: "offerId, candidateEmail, and candidateName are required." },
        { status: 400 }
      );
    }

    const filePath = path.join(OFFERS_DIR, `${offerId}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Offer details not found on server." }, { status: 404 });
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const offerData = JSON.parse(rawData);

    const firstParty = offerData.firstParty;
    const secondParty = offerData.secondParty;
    const docSettings = offerData.docSettings;

    // Build CTA Link
    const ctaLink = `${BASE_URL}/?candidateView=${offerId}`;

    // Sender details
    const sender = fromAddress || "JEVXO <info@jevxo.com>";

    // Build email template HTML
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
          <div style="height: 3px; background: linear-gradient(to right, transparent, #2563eb, transparent); margin-top: 12px; width: 100%;"></div>
        </div>
        
        <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          On behalf of <strong>${firstParty.companyName}</strong>, I am thrilled to extend to you our official offer of partnership for the position of <strong style="color: #2563eb;">${secondParty.position}</strong>.
        </p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          At JEVXO, we operate on a partnership-based structure where every team member is expected to lead with an ownership mindset. We are excited about the prospect of you joining us to collaborate on core achievements and drive the company forward.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px 20px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Offer Summary</h4>
          <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Vested Equity Share:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #2563eb;">${docSettings.equityShare}%</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Minimum Service Period:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${docSettings.minimumServicePeriod} Months</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Notice Period:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${docSettings.noticePeriod} Days</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 25px;">
          Please review the full letter of appointment terms, apply your digital signature, and download your counter-signed PDF contract. You can access your portal directly by clicking the button below:
        </p>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${ctaLink}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); transition: all 0.2s ease;">
            View & Sign Offer Letter
          </a>
        </div>

        <p style="font-size: 12px; line-height: 1.6; color: #64748b; margin-top: 25px; margin-bottom: 25px;">
          Should you have any questions, feel free to reply directly to this email or contact us at ${firstParty.mobileNumber}.
        </p>

        <div style="font-size: 13px; line-height: 1.6; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px;">
          Best Regards,<br />
          <strong style="color: #0f172a;">${firstParty.representedBy}</strong><br />
          ${firstParty.role}, ${firstParty.companyName}
        </div>
      </div>
    `;

    // Send email using Resend SDK
    const emailResult = await resend.emails.send({
      from: sender,
      to: [candidateEmail],
      subject: "JEVXO Offer Letter & Partnership Agreement",
      html: emailHtml,
    });

    if (emailResult.error) {
      console.error("[Next.js API] Resend sending error:", emailResult.error);
      return NextResponse.json({ error: emailResult.error.message }, { status: 400 });
    }

    console.log(`[Next.js API] Offer email dispatched via Resend: ${emailResult.data?.id}`);
    return NextResponse.json({ success: true, messageId: emailResult.data?.id });
  } catch (err: any) {
    console.error("[Next.js API] Error dispatching email:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
