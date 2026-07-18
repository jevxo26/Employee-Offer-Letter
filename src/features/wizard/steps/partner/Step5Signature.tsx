"use client";

import React from "react";
import { motion } from "motion/react";
import { Upload, Check } from "lucide-react";
import SignaturePad from "@/features/candidate-portal/components/SignaturePad";
import { FirstParty } from "@/types";
import { StepHeader } from "@/shared/ui/FormPrimitives";

export interface Step5Props {
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  onClearError: () => void;
}

export function Step5({ firstParty, setFirstParty, onClearError }: Step5Props) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onClearError();
      if (typeof reader.result === "string") {
        setFirstParty((p) => ({ ...p, signatureImg: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 5: Founder & CEO Authorization"
        desc="Authorize the agreement document using your official signature as the Company Founder / CEO."
      />

      <SignaturePad
        onSave={(dataUrl) => {
          onClearError();
          setFirstParty((p) => ({ ...p, signatureImg: dataUrl }));
        }}
        onClear={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
        savedImage={firstParty.signatureImg}
      />

      <div className="flex items-center gap-4 my-2 text-[#64748B] text-xs font-bold uppercase tracking-wider">
        <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
        <span>Or</span>
        <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
      </div>

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
            Accepts PNG, JPG, or SVG formats containing clear black or blue ink
            signatures with high contrast backgrounds.
          </p>
        </div>

        {firstParty.signatureImg && (
          <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#DBEAFE] rounded-xl shrink-0">
                <img
                  src={firstParty.signatureImg}
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
              onClick={() =>
                setFirstParty((p) => ({ ...p, signatureImg: "" }))
              }
              className="text-xs text-rose-600 hover:text-rose-500 font-semibold px-2 py-1 cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
