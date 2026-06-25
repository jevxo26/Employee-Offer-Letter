"use client";

import React, { useState } from "react";
import { X, Copy, ExternalLink, Send, Check } from "lucide-react";
import { FirstParty, SecondParty } from "../types";

interface EmailPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSentSuccess: () => void;
  secondParty: SecondParty;
  firstParty: FirstParty;
  candidateLink: string;
  offerId: string;
}

export default function EmailPortalModal({
  isOpen,
  onClose,
  onSentSuccess,
  secondParty,
  firstParty,
  candidateLink,
  offerId,
}: EmailPortalModalProps) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [fromAddress, setFromAddress] = useState("JEVXO <info@jevxo.com>");
  const [apiError, setApiError] = useState("");

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId,
          candidateEmail: secondParty.email,
          candidateName: secondParty.fullName,
          fromAddress,
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
        const errorMsg = data.error || "Failed to send email. Please check your domain configuration.";
        setApiError(errorMsg);
      }
    } catch (err) {
      console.error(err);
      setApiError("Network error: Failed to connect to server endpoint.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
              JEVXO Offer Dispatch Portal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Fields */}
        <div className="p-6 border-b border-slate-100 space-y-3 shrink-0 text-xs font-semibold text-slate-500 bg-slate-50/50">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-3">
              <span className="w-14 text-right shrink-0">From:</span>
              <input
                type="text"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-slate-800 flex-1 font-bold outline-none focus:border-blue-500 transition"
              />
            </div>
            <p className="text-[10px] text-slate-450 font-normal pl-[68px] leading-relaxed">
              * Must be verified in Resend. For sandbox testing, use <strong className="text-blue-600 select-all">JEVXO &lt;onboarding@resend.dev&gt;</strong>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-right">To:</span>
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 flex-1 font-bold">
              {secondParty.fullName} ({secondParty.email})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-right">Subject:</span>
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 flex-1 font-extrabold">
              Offer of Partnership & Appointment Letter — JEVXO
            </span>
          </div>
        </div>

        {/* Email Body Preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-700 text-sm leading-relaxed font-sans">
          {apiError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl">
              Resend Error: {apiError}
            </div>
          )}
          <p className="font-bold text-slate-900">Dear {secondParty.fullName},</p>
          
          <p>
            On behalf of <strong>{firstParty.companyName}</strong>, I am thrilled to extend to you our official offer of partnership for the position of <strong>{secondParty.position}</strong>. 
          </p>
          
          <p>
            At JEVXO, we operate on a partnership-based structure where every team member is expected to lead with an ownership mindset. We are excited about the prospect of you joining us to collaborate on core achievements and drive the company forward.
          </p>

          <p>
            Your appointment details, including equity share allocations and probation milestones, have been finalized. To complete the agreement:
          </p>
          
          <ol className="list-decimal pl-5 space-y-2 font-medium text-slate-600">
            <li>Review the full letter of appointment terms.</li>
            <li>Apply your digital signature to the signature block.</li>
            <li>Download your counter-signed, final PDF document for your records.</li>
          </ol>

          {/* Styled Link Card */}
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Candidate Signature Portal Link</span>
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
                className={`h-9 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-50"
                }`}
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5" /> Copied</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
            </div>
            <p className="text-[10px] text-blue-600 font-semibold italic">
              * Open this link in a new tab to review the document and sign as the candidate.
            </p>
          </div>

          <p>
            Should you have any questions, feel free to contact us at {firstParty.mobileNumber} or reply directly to this email.
          </p>

          <p className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Best Regards,<br />
            <strong>{firstParty.representedBy}</strong><br />
            {firstParty.role}, {firstParty.companyName}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <a
            href={candidateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto h-11 px-5 border border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-50/50 rounded-xl text-slate-700 hover:text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Candidate Portal
          </a>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2.5">
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
              className={`h-11 px-6 font-bold text-white text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                sent
                  ? "bg-emerald-600 shadow-emerald-600/10"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/10 hover:shadow-blue-600/25"
              }`}
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending via Resend...</span>
                </>
              ) : sent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Offer Sent Successfully!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Offer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
