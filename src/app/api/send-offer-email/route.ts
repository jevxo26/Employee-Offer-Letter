import { NextResponse } from "next/server";
import { Resend } from "resend";
import { findAgreementById } from "../../../lib/agreementStore";
import { getBaseUrl, getResendFromAddress } from "../../../lib/emailConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// Professional email signature block
// ─────────────────────────────────────────────────────────────────────────────
interface SignatureParams {
  name: string;
  title: string;       // e.g. "Head of HR Department • JEVXO"
  email: string;
  phone: string;
  website: string;
  address: string;
  accentColor: string; // hex — drives the divider + name-title colour
}

function buildEmailSignature({
  name,
  title,
  email,
  phone,
  website,
  address,
  accentColor,
}: SignatureParams): string {
  const baseUrl = getBaseUrl();

  // Web-safe hosted icons (jsDelivr CDN) — supported by all email clients (Gmail, Outlook, Yahoo, Apple Mail)
  const iconStyle = 'width="13" height="13" style="display:inline-block;vertical-align:middle;margin-right:3px;border:0;outline:none;"';

  const iconEmail = `<img ${iconStyle} src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/mail.svg" alt="email" />`;
  const iconPhone = `<img ${iconStyle} src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/phone.svg" alt="phone" />`;
  const iconGlobe = `<img ${iconStyle} src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/globe.svg" alt="website" />`;
  const iconPin   = `<img ${iconStyle} src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/map-pin.svg" alt="address" />`;

  // Real JEVXO logo — hosted public image URL compatible with HTML email clients
  const logoUrl = `${baseUrl}/logo.png`;
  const logoCell = `<td style="padding-right:15px;vertical-align:top;width:65px;">
    <a href="https://${website}" target="_blank" style="text-decoration:none;">
      <img src="${logoUrl}" alt="JEVXO" width="65" style="display:block;width:65px;max-width:65px;height:auto;border:0;outline:none;text-decoration:none;border-radius:6px;" />
    </a>
  </td>`;

  return `
<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#334155;line-height:1.4;border-collapse:collapse;margin-top:24px;padding-top:16px;border-top:1px solid #f1f5f9;width:100%;">
  <tr>
    ${logoCell}
    <td style="border-left:2px solid ${accentColor};padding-left:15px;vertical-align:top;">
      <div style="font-size:15px;font-weight:bold;color:#0f172a;margin-bottom:2px;">${name}</div>
      <div style="font-size:12px;font-weight:600;color:${accentColor};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">${title}</div>
      <div style="font-size:12px;color:#475569;">
        ${iconEmail}<a href="mailto:${email}" style="color:#0f172a;text-decoration:none;font-weight:500;">${email}</a>
        <span style="color:#cbd5e1;margin:0 5px;">|</span>
        ${iconPhone}<a href="tel:${phone.replace(/\s/g, "")}" style="color:#0f172a;text-decoration:none;font-weight:500;">${phone}</a>
      </div>
      <div style="font-size:12px;color:#475569;margin-top:3px;">
        ${iconGlobe}<a href="https://${website}" target="_blank" style="color:${accentColor};text-decoration:none;font-weight:500;">${website}</a>
        <span style="color:#cbd5e1;margin:0 5px;">|</span>
        ${iconPin}${address}
      </div>
      <div style="margin-top:8px;padding-top:6px;border-top:1px solid #f1f5f9;font-size:10.5px;color:#94a3b8;font-style:italic;">
        Automated Notice &amp; Document dispatched via
        <strong style="color:#8446EE;font-style:normal;">JEVXO Doc Engine</strong>
      </div>
    </td>
  </tr>
</table>`;
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { offerId, candidateEmail, candidateName, agreementTemplate, hrNoticePdfBase64 } = body;

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

    const isHrHiring =
      agreementTemplate === "hrHiringNotice" ||
      (agreement.docSettings as Record<string, unknown>)?.agreementTemplate === "hrHiringNotice";

    const isCertificate =
      agreementTemplate === "internCertificate" ||
      (agreement.docSettings as Record<string, unknown>)?.agreementTemplate === "internCertificate";

    const salesType = (agreement.docSettings as Record<string, unknown>)?.salesAgreementType as string | undefined;
    const isCountrySales = salesType === "countrySales";
    const isSalesAgent   = salesType === "salesAgent";
    const isSalesAgreement = isCountrySales || isSalesAgent;

    // --- OVERRIDE FOR SALES AGENT (CSP SIGNS FIRST) ---
    const isPendingCSP = agreement.status === "PENDING_CSP_SIGNATURE";
    if (isSalesAgent && isPendingCSP && docSettings?.salesPartner) {
      candidateEmail = docSettings.salesPartner.email;
      candidateName  = docSettings.salesPartner.fullName;
    }

    // --- OVERRIDE FOR HR HIRING NOTICE — always send to hrRecipientEmail ---
    if (isHrHiring) {
      const hrEmail = (docSettings as Record<string, unknown>)?.hrRecipientEmail as string | undefined;
      const hrName  = (docSettings as Record<string, unknown>)?.hrRecipientName  as string | undefined;
      if (hrEmail) candidateEmail = hrEmail;
      if (hrName)  candidateName  = hrName;
    }

    const ctaLink = `${getBaseUrl()}/?candidateView=${offerId}`;
    const sender  = getResendFromAddress();

    // ── Shared fallbacks ────────────────────────────────────────────────────
    const website = (firstParty.website || "www.jevxo.com").replace(/^https?:\/\//, "");
    const address = firstParty.currentAddress || "Silicon Tower (9th Floor), Hi-Tech Park, Rajshahi";

    // ── Build per-doc-type signature ────────────────────────────────────────
    const hrSignature = buildEmailSignature({
      name:         docSettings.hrPreparedByName  || firstParty.hrName  || firstParty.representedBy,
      title:        `${docSettings.hrPreparedByDesignation || "Head of HR Department"} &bull; ${firstParty.companyName}`,
      email:        firstParty.email  || "info@jevxo.com",
      phone:        firstParty.hrMobile || firstParty.mobileNumber || "",
      website,
      address,
      accentColor:  "#7c3aed",
    });

    const ceoSignature = buildEmailSignature({
      name:         firstParty.representedBy,
      title:        `${firstParty.role} &bull; ${firstParty.companyName}`,
      email:        firstParty.email  || "info@jevxo.com",
      phone:        firstParty.mobileNumber || "",
      website,
      address,
      accentColor:  "#2563eb",
    });

    const salesSignature = buildEmailSignature({
      name:         firstParty.representedBy,
      title:        `${firstParty.role} &bull; ${firstParty.companyName}`,
      email:        firstParty.email  || "info@jevxo.com",
      phone:        firstParty.mobileNumber || "",
      website,
      address,
      accentColor:  "#10b981",
    });

    // ── Subject ─────────────────────────────────────────────────────────────
    const subject = isInternship
      ? "Internship Offer Letter — JEVXO"
      : isHrHiring
      ? `HR Hiring Notice: ${docSettings.hrPositionName || "Open Position"}`
      : isCertificate
      ? "Certificate of Internship Completion — JEVXO"
      : isCountrySales
      ? "Country Sales Partner Agreement — JEVXO"
      : isSalesAgent
      ? "Sales Agent Agreement — JEVXO"
      : "JEVXO Offer Letter & Partnership Agreement";

    // ── HR resolved values ──────────────────────────────────────────────────
    const hrPosition  = docSettings.hrPositionName               || "Open Position";
    const hrVacancies = docSettings.hrVacancies                  ?? 1;
    const hrStartDate = docSettings.hrRecruitmentStartDate       || "—";
    const hrEndDate   = docSettings.hrRecruitmentEndDate         || "—";
    const hrPreparedBy = docSettings.hrPreparedByName || firstParty.hrName || firstParty.representedBy;
    const hrDesig      = docSettings.hrPreparedByDesignation     || "Head of HR Department";
    const hrContact    = firstParty.email || firstParty.mobileNumber || "info@jevxo.com";

    // ── Email HTML bodies ───────────────────────────────────────────────────
    const emailHtml = isHrHiring
      ? /* ── HR Hiring Notice — clean one-way email, PDF attached ── */ `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #7c3aed; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
    <div style="height: 3px; background: linear-gradient(to right, transparent, #7c3aed, transparent); margin-top: 12px; width: 100%;"></div>
    <p style="font-size: 11px; color: #94a3b8; margin-top: 6px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">HR Department &middot; Official Notice</p>
  </div>

  <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">I hope this email finds you well.</p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    This is to formally notify you that kindly find attached the official
    <strong style="color: #7c3aed;">HR Hiring Notice</strong> for the recruitment of
    <strong>${hrPosition}</strong> (${hrVacancies} ${hrVacancies === 1 ? "vacancy" : "vacancies"}),
    scheduled between <strong>${hrStartDate}</strong> and <strong>${hrEndDate}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    This notice has been prepared and issued by <strong>${hrPreparedBy}</strong>,
    ${hrDesig} to support our upcoming operational demands and project commitments.
  </p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    Kindly review the attached PDF for the full position breakdown and required skill set.
    If you have any questions or feedback, feel free to reach out to us at
    <strong>${hrContact}</strong>.
  </p>
  ${hrSignature}
</div>`

      : isCertificate
      ? /* ── Internship Certificate completion notice ── */ `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
    <div style="height: 3px; background: linear-gradient(to right, transparent, #2563eb, transparent); margin-top: 12px; width: 100%;"></div>
    <p style="font-size: 11px; color: #94a3b8; margin-top: 6px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Internship Completion Certificate</p>
  </div>

  <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">Congratulations on completing your internship!</p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    On behalf of <strong>${firstParty.companyName}</strong>, we are pleased to congratulate you on successfully completing your internship as a <strong>${secondParty.position}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    We want to thank you for your commitment, hard work, and contributions to our growth during your tenure. Your performance grade was evaluated as <strong style="color: #2563eb;">${docSettings.certPerformanceGrade || "Outstanding"}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    Kindly find attached your official, digitally-signed <strong>Certificate of Internship Completion</strong>. We wish you the absolute best in all your future endeavors.
  </p>
  ${ceoSignature}
</div>`

      : isInternship
      ? /* ── Internship ── */ `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #0ea5e9; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
    <div style="height: 3px; background: linear-gradient(to right, transparent, #0ea5e9, transparent); margin-top: 12px; width: 100%;"></div>
  </div>

  <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
    On behalf of <strong>${firstParty.companyName}</strong>, we are pleased to extend to you our official
    <strong>Internship Offer</strong> for the position of
    <strong style="color: #0ea5e9;">${secondParty.position}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
    This internship is a hands-on opportunity to grow your skills in a fast-moving tech environment.
    You will collaborate with our core team on real projects that shape our platform.
  </p>

  <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 15px 20px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #0369a1; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Offer Summary</h4>
    <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Duration:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0ea5e9;">${docSettings.internshipDuration || "—"} Months</td>
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
    <li>Upload your professional photo to the ID Card tab.</li>
    <li>Apply your digital signature.</li>
    <li>Press <strong>Confirm</strong> once everything looks correct.</li>
  </ol>

  <div style="margin: 30px 0; text-align: center;">
    <a href="${ctaLink}" target="_blank"
       style="background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(14,165,233,0.25);">
      View &amp; Sign Internship Offer
    </a>
  </div>
  ${ceoSignature}
</div>`

      : isSalesAgreement
      ? /* ── Sales Agreement (CSP / Sales Agent) ── */ `
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
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">${docSettings.baseCommissionRate ?? 10}% per sale</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Recurring Commission:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">${docSettings.recurringCommissionRate ?? 12}% monthly</td>
      </tr>` : `
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Sales Commission:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">${docSettings.baseCommissionRate ?? 10}% per sale</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Recurring Commission:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">${docSettings.recurringCommissionRate ?? 10}% monthly</td>
      </tr>`}
    </table>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 8px;">To complete your onboarding:</p>
  <ol style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 20px 0; line-height: 1.8;">
    <li>Review the full agreement terms carefully.</li>
    ${isSalesAgent && isPendingCSP ? "" : "<li>Upload your professional photo to the ID Card tab.</li>"}
    <li>Apply your digital signature to confirm acceptance.</li>
    <li>Press <strong>Confirm</strong> once everything looks correct.</li>
  </ol>

  <div style="margin: 30px 0; text-align: center;">
    <a href="${ctaLink}" target="_blank"
       style="background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(16,185,129,0.25);">
      View &amp; Sign Agreement
    </a>
  </div>
  ${salesSignature}
</div>`

      : /* ── Partner / appointment ── */ `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">JEVXO</h2>
    <div style="height: 3px; background: linear-gradient(to right, transparent, #2563eb, transparent); margin-top: 12px; width: 100%;"></div>
  </div>

  <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
    On behalf of <strong>${firstParty.companyName}</strong>, I am thrilled to extend to you our official offer of
    partnership for the position of <strong style="color: #2563eb;">${secondParty.position}</strong>.
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
    Please review the full letter of appointment terms and apply your digital signature. You can access your
    portal directly by clicking the button below:
  </p>

  <div style="margin: 30px 0; text-align: center;">
    <a href="${ctaLink}" target="_blank"
       style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(37,99,235,0.2);">
      View &amp; Sign Offer Letter
    </a>
  </div>
  ${ceoSignature}
</div>`;

    // ── Attachment (HR notice and Certificate only) ──────────────────────────
    const noticeName = isHrHiring
      ? `HR_Hiring_Notice_${(docSettings.hrPositionName || "Notice").replace(/\s+/g, "_")}.pdf`
      : isCertificate
      ? `Internship_Certificate_${(secondParty.fullName || "Intern").replace(/\s+/g, "_")}.pdf`
      : undefined;

    const emailResult = await resend.emails.send({
      from: sender,
      to:   [candidateEmail],
      subject,
      html: emailHtml,
      ...((isHrHiring || isCertificate) && hrNoticePdfBase64 && noticeName
        ? { attachments: [{ filename: noticeName, content: hrNoticePdfBase64 }] }
        : {}),
    });

    if (emailResult.error) {
      console.error("[Next.js API] Resend sending error:", emailResult.error);
      return NextResponse.json({ error: emailResult.error.message }, { status: 400 });
    }

    console.log(`[Next.js API] Email dispatched via Resend: ${emailResult.data?.id}`);
    return NextResponse.json({ success: true, messageId: emailResult.data?.id });
  } catch (err: unknown) {
    console.error("[Next.js API] Error dispatching email:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error." },
      { status: 500 }
    );
  }
}
