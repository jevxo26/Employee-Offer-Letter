"use client";

import React from "react";
import { motion } from "motion/react";
import {
  User,
  Briefcase,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  Hash,
  Check,
  Upload,
} from "lucide-react";
import SignaturePad from "./SignaturePad";
import { FirstParty, SecondParty, DocSettings } from "../types";

// ─── Shared field wrapper ─────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  children: React.ReactNode;
}
function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">{label}</label>
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

function StepHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-b border-[#DBEAFE] pb-2 mb-4">
      <h3 className="text-[#0F172A] font-bold text-base">{title}</h3>
      <p className="text-[#64748B] text-xs">{desc}</p>
    </div>
  );
}

// ─── Step 1: Personal Info ────────────────────────────────────────────────────
export interface InternStep1Props {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}
export function InternStep1({ secondParty, setSecondParty }: InternStep1Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <StepHeader
        title="Section 1: Personal Information"
        desc="Enter the intern's basic details for the offer letter."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Full Name *">
          <IconInput
            icon={User}
            type="text"
            placeholder="e.g. Mohammad Abdul Mazed"
            value={secondParty.fullName}
            onChange={(e) => setSecondParty((p) => ({ ...p, fullName: e.target.value }))}
          />
        </Field>

        <Field label="Internship Position *">
          <IconInput
            icon={Briefcase}
            type="text"
            placeholder="e.g. Frontend Developer Intern"
            value={secondParty.position}
            onChange={(e) => setSecondParty((p) => ({ ...p, position: e.target.value }))}
          />
        </Field>

        <Field label="National ID (NID) Number *">
          <IconInput
            icon={ShieldCheck}
            type="text"
            placeholder="e.g. 123XXXXX321"
            value={secondParty.nidNumber}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, nidNumber: e.target.value.replace(/\D/g, "") }))
            }
          />
        </Field>

        <Field label="Email Address *">
          <IconInput
            icon={Mail}
            type="email"
            placeholder="e.g. intern@example.com"
            value={secondParty.email}
            onChange={(e) => setSecondParty((p) => ({ ...p, email: e.target.value }))}
          />
        </Field>

        <Field label="Phone Number *">
          <IconInput
            icon={Phone}
            type="text"
            placeholder="e.g. 01XXXXXXXXX"
            value={secondParty.mobileNumber}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, mobileNumber: e.target.value.replace(/[^\d+]/g, "") }))
            }
          />
        </Field>
      </div>
    </motion.div>
  );
}

