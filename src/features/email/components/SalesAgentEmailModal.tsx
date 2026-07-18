"use client";

import React, { useState } from "react";
import { X, Copy, ExternalLink, Send, Check } from "lucide-react";
import { FirstParty, SecondParty, SalesAgreementType } from "@/types";

interface SalesAgentEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSentSuccess: () => void;
  secondParty: SecondParty;
  firstParty: FirstParty;
  candidateLink: string;
  offerId: string;
  agreementTemplate?: string;
  salesAgreementType?: SalesAgreementType;
  docSettings?: any;
}

export default function SalesAgentEmailModal({
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
}: SalesAgentEmailModalProps) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const isInternship = agreementTemplate === "internship";
  const isCSP = salesAgreementType === "countrySales";
  const isSalesAgent = salesAgreementType === "salesAgent";
  const isSalesType = isCSP || isSalesAgent;

  const fromAddress = "JEVXO <info@jevxo.com>";
  const emailSubject = "Action Required: Sales Agent Agreement — JEVXO";

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
          agreementTemplate,
          salesAgreementType,
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
              Send Agreement to Sales Agent
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
                readOnly
                className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-slate-800 flex-1 font-bold outline-none focus:border-blue-500 transition"
              />
            </div>
            <p className="text-[10px] text-slate-450 font-normal pl-[68px] leading-relaxed">
              * Offer emails now use the verified JEVXO sender configuration from the server.
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
              {emailSubject}
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
            Your Country Sales Partner has issued this <strong>Sales Agent Agreement</strong> for the Territory of <strong>{docSettings?.territory || "your region"}</strong>. <strong>{firstParty.companyName}</strong> acknowledges and approves the appointment; the contractual relationship is with the Country Sales Partner.
          </p>
          <p>
            Please review the full agreement terms, upload your professional photo, and apply your digital signature to complete your onboarding.
          </p>
          <ol className="list-decimal pl-5 space-y-2 font-medium text-slate-600">
            <li>Review the full agreement terms carefully.</li>
            <li>Upload your professional photo to the ID Card tab.</li>
            <li>Apply your digital signature to the signature block.</li>
            <li>Press the Confirm button once everything looks correct.</li>
          </ol>
          <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 text-blue-800 rounded-xl font-medium text-xs">
            <Check className="w-4 h-4 text-blue-600" />
            Clicking send will dispatch this secure link directly to {secondParty.email}.
          </div>
          
          <div className="pt-6 mt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              onClick={onClose}
              disabled={sending || sent}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || sent}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer"
            >
              {sent ? (
                <>
                  <Check className="w-4 h-4" /> Sent successfully
                </>
              ) : sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Offer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
