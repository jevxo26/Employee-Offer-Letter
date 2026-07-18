"use client";

import React, { useState } from "react";
import { RefreshCw, Upload, Check } from "lucide-react";
import SignaturePad from "./SignaturePad";
import { FirstParty, SecondParty } from "@/types";

interface CandidateSidebarProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  isExporting: boolean;
  isCompleted: boolean;
  onExport: () => void;
  offerId: string;
  isPhotoUploaded?: boolean;
  isPendingCSP?: boolean;
  onSwitchToIdCard?: () => void;
  onSignatureSaved?: (hasSignature: boolean) => void;
}

export default function CandidateSidebar({
  firstParty,
  secondParty,
  setSecondParty,
  isExporting,
  isCompleted,
  onExport,
  offerId,
  isPhotoUploaded = false,
  isPendingCSP = false,
  onSwitchToIdCard,
  onSignatureSaved,
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
          localStorage.setItem(
            "jevxo_offer_" + offerId,
            JSON.stringify(parsed),
          );
        } catch (e) {
          console.error(e);
        }
      }

      fetch(`/api/offers/${offerId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureImg: dataUrl }),
      }).catch((err) => console.error("Failed to save signature:", err));

      return updated;
    });
    if (onSignatureSaved) onSignatureSaved(!!dataUrl);
  };

  const handleClearSignature = () => {
    setSecondParty((p) => {
      const updated = { ...p, signatureImg: "" };
      const stored = localStorage.getItem("jevxo_offer_" + offerId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.secondParty = updated;
          localStorage.setItem(
            "jevxo_offer_" + offerId,
            JSON.stringify(parsed),
          );
        } catch (e) {
          console.error(e);
        }
      }

      fetch(`/api/offers/${offerId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureImg: "" }),
      }).catch((err) => console.error("Failed to clear signature:", err));

      return updated;
    });
    if (onSignatureSaved) onSignatureSaved(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleSaveSignature(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleActionClick = () => {
    if (isCompleted) return;
    if (!secondParty.signatureImg) {
      setSigError("Please draw and save your signature before exporting.");
      return;
    }
    if (!isPendingCSP && !isPhotoUploaded) {
      setSigError(
        "Please upload your photo in the ID Card tab before signing.",
      );
      if (onSwitchToIdCard) onSwitchToIdCard();
      return;
    }
    setSigError("");
    onExport();
  };

  return (
    <div className="w-full xl:w-[420px] bg-[#F8FAFC] border-r border-[#DBEAFE] flex flex-col h-screen sticky top-0 overflow-hidden shrink-0">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            Offer Awaiting Acceptance
          </span>
          <h2 className="text-xl font-bold text-[#0F172A]">Candidate Portal</h2>
          <p className="text-[#64748B] text-xs">
            Review the terms, draw your signature, and generate your
            counter-signed partnership contract.
          </p>
        </div>

        {/* Info card */}
        <div className="p-4 bg-white border border-[#DBEAFE] rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Candidate:</span>
            <span className="font-bold text-slate-800">
              {secondParty.fullName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">
              Position Offered:
            </span>
            <span className="font-bold text-[#2563EB]">
              {secondParty.position}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Company:</span>
            <span className="font-bold text-slate-800">
              {firstParty.companyName}
            </span>
          </div>
        </div>

        {/* Signature Pad Section */}
        <div className="space-y-4">
          <div className="border-b border-[#DBEAFE] pb-1">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
              Draw Your Signature *
            </h3>
            <p className="text-[10px] text-[#64748B]">
              Draw inside the pad below to accept the partnership terms.
            </p>
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

          {/* Or divider */}
          <div className="flex items-center gap-4 my-2 text-[#64748B] text-xs font-bold uppercase tracking-wider">
            <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
            <span>Or</span>
            <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
          </div>

          {/* Upload option */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
              Option B: Upload Signature Photo File
            </label>
            <div className="relative border-2 border-dashed border-[#DBEAFE] hover:border-[#2563EB]/50 rounded-2xl p-6 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Upload className="w-8 h-8 text-[#64748B] group-hover:text-[#2563EB] transition transform group-hover:scale-105" />
              <p className="text-xs text-[#334155] font-semibold uppercase tracking-wider">
                Drag & drop image file or select
              </p>
              <p className="text-[10px] text-[#64748B] leading-relaxed max-w-[280px]">
                Accepts PNG, JPG, or SVG formats containing clear black or blue
                ink signatures with high contrast backgrounds.
              </p>
            </div>

            {secondParty.signatureImg && (
              <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-[#DBEAFE] rounded-xl shrink-0">
                    <img
                      src={secondParty.signatureImg}
                      alt="Signature Preview"
                      className="w-12 h-8 object-contain bg-white rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#2563EB] font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Signature Active
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      Export-ready image base64 synced
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="text-xs text-rose-600 hover:text-rose-500 font-semibold px-2 py-1 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Action Footer */}
      <div className="p-6 bg-[#F8FAFC] border-t border-[#DBEAFE] space-y-3 shrink-0">
        <button
          onClick={handleActionClick}
          disabled={isExporting || isCompleted}
          className="w-full py-4 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#64748B]/40 disabled:cursor-not-allowed font-bold text-white text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#2563EB]/10 hover:shadow-[#2563EB]/25 cursor-pointer animate-pulse-subtle"
        >
          {isCompleted ? (
            <>
              <Check className="w-5 h-5" /> Signed Successfully
            </>
          ) : isExporting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" /> Generating Signed
              PDF...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" /> Confirm & Sign
            </>
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