// ─── Step 2: Terms ────────────────────────────────────────────────────────────
export interface InternStep2Props {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}
export function InternStep2({ docSettings, setDocSettings, secondParty, setSecondParty }: InternStep2Props) {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const [internWarning, setInternWarning] = React.useState("");
  const [refWarning, setRefWarning] = React.useState("");

  const buildInternId  = React.useCallback(
    (serial: string) => serial ? `JVX-INT-${currentYearStr}-${serial.padStart(3, "0")}` : "",
    [currentYearStr],
  );
  const buildRefId = React.useCallback(
    (serial: string) => serial ? `JVX-INT-REF-${currentYearStr}-${serial.padStart(3, "0")}` : "",
    [currentYearStr],
  );

  // Auto-load next intern IDs on mount
  React.useEffect(() => {
    if (docSettings.internIdSerial && docSettings.internRefIdSerial) return;
    let cancelled = false;
    fetch("/api/check-id?action=nextIntern")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const internSerial  = data.internId?.split("-").pop() || "001";
        const refSerial = data.internRefId?.split("-").pop() || "001";
        setSecondParty((p) => ({ ...p, partnerId: data.internId, partnerIdSerial: internSerial }));
        setDocSettings((p) => ({
          ...p,
          internId: data.internId,
          internIdSerial: internSerial,
          internRefId: data.internRefId,
          internRefIdSerial: refSerial,
        }));
      })
      .catch(console.error);
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Duplicate-check for intern ID
  React.useEffect(() => {
    if (!secondParty.partnerId) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/check-id?action=check&partnerId=${secondParty.partnerId}`);
        const d = await r.json();
        setInternWarning(d.partnerTaken ? "⚠️ This Intern ID is already taken." : "");
      } catch { /* ignore */ }
    }, 500);
    return () => clearTimeout(t);
  }, [secondParty.partnerId]);

  // Duplicate-check for ref ID
  React.useEffect(() => {
    if (!docSettings.internRefId) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/check-id?action=check&agreementId=${docSettings.internRefId}`);
        const d = await r.json();
        setRefWarning(d.agreementTaken ? "⚠️ This Ref ID is already taken." : "");
      } catch { /* ignore */ }
    }, 500);
    return () => clearTimeout(t);
  }, [docSettings.internRefId]);

  const handleInternSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const serial = e.target.value.replace(/\D/g, "").slice(0, 3);
    const id = buildInternId(serial);
    setSecondParty((p) => ({ ...p, partnerIdSerial: serial, partnerId: id }));
    setDocSettings((p) => ({ ...p, internIdSerial: serial, internId: id }));
  };
  const handleRefSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const serial = e.target.value.replace(/\D/g, "").slice(0, 3);
    setDocSettings((p) => ({ ...p, internRefIdSerial: serial, internRefId: buildRefId(serial) }));
  };
  const normalizeInternSerial = () => {
    const serial = (docSettings.internIdSerial || "").padStart(3, "0");
    const id = buildInternId(serial);
    setSecondParty((p) => ({ ...p, partnerIdSerial: serial, partnerId: id }));
    setDocSettings((p) => ({ ...p, internIdSerial: serial, internId: id }));
  };
  const normalizeRefSerial = () => {
    const serial = (docSettings.internRefIdSerial || "").padStart(3, "0");
    setDocSettings((p) => ({ ...p, internRefIdSerial: serial, internRefId: buildRefId(serial) }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 2: Internship Terms"
        desc="Set the offer date, duration, compensation type, and unique identifiers."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="col-span-1 md:col-span-2">
          <Field label="Offer Date *">
            <IconInput
              icon={Calendar}
              type="text"
              placeholder="e.g. July 4, 2026"
              value={docSettings.date}
              onChange={(e) => setDocSettings((p) => ({ ...p, date: e.target.value }))}
            />
          </Field>
        </div>

        {/* Duration */}
        <Field label="Internship Duration *">
          <IconInput
            icon={Calendar}
            type="text"
            placeholder="e.g. 3 months"
            value={docSettings.internshipDuration || ""}
            onChange={(e) => setDocSettings((p) => ({ ...p, internshipDuration: e.target.value }))}
          />
        </Field>

        {/* Paid / Unpaid */}
        <Field label="Compensation Type *">
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((paid) => (
              <button
                key={String(paid)}
                type="button"
                onClick={() => setDocSettings((p) => ({ ...p, isPaid: paid }))}
                className={`py-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  docSettings.isPaid === paid
                    ? "bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]"
                    : "bg-[#F8FAFC] border-[#DBEAFE] text-[#334155] hover:border-[#2563EB]"
                }`}
              >
                {paid ? "Paid Internship" : "Unpaid Internship"}
              </button>
            ))}
          </div>
        </Field>

        {/* Unique IDs */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-blue-100/60 p-5 rounded-2xl">
          <div className="mb-4">
            <span className="text-[11px] font-extrabold text-[#2563EB] uppercase tracking-widest flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> UNIQUE IDENTIFIERS
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Enter only the last 3 digits. Full IDs are generated automatically.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Intern ID */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide block mb-1.5">Intern ID</label>
              <div className="flex items-stretch bg-white border border-[#DBEAFE] focus-within:border-[#2563EB] rounded-xl overflow-hidden h-12">
                <div className="flex items-center px-3 bg-[#F8FAFC] border-r border-[#DBEAFE] text-slate-400 font-bold font-mono text-sm select-none">
                  JVX-INT-{currentYearStr}-
                </div>
                <input
                  type="text"
                  maxLength={3}
                  value={docSettings.internIdSerial || ""}
                  onChange={handleInternSerialChange}
                  onBlur={normalizeInternSerial}
                  className="flex-1 bg-transparent px-4 text-sm font-mono font-black focus:outline-none"
                  placeholder="001"
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <p className={`text-xs font-mono font-bold ${internWarning ? "text-rose-600" : "text-emerald-600"}`}>
                  {docSettings.internId}
                </p>
                {internWarning && <p className="text-[10px] text-rose-600 font-bold">{internWarning}</p>}
              </div>
            </div>
            {/* Ref ID */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide block mb-1.5">Reference ID</label>
              <div className="flex items-stretch bg-white border border-[#DBEAFE] focus-within:border-[#2563EB] rounded-xl overflow-hidden h-12">
                <div className="flex items-center px-3 bg-[#F8FAFC] border-r border-[#DBEAFE] text-slate-400 font-bold font-mono text-xs select-none">
                  JVX-INT-REF-{currentYearStr}-
                </div>
                <input
                  type="text"
                  maxLength={3}
                  value={docSettings.internRefIdSerial || ""}
                  onChange={handleRefSerialChange}
                  onBlur={normalizeRefSerial}
                  className="flex-1 bg-transparent px-4 text-sm font-mono font-black focus:outline-none"
                  placeholder="001"
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <p className={`text-xs font-mono font-bold ${refWarning ? "text-rose-600" : "text-emerald-600"}`}>
                  {docSettings.internRefId}
                </p>
                {refWarning && <p className="text-[10px] text-rose-600 font-bold">{refWarning}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 3: Signature ────────────────────────────────────────────────────────
export interface InternStep3Props {
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  onClearError: () => void;
}
export function InternStep3({ firstParty, setFirstParty, onClearError }: InternStep3Props) {
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
        title="Section 3: Founder & CEO Authorization"
        desc="Sign the offer letter as the issuing authority."
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
          <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          <Upload className="w-8 h-8 text-[#64748B] group-hover:text-[#2563EB] transition transform group-hover:scale-105" />
          <p className="text-xs text-[#334155] font-semibold uppercase tracking-wider">Drag & drop or select</p>
          <p className="text-[10px] text-[#64748B] leading-relaxed max-w-[280px]">PNG, JPG, or SVG — clear ink signature.</p>
        </div>

        {firstParty.signatureImg && (
          <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#DBEAFE] rounded-xl shrink-0">
                <img src={firstParty.signatureImg} alt="Signature Preview" className="w-12 h-8 object-contain bg-white rounded-md" />
              </div>
              <div>
                <p className="text-xs text-[#2563EB] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Signature Active
                </p>
                <p className="text-[10px] text-[#64748B]">Export-ready image synced</p>
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
    </motion.div>
  );
}
