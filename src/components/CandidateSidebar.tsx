"use client";

import React, { useState } from "react";
import { RefreshCw, Download } from "lucide-react";
import SignaturePad from "./SignaturePad";
import { FirstParty, SecondParty } from "../types";

interface CandidateSidebarProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  isExporting: boolean;
  onExport: () => void;
  offerId: string;
}

export default function CandidateSidebar({
  firstParty,
  secondParty,
  setSecondParty,
  isExporting,
  onExport,
  offerId,
}: CandidateSidebarProps) {
  const [sigError, setSigError] = useState("");

  const handleSaveSignature = (dataUrl: string) => {
    setSigError("");
    setSecondParty((p) => {
      const updated = { ...p, signatureImg: dataUrl };
      const stored = localStorage.getItem("jevxo_offer_" + offerId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.secondParty = updated;
          localStorage.setItem("jevxo_offer_" + offerId, JSON.stringify(parsed));
        } catch (e) {
          console.error(e);
        }
      }

      // Save signature to backend
      fetch(`/api/offers/${offerId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signatureImg: dataUrl }),
      }).catch((err) => console.error("Failed to save signature to backend:", err));

      return updated;
    });
  };

  const handleClearSignature = () => {
    setSecondParty((p) => {
      const updated = { ...p, signatureImg: "" };
      const stored = localStorage.getItem("jevxo_offer_" + offerId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.secondParty = updated;
          localStorage.setItem("jevxo_offer_" + offerId, JSON.stringify(parsed));
        } catch (e) {
          console.error(e);
        }
      }

      // Clear signature on backend
      fetch(`/api/offers/${offerId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signatureImg: "" }),
      }).catch((err) => console.error("Failed to clear signature on backend:", err));

      return updated;
    });
  };

  const handleActionClick = () => {
    if (!secondParty.signatureImg) {
      setSigError("Please draw and save your signature before exporting.");
      return;
    }
    onExport();
  };

  return (
    <div className="w-full xl:w-[420px] bg-[#F8FAFC] border-r border-[#DBEAFE] flex flex-col justify-between overflow-y-auto shrink-0 animate-fadeIn">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            Offer Awaiting Acceptance
          </span>
          <h2 className="text-xl font-bold text-[#0F172A]">Candidate Portal</h2>
          <p className="text-[#64748B] text-xs">
            Review the terms, draw your signature, and generate your counter-signed partnership contract.
          </p>
        </div>

        {/* Info card */}
        <div className="p-4 bg-white border border-[#DBEAFE] rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Candidate:</span>
            <span className="font-bold text-slate-800">{secondParty.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Position Offered:</span>
            <span className="font-bold text-[#2563EB]">{secondParty.position}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Company:</span>
            <span className="font-bold text-slate-800">{firstParty.companyName}</span>
          </div>
        </div>

        {/* Signature Pad */}
        <div className="space-y-4">
          <div className="border-b border-[#DBEAFE] pb-1">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
              Draw Your Signature *
            </h3>
            <p className="text-[10px] text-[#64748B]">Draw inside the pad below to accept the partnership terms.</p>
          </div>

          {sigError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold rounded-xl">
              {sigError}
            </div>
          )}

          <SignaturePad
            onSave={handleSaveSignature}
            onClear={handleClearSignature}
            savedImage={secondParty.signatureImg}
          />
        </div>
      </div>

      {/* Action footer */}
      <div className="p-6 bg-[#F8FAFC] border-t border-[#DBEAFE] space-y-3 shrink-0">
        <button
          onClick={handleActionClick}
          disabled={isExporting}
          className="w-full py-4 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#64748B]/40 disabled:cursor-not-allowed font-bold text-white text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#2563EB]/10 hover:shadow-[#2563EB]/25 cursor-pointer animate-pulse-subtle"
        >
          {isExporting ? (
            <><RefreshCw className="w-5 h-5 animate-spin" /> Generating Signed PDF...</>
          ) : (
            <><Download className="w-5 h-5" /> Sign & Download PDF (2 Pages)</>
          )}
        </button>
        <div className="flex justify-between text-[11px] text-[#64748B] px-1 font-semibold">
          <span>Official A4 formatting</span>
          <span>Dual signatures included</span>
        </div>
      </div>
    </div>
  );
}
