"use client";

import React from "react";
import { motion } from "motion/react";
import { User, Briefcase, Calendar, ShieldCheck } from "lucide-react";
import { SecondParty } from "@/types";
import { Field, IconInput, StepHeader } from "@/shared/ui/FormPrimitives";

export interface Step1Props {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}

export function Step1({ secondParty, setSecondParty }: Step1Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <StepHeader
        title="Section 1: Identity & Professional Role"
        desc="Specify the official legal name, age parameters, and specific role index in JEVXO."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Second Party Full Name *">
          <IconInput
            icon={User}
            type="text"
            placeholder="e.g. Jhon Doe"
            value={secondParty.fullName}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, fullName: e.target.value }))
            }
          />
        </Field>

        <Field label="Corporate Position *">
          <IconInput
            icon={Briefcase}
            type="text"
            placeholder="e.g. Web Developer"
            value={secondParty.position}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, position: e.target.value }))
            }
          />
          <p className="text-[10px] text-[#64748B] italic">
            Adjust this dynamically to match appointment parameters.
          </p>
        </Field>

        <Field label="Date Of Birth *">
          <IconInput
            icon={Calendar}
            type="date"
            value={secondParty.dob}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, dob: e.target.value }))
            }
          />
        </Field>

        <Field label="National ID (NID) Number *">
          <IconInput
            icon={ShieldCheck}
            type="text"
            placeholder="e.g. 123XXXXX321"
            value={secondParty.nidNumber}
            onChange={(e) =>
              setSecondParty((p) => ({
                ...p,
                nidNumber: e.target.value.replace(/\D/g, ""),
              }))
            }
          />
        </Field>

        <Field label="Blood Group *">
          <div className="relative">
            <select
              value={secondParty.bloodGroup || "Select"}
              onChange={(e) =>
                setSecondParty((p) => ({ ...p, bloodGroup: e.target.value }))
              }
              className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-4 pr-10 text-sm text-[#0F172A] focus:outline-none transition appearance-none cursor-pointer"
            >
              {["Select", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 top-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-[#94A3B8]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-[10px] text-[#64748B] italic">
            Saved on our database securely for emergency reference.
          </p>
        </Field>
      </div>
    </motion.div>
  );
}
