"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Award, ChevronLeft, ChevronRight, Check, Upload, Calendar, User, Briefcase, ShieldCheck, Mail, BookOpen } from "lucide-react";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import SignaturePad from "@/features/candidate-portal/components/SignaturePad";
import { StepHeader } from "@/shared/ui/FormPrimitives";
import { useDataCache, InternOption } from "@/context/DataCacheContext";

const STEP_LABELS = ["1. Intern Lookup & Hydration", "2. Signature Block"];
const TOTAL_STEPS = 2;
const PERFORMANCE_GRADES = ["Outstanding", "Excellent", "Very Good", "Good", "Satisfactory", "Other"];

interface InternCertificateWizardProps {
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

// Keep the local alias so the rest of the file is unchanged
type FetchedIntern = InternOption;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide">
    {label}
    <span className="block mt-1.5">{children}</span>
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#6366F1] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition ${props.className || ""}`}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#6366F1] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition cursor-pointer ${props.className || ""}`}
  />
);

function formatDateForInput(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function formatDateReadable(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InternCertificateWizard({
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
}: InternCertificateWizardProps) {
  const { cache } = useDataCache();
  // Read from cache — populated at login. Fall back to empty array while loading.
  const interns: FetchedIntern[] = cache.internsList ?? [];
  const loading = cache.internsList === null;

  const [selectedInternId, setSelectedInternId] = useState("");
  const [customGrade, setCustomGrade] = useState("");

  const handleInternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedInternId(value);
    onClearError();

    const selected = interns.find((i) => i.internId === value);
    if (selected) {
      setSecondParty((prev) => ({
        ...prev,
        fullName: selected.fullName,
        email: selected.email,
        position: selected.position,
        department: selected.department || "Engineering",
        partnerId: selected.internId,
      }));

      const isCustomGrade = !PERFORMANCE_GRADES.includes(selected.performanceGrade) && selected.performanceGrade !== "";
      setCustomGrade(isCustomGrade ? selected.performanceGrade : "");

      setDocSettings((prev) => ({
        ...prev,
        certOriginalAgreementId: selected.agreementId,
        certInternId: selected.internId,
        certStartDate: formatDateReadable(selected.startDate),
        certEndDate: formatDateReadable(selected.endDate),
        certPerformanceGrade: selected.performanceGrade || "Outstanding",
      }));
    } else {
      setSecondParty((prev) => ({
        ...prev,
        fullName: "",
        email: "",
        position: "",
        department: "",
        partnerId: "",
      }));
      setDocSettings((prev) => ({
        ...prev,
        certOriginalAgreementId: "",
        certInternId: "",
        certStartDate: "",
        certEndDate: "",
        certPerformanceGrade: "Outstanding",
      }));
      setCustomGrade("");
    }
  };

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

  const step1 = (
    <div className="space-y-6">
      <div className="border-b border-[#DBEAFE] pb-4">
        <h3 className="text-[#0F172A] font-bold text-base">Select Intern &amp; Review Details</h3>
        <p className="text-[#64748B] text-xs mt-1">Select an intern with a fully-executed agreement to load their details. You can modify these values if needed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field label="Intern ID Lookup *">
            {loading ? (
              <div className="w-full flex items-center justify-center py-3 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs text-slate-400 font-medium">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#6366F1]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Fetching executed interns...
              </div>
            ) : interns.length === 0 ? (
              <div className="w-full text-center py-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-xl">
                ⚠️ No fully executed internship offer letters found in database.
              </div>
            ) : (
              <Select value={selectedInternId} onChange={handleInternChange}>
                <option value="">— Select Intern —</option>
                {interns.map((i) => (
                  <option key={i.internId} value={i.internId}>
                    {i.internId} — {i.fullName} ({i.position})
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        {selectedInternId && (
          <>
            <Field label="Intern Name *">
              <Input
                value={secondParty.fullName || ""}
                onChange={(e) => setSecondParty((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Intern's Full Name"
              />
            </Field>

            <Field label="Internship Position/Role *">
              <Input
                value={secondParty.position || ""}
                onChange={(e) => setSecondParty((p) => ({ ...p, position: e.target.value }))}
                placeholder="e.g. Frontend Developer Intern"
              />
            </Field>

            <Field label="Department *">
              <Input
                value={secondParty.department || ""}
                onChange={(e) => setSecondParty((p) => ({ ...p, department: e.target.value }))}
                placeholder="e.g. Engineering Department"
              />
            </Field>

            <Field label="Performance Grade *">
              <Select
                value={docSettings.certPerformanceGrade === customGrade ? "Other" : docSettings.certPerformanceGrade || "Outstanding"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Other") {
                    setDocSettings((p) => ({ ...p, certPerformanceGrade: customGrade }));
                  } else {
                    setDocSettings((p) => ({ ...p, certPerformanceGrade: val }));
                  }
                }}
              >
                {PERFORMANCE_GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
              {(docSettings.certPerformanceGrade === customGrade || !PERFORMANCE_GRADES.includes(docSettings.certPerformanceGrade || "")) && (
                <Input
                  className="mt-2"
                  value={customGrade}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomGrade(val);
                    setDocSettings((p) => ({ ...p, certPerformanceGrade: val }));
                  }}
                  placeholder="Enter custom grade (e.g. A+, Outstanding Extraordinaire)"
                />
              )}
            </Field>

            <Field label="Internship Start Date *">
              <Input
                type="date"
                value={formatDateForInput(docSettings.certStartDate || "")}
                onChange={(e) => setDocSettings((p) => ({ ...p, certStartDate: formatDateReadable(e.target.value) }))}
              />
            </Field>

            <Field label="Internship End Date *">
              <Input
                type="date"
                value={formatDateForInput(docSettings.certEndDate || "")}
                onChange={(e) => setDocSettings((p) => ({ ...p, certEndDate: formatDateReadable(e.target.value) }))}
              />
            </Field>

            <div className="md:col-span-2 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Database Synchronization Enabled
              </p>
              <p className="text-[10px] text-indigo-700/80 mt-1 leading-relaxed">
                Edits made to name, role, department, or dates will update the original agreement (ID: <strong className="font-mono">{docSettings.certOriginalAgreementId}</strong>) upon finalizing, maintaining consistent records.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const step2 = (
    <div className="space-y-6">
      <StepHeader
        title="Section 2: CEO & Founder Certificate Authorization"
        desc="Sign the certificate as the issuing authority. This digital signature block will align beautifully at the bottom of the certificate canvas."
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
        <div className="relative border-2 border-dashed border-[#DBEAFE] hover:border-[#6366F1]/50 rounded-2xl p-6 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
          <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          <Upload className="w-8 h-8 text-[#64748B] group-hover:text-[#6366F1] transition transform group-hover:scale-105" />
          <p className="text-xs text-[#334155] font-semibold uppercase tracking-wider">Drag &amp; drop signature photo or click</p>
          <p className="text-[10px] text-[#64748B] leading-relaxed max-w-[280px]">PNG, JPG, or SVG — black or blue ink signature on clean background.</p>
        </div>

        {firstParty.signatureImg && (
          <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#DBEAFE] rounded-xl shrink-0">
                <img src={firstParty.signatureImg} alt="Signature Preview" className="w-12 h-8 object-contain bg-white rounded-md" />
              </div>
              <div>
                <p className="text-xs text-[#6366F1] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Signature Block Active
                </p>
                <p className="text-[10px] text-[#64748B]">Digital signature synced to canvas rendering</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
              className="text-xs text-rose-600 hover:text-rose-500 font-semibold px-2 py-1 cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const stepContent = activeStep === 1 ? step1 : step2;

  return (
    <motion.section
      key="internCertificateForm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Award className="text-[#6366F1] w-6 h-6" />
            Intern Certificate Wizard
          </h2>
          <span className="text-xs bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full text-[#6366F1] font-bold">
            Step {activeStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#DBEAFE] h-2 rounded-full overflow-hidden flex">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${idx + 1 <= activeStep ? "bg-[#6366F1]" : "bg-[#DBEAFE]"
                } ${idx < TOTAL_STEPS - 1 ? "border-r border-white" : ""}`}
            />
          ))}
        </div>

        {/* Step pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {STEP_LABELS.map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition ${idx + 1 === activeStep
                ? "bg-[#6366F1] border-[#6366F1] text-white"
                : idx + 1 < activeStep
                  ? "bg-indigo-50 border-[#6366F1] text-[#6366F1]"
                  : "bg-white border-[#DBEAFE] text-[#94A3B8]"
                }`}
            >
              {idx + 1 < activeStep ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  {label}
                </span>
              ) : (
                label
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Content box */}
      <div className="bg-white border border-[#DBEAFE] rounded-3xl p-6 md:p-8 shadow-sm min-h-[340px]">
        {validationError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
            {validationError}
          </div>
        )}
        {stepContent}
      </div>

      {/* Footer navigation */}
      <div className="flex justify-between mt-6 gap-3">
        <button
          onClick={onPrev}
          disabled={activeStep === 1}
          className="flex items-center gap-2 px-5 py-3 border border-[#DBEAFE] hover:border-[#6366F1] text-[#334155] font-bold text-sm rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-7 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-sm rounded-2xl transition shadow-md shadow-[#6366F1]/20 cursor-pointer"
        >
          {activeStep === TOTAL_STEPS ? (
            <>
              <Check className="w-4 h-4" /> Preview Certificate
            </>
          ) : (
            <>
              Next <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}
