"use client";

import React from "react";
import { motion } from "motion/react";
import { User, Phone } from "lucide-react";
import { SecondParty } from "@/types";
import { Field, IconInput, StepHeader } from "@/shared/ui/FormPrimitives";

export interface Step2Props {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}

export function Step2({ secondParty, setSecondParty }: Step2Props) {
  const relations = ["Father", "Mother", "Husband", "Guardian"];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <StepHeader
        title="Section 2: Family & Guardian Context"
        desc="Indicate guardian specifications and urgent contact parameters for the agreement file."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
          <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
            Guardian Relationship *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {relations.map((rel) => (
              <button
                key={rel}
                type="button"
                onClick={() =>
                  setSecondParty((p) => ({ ...p, guardianRelation: rel }))
                }
                className={`py-3 text-xs font-bold rounded-xl transition border text-center cursor-pointer ${
                  secondParty.guardianRelation === rel
                    ? "bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]"
                    : "bg-[#F8FAFC] border-[#DBEAFE] hover:border-[#2563EB] text-[#334155]"
                }`}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>

        <Field label={`${secondParty.guardianRelation}'s Full Name *`}>
          <IconInput
            icon={User}
            type="text"
            placeholder="e.g. Zhon Doe"
            value={secondParty.guardianName}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, guardianName: e.target.value }))
            }
          />
        </Field>

        <Field label={`${secondParty.guardianRelation}'s Mobile No *`}>
          <IconInput
            icon={Phone}
            type="text"
            placeholder="e.g. 01XXXXXXXXX"
            value={secondParty.guardianMobile}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, guardianMobile: e.target.value }))
            }
          />
        </Field>
      </div>
    </motion.div>
  );
}
