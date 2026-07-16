import { NextResponse } from "next/server";
import { Resend } from "resend";
import { findAgreementById } from "../../../lib/agreementStore";
import { getBaseUrl, getResendFromAddress } from "../../../lib/emailConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { offerId, candidateEmail, candidateName, agreementTemplate } = body;

    if (!offerId || !candidateEmail || !candidateName) {
      return NextResponse.json(
        { error: "offerId, candidateEmail, and candidateName are required." },
        { status: 400 }
      );
    }

    const agreement = await findAgreementById(offerId);
    if (!agreement) {
      return NextResponse.json({ error: "Offer details not found on server." }, { status: 404 });
    }

    const { firstParty, secondParty, docSettings } = agreement;
    const isInternship =
      agreementTemplate === "internship" ||
      (agreement.docSettings as Record<string, unknown>)?.agreementTemplate === "internship";

    const salesType = (agreement.docSettings as Record<string, unknown>)?.salesAgreementType as string | undefined;
    const isCountrySales = salesType === "countrySales";
    const isSalesAgent   = salesType === "salesAgent";
    
    const isSalesAgreement = isCountrySales || isSalesAgent;

    // --- OVERRIDE FOR SALES AGENT (CSP SIGNS FIRST) ---
    const isPendingCSP = agreement.status === "PENDING_CSP_SIGNATURE";
    if (isSalesAgent && isPendingCSP && docSettings?.salesPartner) {
      candidateEmail = docSettings.salesPartner.email;
      candidateName = docSettings.salesPartner.fullName;
    }


    const ctaLink = `${getBaseUrl()}/?candidateView=${offerId}`;
    const sender = getResendFromAddress();

    const subject = isInternship
      ? "Internship Offer Letter — JEVXO"
      : isCountrySales
      ? "Country Sales Partner Agreement — JEVXO"
      : isSalesAgent
      ? "Sales Agent Agreement — JEVXO"
      : "JEVXO Offer Letter & Partnership Agreement";

    const emailHtml = isInternship
      ? /* ── Internship email ─────────────────────────────────────────── */ `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
          <div style="height: 3px; background: linear-gradient(to right, transparent, #2563eb, transparent); margin-top: 12px; width: 100%;"></div>
        </div>

        <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          On behalf of <strong>${firstParty.companyName}</strong>, we are pleased to extend to you our official <strong>Internship Offer</strong> for the position of <strong style="color: #2563eb;">${secondParty.position}</strong>.
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          This internship is a hands-on opportunity to grow your skills in a fast-moving tech environment. You will collaborate with our core team on real projects that shape our platform.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px 20px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Offer Summary</h4>
          <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Duration:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #2563eb;">${docSettings.internshipDuration || "—"} Months</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Compensation:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${docSettings.isPaid ? "Paid" : "Unpaid"}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Internee ID:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${secondParty.partnerId || "—"}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 8px;">To complete your onboarding:</p>
        <ol style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 20px 0; line-height: 1.8;">
          <li>Review the internship offer letter terms.</li>
          ${isSalesAgent && isPendingCSP ? "" : "<li>Upload your professional photo to the ID Card tab.</li>"}
          <li>Apply your digital signature.</li>
          <li>Press <strong>Confirm</strong> once everything looks correct.</li>
        </ol>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${ctaLink}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);">
            View & Sign Internship Offer
          </a>
        </div>

        <p style="font-size: 12px; line-height: 1.6; color: #64748b; margin-top: 25px;">
          Should you have any questions, feel free to reply to this email or contact us at ${firstParty.mobileNumber}.
        </p>

        <div style="font-size: 13px; line-height: 1.6; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px;">
          Best Regards,<br />
          <strong style="color: #0f172a;">${firstParty.representedBy}</strong><br />
          ${firstParty.role}, ${firstParty.companyName}
        </div>
      </div>
    `
      : isSalesAgreement
      ? /* ── Sales Agreement email (Country Sales Partner / Sales Agent) ── */ `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
          <div style="height: 3px; background: linear-gradient(to right, transparent, #10b981, transparent); margin-top: 12px; width: 100%;"></div>
        </div>

        <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          ${isCountrySales
            ? `On behalf of <strong>${firstParty.companyName}</strong>, we are pleased to formally appoint you as a <strong style="color: #10b981;">Country Sales Partner</strong> for the Territory of <strong>${docSettings.territory || "your region"}</strong>.`
            : `Your Country Sales Partner has issued this <strong style="color: #10b981;">Sales Agent Agreement</strong> for the Territory of <strong>${docSettings.territory || "your region"}</strong>. <strong>${firstParty.companyName}</strong> acknowledges and approves the appointment; the contractual relationship is with the Country Sales Partner.`}
        </p>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px 20px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #065f46; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Agreement Summary</h4>
          <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Agreement Ref:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #065f46;">${docSettings.salesRefId || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">${isCountrySales ? "Partner" : "Agent"} ID:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${docSettings.salesPartnerId || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Territory:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${docSettings.territory || "—"}</td>
            </tr>
            ${isCountrySales ? `
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Base Commission:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">10% per sale</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Recurring Commission:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">12% monthly</td>
            </tr>` : `
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Sales Commission:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">10% per sale</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Recurring Commission:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">10% monthly</td>
            </tr>`}
          </table>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 8px;">To complete your onboarding:</p>
        <ol style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 20px 0; line-height: 1.8;">
          <li>Review the full agreement terms carefully.</li>
          <li>Upload your professional photo to the ID Card tab.</li>
          <li>Apply your digital signature to confirm acceptance.</li>
          <li>Press <strong>Confirm</strong> once everything looks correct.</li>
        </ol>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${ctaLink}" target="_blank" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">
            View & Sign Agreement
          </a>
        </div>

        <p style="font-size: 12px; line-height: 1.6; color: #64748b; margin-top: 25px;">
          Should you have any questions, feel free to reply to this email or contact us at ${firstParty.mobileNumber}.
        </p>

        <div style="font-size: 13px; line-height: 1.6; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px;">
          Best Regards,<br />
          <strong style="color: #0f172a;">${firstParty.representedBy}</strong><br />
          ${firstParty.role}, ${firstParty.companyName}
        </div>
      </div>
    `
      : /* ── Partner / appointment email ──────────────────────────────── */ `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
          <div style="height: 3px; background: linear-gradient(to right, transparent, #2563eb, transparent); margin-top: 12px; width: 100%;"></div>
        </div>
        
        <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          On behalf of <strong>${firstParty.companyName}</strong>, I am thrilled to extend to you our official offer of partnership for the position of <strong style="color: #2563eb;">${secondParty.position}</strong>.
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
          Please review the full letter of appointment terms and apply your digital signature. You can access your portal directly by clicking the button below:
        </p>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${ctaLink}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);">
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

    const emailResult = await resend.emails.send({
      from: sender,
      to: [candidateEmail],
      subject,
      html: emailHtml,
    });

    if (emailResult.error) {
      console.error("[Next.js API] Resend sending error:", emailResult.error);
      return NextResponse.json({ error: emailResult.error.message }, { status: 400 });
    }

    console.log(`[Next.js API] Offer email dispatched via Resend: ${emailResult.data?.id}`);
    return NextResponse.json({ success: true, messageId: emailResult.data?.id });
  } catch (err: unknown) {
    console.error("[Next.js API] Error dispatching email:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error." },
      { status: 500 }
    );
  }
}
