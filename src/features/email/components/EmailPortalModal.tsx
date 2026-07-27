"use client";

import React, { useState } from "react";
import { X, Send, Check } from "lucide-react";
import { FirstParty, SecondParty, SalesAgreementType, DocSettings } from "@/types";

interface EmailPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSentSuccess: () => void;
  secondParty: SecondParty;
  firstParty: FirstParty;
  candidateLink: string;
  offerId: string;
  agreementTemplate?: string;
  salesAgreementType?: SalesAgreementType;
  docSettings?: DocSettings;
  hrNoticePdfBase64?: string;
}

export default function EmailPortalModal({
  isOpen,
  onClose,
  onSentSuccess,
  secondParty,
  firstParty,
  candidateLink,
  offerId,
  agreementTemplate,
  salesAgreementType,
  docSettings,
  hrNoticePdfBase64,
}: EmailPortalModalProps) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const isInternship = agreementTemplate === "internship";
  const isHrHiring = agreementTemplate === "hrHiringNotice";
  const isCSP = salesAgreementType === "countrySales";
  const isSalesAgent = salesAgreementType === "salesAgent";
  const isSalesType = isCSP || isSalesAgent;

  const isPendingCSP =
    isSalesAgent &&
    typeof window !== "undefined" &&
    window.location.search.indexOf("candidateView") === -1;

  const hrRecipientEmail = isHrHiring ? docSettings?.hrRecipientEmail || "" : "";
  const hrRecipientName = isHrHiring
    ? docSettings?.hrRecipientName || docSettings?.hrRecipientRole || "Recipient"
    : "";

  const displayEmail = isHrHiring
    ? hrRecipientEmail || "Recipient Email"
    : isPendingCSP
      ? (firstParty as unknown as Record<string, string>).salesPartnerEmail || "Partner Email"
      : secondParty.email;

  const displayName = isHrHiring
    ? hrRecipientName || "Recipient"
    : isPendingCSP
      ? (firstParty as unknown as Record<string, string>).salesPartnerName || "Country Sales Partner"
      : secondParty.fullName;

  const fromAddress = "JEVXO <info@jevxo.com>";

  const emailSubject = isHrHiring
    ? `HR Hiring Notice: ${docSettings?.hrPositionName || "Open Position"}`
    : isInternship
      ? "Internship Offer Letter — JEVXO"
      : isCSP
        ? "Country Sales Partner Agreement — JEVXO"
        : isSalesAgent
          ? "Sales Agent Agreement — JEVXO"
          : "Offer of Partnership & Appointment Letter — JEVXO";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(candidateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    setSending(true);
    setApiError("");
    try {
      const response = await fetch("/api/send-offer-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          candidateEmail: isHrHiring ? displayEmail : secondParty.email,
          candidateName: isHrHiring ? displayName : secondParty.fullName,
          agreementTemplate,
          salesAgreementType,
          ...(isHrHiring && hrNoticePdfBase64 ? { hrNoticePdfBase64 } : {}),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSent(true);
        onSentSuccess();
        setTimeout(() => {
          setSent(false);
          onClose();
        }, 1500);
      } else {
        setApiError(
          data.error || "Failed to send email. Please check your domain configuration.",
        );
      }
    } catch (err) {
      console.error(err);
      setApiError("Network error: Failed to connect to server endpoint.");
    } finally {
      setSending(false);
    }
  };

  // HR preview vars
  const hrPosition = docSettings?.hrPositionName || "Open Position";
  const hrVacancies = docSettings?.hrVacancies ?? 1;
  const hrStartDate = docSettings?.hrRecruitmentStartDate || "—";
  const hrEndDate = docSettings?.hrRecruitmentEndDate || "—";
  const hrPreparedBy =
    docSettings?.hrPreparedByName || firstParty.hrName || firstParty.representedBy;
  const hrDesignation =
    docSettings?.hrPreparedByDesignation || "Head of HR Department";
  const hrContact = firstParty.email || firstParty.mobileNumber;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${isHrHiring ? "bg-violet-600" : "bg-blue-600"
                }`}
            />
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
              {isHrHiring
                ? "JEVXO HR Hiring Notice Dispatch"
                : isInternship
                  ? "JEVXO Internship Offer Portal"
                  : isCSP
                    ? "JEVXO Country Sales Partner Portal"
                    : isSalesAgent
                      ? "JEVXO Sales Agent Agreement Portal"
                      : "JEVXO Offer Dispatch Portal"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email header fields */}
        <div className="p-6 border-b border-slate-100 space-y-3 shrink-0 text-xs font-semibold text-slate-500 bg-slate-50/50">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-3">
              <span className="w-14 text-right shrink-0">From:</span>
              <input
                type="text"
                value={fromAddress}
                readOnly
                className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-slate-800 flex-1 font-bold outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-normal pl-[68px] leading-relaxed">
              * Emails use the verified JEVXO sender configuration from the server.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-right">To:</span>
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 flex-1 font-bold">
              {displayName} ({displayEmail})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-right">Subject:</span>
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 flex-1 font-extrabold">
              {emailSubject}
            </span>
          </div>
          {isHrHiring && (
            <div className="flex items-center gap-3">
              <span className="w-14 text-right">Attach:</span>
              <span
                className={`px-3 py-1.5 rounded-lg flex-1 font-bold text-[11px] flex items-center gap-1.5 ${hrNoticePdfBase64
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-amber-50 border border-amber-200 text-amber-700"
                  }`}
              >
                {hrNoticePdfBase64 ? (
                  <>
                    <Check className="w-3 h-3" /> HR_Hiring_Notice.pdf — ready to attach
                  </>
                ) : (
                  "⚠ PDF not ready — notice may send without attachment"
                )}
              </span>
            </div>
          )}
        </div>

        {/* Email body preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-700 text-sm leading-relaxed font-sans">
          {apiError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl">
              Resend Error: {apiError}
            </div>
          )}

          {isHrHiring ? (
            <div className="space-y-4">
              <p className="font-bold text-slate-900">Dear {displayName},</p>
              <p>I hope this email finds you well.</p>
              <p>
                This is to formally notify you that kindly find attached the official{" "}
                <strong>HR Hiring Notice</strong> for the recruitment of{" "}
                <strong>{hrPosition}</strong> ({hrVacancies}{" "}
                {hrVacancies === 1 ? "vacancy" : "vacancies"}), scheduled between{" "}
                <strong>{hrStartDate}</strong> and <strong>{hrEndDate}</strong>.
              </p>
              <p>
                This notice has been prepared and issued by <strong>{hrPreparedBy}</strong>,{" "}
                {hrDesignation} to support our upcoming operational demands and project
                commitments.
              </p>
              <p>
                Kindly review the attached PDF for the full position breakdown and required
                skill set. If you have any questions or feedback, feel free to reach out to
                us at <strong>{hrContact}</strong>.
              </p>
              <p className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                Best regards,
                <br />
                <strong>{firstParty.companyName}</strong>
              </p>
            </div>
          ) : (
            <>
              <p className="font-bold text-slate-900">Dear {displayName},</p>

              {isInternship ? (
                <>
                  <p>
                    On behalf of <strong>{firstParty.companyName}</strong>, we are pleased to
                    extend to you our official <strong>Internship Offer</strong> for the
                    position of <strong>{secondParty.position}</strong>.
                  </p>
                  <p>
                    This internship is a great opportunity to gain hands-on experience in a
                    fast-growing tech startup. You will work alongside our core team and
                    contribute to real projects.
                  </p>
                  <p>Your offer details have been finalized. To complete the process:</p>
                  <ol className="list-decimal pl-5 space-y-2 font-medium text-slate-600">
                    <li>Review the full internship offer letter terms.</li>
                    <li>Upload your professional photo to the ID Card tab.</li>
                    <li>Apply your digital signature to the signature block.</li>
                    <li>Press the Confirm button once everything looks correct.</li>
                  </ol>
                </>
              ) : isSalesType ? (
                <>
                  <p>
                    {isSalesAgent ? (
                      isPendingCSP ? (
                        <>
                          Please review the full agreement terms and apply your digital
                          signature for the <strong>Sales Agent Agreement</strong> for your
                          agent <strong>{secondParty.fullName}</strong>.
                        </>
                      ) : (
                        <>
                          Your Country Sales Partner has issued this{" "}
                          <strong>Sales Agent Agreement</strong>. JEVXO acknowledges and
                          approves the appointment.
                        </>
                      )
                    ) : (
                      <>
                        On behalf of <strong>{firstParty.companyName}</strong>, we are
                        pleased to formally appoint you as a{" "}
                        <strong>Country Sales Partner</strong>.
                      </>
                    )}
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 font-medium text-slate-600">
                    <li>Review the full agreement terms carefully.</li>
                    <li>Upload your professional photo to the ID Card tab.</li>
                    <li>Apply your digital signature to the signature block.</li>
                    <li>Press the Confirm button once everything looks correct.</li>
                  </ol>
                </>
              ) : (
                <>
                  <p>
                    On behalf of <strong>{firstParty.companyName}</strong>, I am thrilled to
                    extend to you our official offer of partnership for the position of{" "}
                    <strong>{secondParty.position}</strong>.
                  </p>
                  <p>
                    Your appointment details have been finalized. To complete the agreement:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 font-medium text-slate-600">
                    <li>Review the full letter of appointment terms.</li>
                    <li>Apply your digital signature to the signature block.</li>
                    <li>Add your professional photo to the ID card tab.</li>
                    <li>Press the Confirm button once everything looks correct.</li>
                  </ol>
                </>
              )}

              {/* Portal link card */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  {isInternship
                    ? "Intern Signature Portal Link"
                    : isSalesType
                      ? "Sales Agreement Signature Portal Link"
                      : "Candidate Signature Portal Link"}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={candidateLink}
                    className="bg-white border border-blue-200 rounded-xl px-3.5 py-2.5 text-xs text-blue-800 font-bold flex-1 select-all outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${copied
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-50"
                      }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      "Copy"
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-blue-600 font-semibold italic">
                  * Open this link to review the document and sign as the candidate.
                </p>
              </div>

              <p>
                Should you have any questions, feel free to contact us at{" "}
                {firstParty.mobileNumber} or reply directly to this email.
              </p>
              <p className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                Best Regards,
                <br />
                <strong>{firstParty.representedBy}</strong>
                <br />
                {firstParty.role}, {firstParty.companyName}
              </p>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={sending || sent}
            className="h-11 px-5 border border-slate-200 hover:border-slate-300 hover:bg-white rounded-xl text-slate-600 text-xs font-bold transition cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || sent}
            className={`h-11 px-6 font-bold text-white text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${sent
                ? "bg-emerald-600"
                : isHrHiring
                  ? "bg-violet-600 hover:bg-violet-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending…</span>
              </>
            ) : sent ? (
              <>
                <Check className="w-4 h-4" />
                <span>{isHrHiring ? "Notice Sent!" : "Sent Successfully!"}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isHrHiring ? "Send Notice" : "Send Offer"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
