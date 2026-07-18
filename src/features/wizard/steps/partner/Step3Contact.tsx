"use client";

import React from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Check } from "lucide-react";
import { SecondParty } from "@/types";
import { Field, IconInput, StepHeader } from "@/shared/ui/FormPrimitives";

export interface Step3Props {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  sameAddress: boolean;
  onAddressToggle: (checked: boolean) => void;
}

export function Step3({
  secondParty,
  setSecondParty,
  sameAddress,
  onAddressToggle,
}: Step3Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <StepHeader
        title="Section 3: Contact Details & Residence"
        desc="Verify current telephone lines and housing documentation addresses."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Partner Mobile Number *">
          <IconInput
            icon={Phone}
            type="text"
            placeholder="e.g. 01XXXXXXXXX"
            value={secondParty.mobileNumber}
            onChange={(e) =>
              setSecondParty((p) => ({
                ...p,
                mobileNumber: e.target.value.replace(/[^\d+]/g, ""),
              }))
            }
          />
        </Field>

        <Field label="Partner Email Address *">
          <IconInput
            icon={Mail}
            type="email"
            placeholder="e.g. partner@gmail.com"
            value={secondParty.email || ""}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, email: e.target.value }))
            }
          />
        </Field>
      </div>

      <Field label="Present Address *">
        <div className="relative">
          <MapPin className="absolute left-3 top-[15px] w-4 h-4 text-[#64748B]" />
          <textarea
            placeholder="e.g. Dhaka, Bangladesh"
            rows={2}
            value={secondParty.presentAddress}
            onChange={(e) => {
              const val = e.target.value;
              setSecondParty((p) => ({
                ...p,
                presentAddress: val,
                permanentAddress: sameAddress ? val : p.permanentAddress,
              }));
            }}
            className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none transition resize-none"
          />
        </div>
      </Field>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
            Permanent Address *
          </label>
          <button
            type="button"
            onClick={() => onAddressToggle(!sameAddress)}
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 select-none transition cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                sameAddress
                  ? "bg-[#2563EB] border-[#2563EB] text-white"
                  : "border-[#DBEAFE] bg-[#F8FAFC]"
              }`}
            >
              {sameAddress && <Check className="w-3 h-3" />}
            </div>
            Same as Present Address
          </button>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-[15px] w-4 h-4 text-[#64748B] pointer-events-none" />
          <textarea
            placeholder="e.g. Gazipur, Bangladesh"
            rows={2}
            disabled={sameAddress}
            value={
              sameAddress
                ? secondParty.presentAddress
                : secondParty.permanentAddress
            }
            onChange={(e) =>
              setSecondParty((p) => ({
                ...p,
                permanentAddress: e.target.value,
              }))
            }
            className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none transition resize-none ${
              sameAddress ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}
