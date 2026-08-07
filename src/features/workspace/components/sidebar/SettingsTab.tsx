"use client";

import React from "react";
import { DocSettings, AgreementTemplate, SalesAgreementType } from "@/types";
import { SliderField, TextInput } from "@/shared/ui/FormPrimitives";

// ─── Internship settings tab ─────────────────────────────────────────────────
interface InternshipSettingsTabProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export function InternshipSettingsTab({ docSettings, setDocSettings }: InternshipSettingsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">Offer Date</label>
        <input
          type="text"
          placeholder="e.g. July 4, 2026"
          value={docSettings.date}
          onChange={(e) => setDocSettings((p) => ({ ...p, date: e.target.value }))}
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-2.5 px-3 text-xs md:text-sm text-[#0F172A] focus:outline-none transition"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">Internship Duration</label>
          <span className="text-xs text-[#2563EB] font-extrabold">{Number(docSettings.internshipDuration) || 1} Months</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={12}
            value={Number(docSettings.internshipDuration) || 1}
            onChange={(e) => {
              const months = parseInt(e.target.value, 10);
              const expiry = new Date();
              expiry.setMonth(expiry.getMonth() + months);
              const expiryStr = expiry.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
              setDocSettings((p) => ({ ...p, internshipDuration: String(months), internExpiryDate: expiryStr }));
            }}
            className="flex-1 accent-[#2563EB] cursor-pointer"
          />
          <input
            type="number"
            min={1}
            max={12}
            value={Number(docSettings.internshipDuration) || 1}
            onChange={(e) => {
              const months = Math.min(12, Math.max(1, parseInt(e.target.value) || 1));
              const expiry = new Date();
              expiry.setMonth(expiry.getMonth() + months);
              const expiryStr = expiry.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
              setDocSettings((p) => ({ ...p, internshipDuration: String(months), internExpiryDate: expiryStr }));
            }}
            className="w-[60px] text-center bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-1 text-[#0F172A] text-xs font-bold"
          />
        </div>
        <p className="text-[10px] text-[#64748B] italic">
          ID card expiry: <strong className="text-[#2563EB]">{docSettings.internExpiryDate || "—"}</strong>
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">Compensation Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map((paid) => (
            <button
              key={String(paid)}
              type="button"
              onClick={() => setDocSettings((p) => ({ ...p, isPaid: paid }))}
              className={`py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${docSettings.isPaid === paid
                ? "bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]"
                : "bg-white border-[#DBEAFE] text-[#334155] hover:border-[#2563EB]"
                }`}
            >
              {paid ? "Paid" : "Unpaid"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">Intern ID</label>
        <input
          type="text"
          value={docSettings.internId || ""}
          readOnly
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-mono font-bold"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">Reference ID</label>
        <input
          type="text"
          value={docSettings.internRefId || ""}
          readOnly
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-mono font-bold"
        />
      </div>
    </div>
  );
}

// ─── Standard Partner settings tab ───────────────────────────────────────────
interface SettingsTabProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export function SettingsTab({ docSettings, setDocSettings }: SettingsTabProps) {
  const numericSetter =
    (key: keyof DocSettings, min: number, max: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setDocSettings((p) => ({
          ...p,
          [key]: Math.min(max, Math.max(min, parseInt(e.target.value) || min)),
        }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">
          Signing Date
        </label>
        <input
          type="text"
          placeholder="e.g. June 10, 2026"
          value={docSettings.date}
          onChange={(e) =>
            setDocSettings((p) => ({ ...p, date: e.target.value }))
          }
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-2.5 px-3 text-xs md:text-sm text-[#0F172A] focus:outline-none transition"
        />
      </div>

      <SliderField
        label="Equity Share Allocation"
        value={docSettings.equityShare}
        suffix="%"
        min={1}
        max={100}
        onChange={numericSetter("equityShare", 1, 100)}
        hint='Preformatted clause automatically updates to "seven (7) percent".'
      />

      <SliderField
        label="Minimum Probation Period"
        value={docSettings.minimumServicePeriod}
        suffix=" Months"
        min={1}
        max={24}
        onChange={numericSetter("minimumServicePeriod", 1, 24)}
        hint='Generates standard phrase string like "four (4) months" recursively.'
      />

      <SliderField
        label="Notice Period Days"
        value={docSettings.noticePeriod}
        suffix=" Days"
        min={1}
        max={90}
        onChange={numericSetter("noticePeriod", 1, 90)}
      />
    </div>
  );
}

// ─── HR Hiring Notice settings tab ──────────────────────────────────────────
export function HRSettingsTab({ docSettings, setDocSettings }: SettingsTabProps) {
  const set = (patch: Partial<DocSettings>) => setDocSettings((p) => ({ ...p, ...patch }));
  const skills = docSettings.hrRequiredSkills || [];

  return (
    <div className="space-y-4">
      <TextInput label="Notice Date" value={docSettings.date} onChange={(e) => set({ date: e.target.value })} />
      <TextInput label="Recipient Role" value={docSettings.hrRecipientRole || ""} onChange={(e) => set({ hrRecipientRole: e.target.value })} />
      <TextInput label="Notice Title" value={docSettings.hrNoticeTitle || ""} onChange={(e) => set({ hrNoticeTitle: e.target.value })} />
      <TextInput label="Subject" value={docSettings.hrSubject || ""} onChange={(e) => set({ hrSubject: e.target.value })} />
      <TextInput label="Position Name" value={docSettings.hrPositionName || ""} onChange={(e) => set({ hrPositionName: e.target.value })} />
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">Vacancies</label>
        <input type="number" min={1} max={99} value={docSettings.hrVacancies ?? 1} onChange={(e) => set({ hrVacancies: Math.max(1, parseInt(e.target.value) || 1) })} className="w-full bg-[#F1F5F9] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-2.5 px-3 text-xs md:text-sm text-[#0F172A] focus:outline-none transition" />
      </div>
      <TextInput label="Department" value={docSettings.hrDepartment || ""} onChange={(e) => set({ hrDepartment: e.target.value })} />
      <TextInput label="Employment Type" value={docSettings.hrEmploymentType || ""} onChange={(e) => set({ hrEmploymentType: e.target.value })} />
      <TextInput label="Work Mode" value={docSettings.hrWorkMode || ""} onChange={(e) => set({ hrWorkMode: e.target.value })} />
      <TextInput label="Location" value={docSettings.hrLocation || ""} onChange={(e) => set({ hrLocation: e.target.value })} />
      <TextInput label="Recruitment Start Date" value={docSettings.hrRecruitmentStartDate || ""} onChange={(e) => set({ hrRecruitmentStartDate: e.target.value })} />
      <TextInput label="Recruitment End Date" value={docSettings.hrRecruitmentEndDate || ""} onChange={(e) => set({ hrRecruitmentEndDate: e.target.value })} />
      <TextInput label="Prepared By" value={docSettings.hrPreparedByName || ""} onChange={(e) => set({ hrPreparedByName: e.target.value })} />
      <TextInput label="Designation" value={docSettings.hrPreparedByDesignation || ""} onChange={(e) => set({ hrPreparedByDesignation: e.target.value })} />
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">Notice Reference ID</label>
        <input type="text" value={docSettings.hrNoticeRefId || ""} readOnly className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-mono font-bold" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">Required Skills</label>
        <div className="flex gap-2">
          <SkillInput skills={skills} setDocSettings={setDocSettings} />
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {skills.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 cursor-pointer" onClick={() => set({ hrRequiredSkills: skills.filter((_, idx) => idx !== i) })}>
                {s} <span className="text-violet-400 font-black">×</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillInput({ skills, setDocSettings }: { skills: string[]; setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>> }) {
  const [val, setVal] = React.useState("");
  const add = () => {
    const t = val.trim();
    if (t && !skills.includes(t)) {
      setDocSettings((p) => ({ ...p, hrRequiredSkills: [...(p.hrRequiredSkills || []), t] }));
      setVal("");
    }
  };
  return (
    <>
      <input type="text" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Add skill…" className="flex-1 bg-[#F1F5F9] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-lg py-1.5 px-2.5 text-xs text-[#0F172A] focus:outline-none transition" />
      <button type="button" onClick={add} className="px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-[#6D28D9] transition">Add</button>
    </>
  );
}

// ─── Sales settings tab ───────────────────────────────────────────────────────
export function SalesSettingsTab({ docSettings, setDocSettings, salesAgreementType }: SettingsTabProps & { salesAgreementType: SalesAgreementType }) {
const isCSP = salesAgreementType === "countrySales";
const setNumber = (key: keyof DocSettings, min: number, max: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
  setDocSettings((p) => ({ ...p, [key]: Math.min(max, Math.max(min, Number(e.target.value) || min)) }));
const setNotice = (e: React.ChangeEvent<HTMLInputElement>) =>
  setDocSettings((p) => ({ ...p, noticePeriodSales: String(Math.min(90, Math.max(1, Number(e.target.value) || 1))) }));

return (
  <div className="space-y-4">
    <TextInput label="Agreement Reference" value={docSettings.salesRefId || ""} onChange={(e) => setDocSettings((p) => ({ ...p, salesRefId: e.target.value }))} />
    <TextInput label="Agreement Date" value={docSettings.date} onChange={(e) => setDocSettings((p) => ({ ...p, date: e.target.value }))} />
    <TextInput label={isCSP ? "Country / Territory" : "Assigned Territory / Region"} value={docSettings.territory || ""} onChange={(e) => setDocSettings((p) => ({ ...p, territory: e.target.value }))} />
    <TextInput label="Governing Jurisdiction" value={docSettings.governingJurisdiction || ""} onChange={(e) => setDocSettings((p) => ({ ...p, governingJurisdiction: e.target.value }))} />
    <SliderField label={isCSP ? "Base Commission" : "Sales Commission"} value={docSettings.baseCommissionRate ?? 10} suffix="%" min={1} max={100} onChange={setNumber("baseCommissionRate", 1, 100)} />
    <SliderField label="Recurring Commission" value={docSettings.recurringCommissionRate ?? 10} suffix="%" min={1} max={100} onChange={setNumber("recurringCommissionRate", 1, 100)} />
    {isCSP && <SliderField label="Override Commission" value={docSettings.overrideCommissionRate ?? 10} suffix="%" min={1} max={100} onChange={setNumber("overrideCommissionRate", 1, 100)} />}
    {isCSP && <SliderField label="Initial Term" value={docSettings.initialTerm ?? 1} suffix=" Year(s)" min={1} max={10} onChange={setNumber("initialTerm", 1, 10)} />}
    <SliderField label="Notice Period" value={Number(docSettings.noticePeriodSales) || 30} suffix=" Days" min={1} max={90} onChange={setNotice} />
    <TextInput label="Payment Currency" value={docSettings.paymentCurrency || ""} onChange={(e) => setDocSettings((p) => ({ ...p, paymentCurrency: e.target.value }))} />
  </div>
);
}

// ─── Intern Certificate settings tab ─────────────────────────────────────────
interface InternCertificateSettingsTabProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export function InternCertificateSettingsTab({
  docSettings,
  setDocSettings,
}: InternCertificateSettingsTabProps) {
  const set = (patch: Partial<DocSettings>) =>
    setDocSettings((p) => ({ ...p, ...patch }));

  return (
    <div className="space-y-4">
      <TextInput
        label="Date of Issue"
        value={docSettings.date}
        onChange={(e) => set({ date: e.target.value })}
      />
      <TextInput
        label="Performance Rating / Grade"
        value={docSettings.certPerformanceGrade || ""}
        onChange={(e) => set({ certPerformanceGrade: e.target.value })}
      />
      <TextInput
        label="Internship Start Date"
        value={docSettings.certStartDate || ""}
        onChange={(e) => set({ certStartDate: e.target.value })}
      />
      <TextInput
        label="Internship End Date"
        value={docSettings.certEndDate || ""}
        onChange={(e) => set({ certEndDate: e.target.value })}
      />
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
          Certificate ID
        </label>
        <input
          type="text"
          value={docSettings.certId || ""}
          readOnly
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-mono font-bold"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
          Certificate Reference ID
        </label>
        <input
          type="text"
          value={docSettings.certRefId || ""}
          readOnly
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-mono font-bold"
        />
      </div>
    </div>
  );
}
