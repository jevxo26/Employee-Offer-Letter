"use client";

import React from "react";
import { motion } from "motion/react";
import {
  User,
  Briefcase,
  Calendar,
  ShieldCheck,
  Phone,
  MapPin,
  Check,
  Upload,
  Mail,
  Hash,
} from "lucide-react";
import SignaturePad from "./SignaturePad";
import { FirstParty, SecondParty, DocSettings } from "../types";

// ─── Shared field wrapper ────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ComponentType<{ className?: string }>;
}

function IconInput({ icon: Icon, ...props }: IconInputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
      <input
        className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none transition"
        {...props}
      />
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────
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

// ─── Step 2 ──────────────────────────────────────────────────────────────────
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

// ─── Step 3 ──────────────────────────────────────────────────────────────────
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
              setSecondParty((p) => ({
                ...p,
                email: e.target.value,
              }))
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

// ─── Step 4 (Agreement Settings) ─────────────────────────────────────────────
export interface Step4Props {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}

export function Step4({
  secondParty,
  setSecondParty,
  docSettings,
  setDocSettings,
}: Step4Props) {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const [partnerWarning, setPartnerWarning] = React.useState("");
  const [refWarning, setRefWarning] = React.useState("");

  const buildPartnerId = React.useCallback(
    (serial: string) =>
      serial ? `JVX-PT-${currentYearStr}-${serial.padStart(3, "0")}` : "",
    [currentYearStr]
  );

  const buildAgreementId = React.useCallback(
    (serial: string) =>
      serial ? `JVX-AGR-${currentYearStr}-${serial.padStart(3, "0")}` : "",
    [currentYearStr]
  );

  React.useEffect(() => {
    let cancelled = false;

    async function loadNextIds() {
      if (secondParty.partnerIdSerial && docSettings.refIdSerial) {
        return;
      }

      try {
        const res = await fetch("/api/check-id?action=next");
        if (!res.ok) return;

        const data = await res.json();
        if (cancelled) return;

        setSecondParty((prev) => ({
          ...prev,
          partnerId:
            prev.partnerIdSerial || data.partnerId?.split("-").pop()
              ? buildPartnerId(prev.partnerIdSerial || data.partnerId?.split("-").pop() || "")
              : prev.partnerId,
          partnerIdSerial:
            prev.partnerIdSerial || data.partnerId?.split("-").pop() || prev.partnerIdSerial,
        }));
        setDocSettings((prev) => ({
          ...prev,
          refId:
            prev.refIdSerial || data.agreementId?.split("-").pop()
              ? buildAgreementId(prev.refIdSerial || data.agreementId?.split("-").pop() || "")
              : prev.refId,
          refIdSerial:
            prev.refIdSerial || data.agreementId?.split("-").pop() || prev.refIdSerial,
        }));
      } catch (error) {
        console.error("Failed to load dynamic IDs", error);
      }
    }

    loadNextIds();

    return () => {
      cancelled = true;
    };
  }, [
    buildAgreementId,
    buildPartnerId,
    docSettings.refIdSerial,
    secondParty.partnerIdSerial,
    setDocSettings,
    setSecondParty,
  ]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (!secondParty.partnerId) return;
      try {
        const res = await fetch(`/api/check-id?action=check&partnerId=${secondParty.partnerId}`);
        const data = await res.json();
        setPartnerWarning(
          data.partnerTaken ? "⚠️ This Partner ID is already taken." : "",
        );
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [secondParty.partnerId]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (!docSettings.refId) return;
      try {
        const res = await fetch(`/api/check-id?action=check&agreementId=${docSettings.refId}`);
        const data = await res.json();
        setRefWarning(data.agreementTaken ? "Warning: This Document ID is already taken." : "");
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [docSettings.refId]);

  const numericSetter =
    (key: keyof DocSettings, min: number, max: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(max, Math.max(min, parseInt(e.target.value) || min));
      setDocSettings((p) => ({ ...p, [key]: val }));
    };

  // Handle Partner ID Serial Input
  const handlePartnerSerialChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const serial = e.target.value.replace(/\D/g, "").slice(0, 3);

    setSecondParty((prev) => ({
      ...prev,
      partnerIdSerial: serial,
      partnerId: buildPartnerId(serial),
    }));
  };

  // Handle Document Ref ID Serial Input
  const handleRefSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const serial = e.target.value.replace(/\D/g, "").slice(0, 3);

    setDocSettings((prev) => ({
      ...prev,
      refIdSerial: serial,
      refId: buildAgreementId(serial),
    }));
  };

  const normalizePartnerSerial = () => {
    setSecondParty((prev) => {
      const serial = prev.partnerIdSerial?.trim() || "";
      const normalized = serial ? serial.padStart(3, "0") : "";

      return {
        ...prev,
        partnerIdSerial: normalized,
        partnerId: buildPartnerId(normalized),
      };
    });
  };

  const normalizeRefSerial = () => {
    setDocSettings((prev) => {
      const serial = prev.refIdSerial?.trim() || "";
      const normalized = serial ? serial.padStart(3, "0") : "";

      return {
        ...prev,
        refIdSerial: normalized,
        refId: buildAgreementId(normalized),
      };
    });
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <StepHeader
        title="Section 4: Agreement Parameters"
        desc="Specify signing date and unique identifiers for the partner and document."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <Field label="Signing Date *">
            <IconInput
              icon={Calendar}
              type="text"
              placeholder="e.g. Present Date"
              value={docSettings.date || ""}
              onChange={(e) =>
                setDocSettings((p) => ({ ...p, date: e.target.value }))
              }
            />
          </Field>
        </div>

        {/* === UNIQUE ID SECTION - CLEAN & SIMPLE === */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-blue-100/60 p-5 rounded-2xl">
          <div className="mb-4">
            <span className="text-[11px] font-extrabold text-[#2563EB] uppercase tracking-widest flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> UNIQUE IDENTIFIERS
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              Enter only the last 3 digits. Full IDs will be generated
              automatically.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Partner ID */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide block mb-1.5">
                Partner ID
              </label>
              <div className="flex items-stretch bg-white border border-[#DBEAFE] focus-within:border-[#2563EB] rounded-xl overflow-hidden h-12">
                <div className="flex items-center px-3 bg-[#F8FAFC] border-r border-[#DBEAFE] text-slate-400 font-bold font-mono text-sm select-none">
                  JVX-PT-{currentYearStr}-
                </div>
                <input
                  type="text"
                  maxLength={3}
                  value={secondParty.partnerIdSerial || ""}
                  onChange={handlePartnerSerialChange}
                  onBlur={normalizePartnerSerial}
                  className="flex-1 bg-transparent px-4 text-sm font-mono font-black focus:outline-none"
                  placeholder="001"
                />
              </div>
              <span className="flex justify-around items-center">
              <p className={`mt-1.5 text-xs font-mono font-bold ${partnerWarning ? "text-rose-600" : "text-emerald-600"}`}>
                {secondParty.partnerId}
              </p>
              {partnerWarning && <p className="text-[10px] text-rose-600 font-bold mt-1">{partnerWarning}</p>}
            </span>
            </div>

            {/* Document Reference ID */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide block mb-1.5">
                Document ID
              </label>
              <div className="flex items-stretch bg-white border border-[#DBEAFE] focus-within:border-[#2563EB] rounded-xl overflow-hidden h-12">
                <div className="flex items-center px-3 bg-[#F8FAFC] border-r border-[#DBEAFE] text-slate-400 font-bold font-mono text-sm select-none">
                  JVX-AGR-{currentYearStr}-
                </div>
                <input
                  type="text"
                  maxLength={3}
                  value={docSettings.refIdSerial || ""}
                  onChange={handleRefSerialChange}
                  onBlur={normalizeRefSerial}
                  className="flex-1 bg-transparent px-4 text-sm font-mono font-black focus:outline-none"
                  placeholder="001"
                />
              </div>
              <span className="flex justify-around items-center">
              <p className={`mt-1.5 text-xs font-mono font-bold ${refWarning ? "text-rose-600" : "text-emerald-600"}`}>
                {docSettings.refId}
              </p>
              {refWarning && <p className="text-[10px] text-rose-600 font-bold mt-1">{refWarning}</p>}
            </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
              Equity Share Allocation (%)
            </label>
            <span className="text-sm text-[#2563EB] font-extrabold bg-[#EFF6FF] px-2 py-0.5 border border-[#DBEAFE] rounded-md">
              {docSettings.equityShare}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="100"
              value={docSettings.equityShare}
              onChange={numericSetter("equityShare", 1, 100)}
              className="flex-1 accent-[#2563EB] cursor-pointer"
            />
            <input
              type="number"
              min="1"
              max="100"
              value={docSettings.equityShare}
              onChange={numericSetter("equityShare", 1, 100)}
              className="w-[60px] text-center bg-white border border-[#DBEAFE] rounded-xl py-1.5 text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <p className="text-[10px] text-[#64748B] italic">
            Configures partner equity share percentages.
          </p>
        </div>

        <div className="p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
              Minimum Probation Period (Months)
            </label>
            <span className="text-sm text-[#2563EB] font-extrabold bg-[#EFF6FF] px-2 py-0.5 border border-[#DBEAFE] rounded-md">
              {docSettings.minimumServicePeriod} Months
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="24"
              value={docSettings.minimumServicePeriod}
              onChange={numericSetter("minimumServicePeriod", 1, 24)}
              className="flex-1 accent-[#2563EB] cursor-pointer"
            />
            <input
              type="number"
              min="1"
              max="24"
              value={docSettings.minimumServicePeriod}
              onChange={numericSetter("minimumServicePeriod", 1, 24)}
              className="w-[60px] text-center bg-white border border-[#DBEAFE] rounded-xl py-1.5 text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <p className="text-[10px] text-[#64748B] italic">
            Minimum timeline before partner is equity-eligible.
          </p>
        </div>

        <div className="p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex flex-col gap-2 col-span-1 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
              Notice Period Duration (Days)
            </label>
            <span className="text-sm text-[#2563EB] font-extrabold bg-[#EFF6FF] px-2 py-0.5 border border-[#DBEAFE] rounded-md">
              {docSettings.noticePeriod} Days
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="90"
              value={docSettings.noticePeriod}
              onChange={numericSetter("noticePeriod", 1, 90)}
              className="flex-1 accent-[#2563EB] cursor-pointer"
            />
            <input
              type="number"
              min="1"
              max="90"
              value={docSettings.noticePeriod}
              onChange={numericSetter("noticePeriod", 1, 90)}
              className="w-[60px] text-center bg-white border border-[#DBEAFE] rounded-xl py-1.5 text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 5 (Signature & Signoff) ───────────────────────────────────────────
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
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

// ─── Shared ──────────────────────────────────────────────────────────────────
interface StepHeaderProps {
  title: string;
  desc: string;
}

function StepHeader({ title, desc }: StepHeaderProps) {
  return (
    <div className="border-b border-[#DBEAFE] pb-2 mb-4">
      <h3 className="text-[#0F172A] font-bold text-base">{title}</h3>
      <p className="text-[#64748B] text-xs">{desc}</p>
    </div>
  );
}
