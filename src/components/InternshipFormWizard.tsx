"use client";

import React from "react";
import { motion } from "motion/react";
import { FileText, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { InternStep1, InternStep2, InternStep3 } from "./InternshipWizardSteps";
import { FirstParty, SecondParty, DocSettings } from "../types";

const STEP_LABELS = ["1. Personal Info", "2. Terms", "3. Signature"];
const TOTAL_STEPS = 3;

interface InternshipFormWizardProps {
  activeStep: number;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  validationError: string;
  onClearError: () => void;
  onNext: () => void;
  onPrev: () => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export default function InternshipFormWizard({
  activeStep,
  secondParty,
  setSecondParty,
  firstParty,
  setFirstParty,
  validationError,
  onClearError,
  onNext,
  onPrev,
  docSettings,
  setDocSettings,
}: InternshipFormWizardProps) {
  return (
    <motion.section
      key="internshipForm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <FileText className="text-[#0EA5E9] w-6 h-6" />
            Internship Offer Details
          </h2>
          <span className="text-xs bg-[#F0F9FF] border border-[#BAE6FD] px-3 py-1 rounded-full text-[#0EA5E9] font-bold">
            Step {activeStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#BAE6FD] h-2 rounded-full overflow-hidden flex">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx + 1 <= activeStep ? "bg-[#0EA5E9]" : "bg-[#BAE6FD]"
              } ${idx < TOTAL_STEPS - 1 ? "border-r border-white" : ""}`}
            />
          ))}
        </div>

        {/* Step pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {STEP_LABELS.map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition ${
                idx + 1 === activeStep
                  ? "bg-[#0EA5E9] border-[#0EA5E9] text-white"
                  : idx + 1 < activeStep
                  ? "bg-[#F0F9FF] border-[#0EA5E9] text-[#0EA5E9]"
                  : "bg-white border-[#BAE6FD] text-[#94A3B8]"
              }`}
            >
              {idx + 1 < activeStep ? <span className="inline-flex items-center gap-1"><Check className="w-2.5 h-2.5" />{label}</span> : label}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white border border-[#DBEAFE] rounded-3xl p-6 md:p-8 shadow-sm min-h-[340px]">
        {validationError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
            {validationError}
          </div>
        )}

        {activeStep === 1 && (
          <InternStep1 secondParty={secondParty} setSecondParty={setSecondParty} />
        )}
        {activeStep === 2 && (
          <InternStep2
            docSettings={docSettings}
            setDocSettings={setDocSettings}
            secondParty={secondParty}
            setSecondParty={setSecondParty}
          />
        )}
        {activeStep === 3 && (
          <InternStep3 firstParty={firstParty} setFirstParty={setFirstParty} onClearError={onClearError} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6 gap-3">
        <button
          onClick={onPrev}
          disabled={activeStep === 1}
          className="flex items-center gap-2 px-5 py-3 border border-[#DBEAFE] hover:border-[#0EA5E9] text-[#334155] font-bold text-sm rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-7 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm rounded-2xl transition shadow-md shadow-[#0EA5E9]/20 cursor-pointer"
        >
          {activeStep === TOTAL_STEPS ? (
            <><Check className="w-4 h-4" /> Preview Offer Letter</>
          ) : (
            <>Next <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </motion.section>
  );
}
