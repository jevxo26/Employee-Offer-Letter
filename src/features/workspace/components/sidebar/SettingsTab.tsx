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
              className={`py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                docSettings.isPaid === paid
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
      <SliderField label="Recurring Commission" value={docSettings.recurringCommissionRate ?? (isCSP ? 12 : 10)} suffix="%" min={1} max={100} onChange={setNumber("recurringCommissionRate", 1, 100)} />
      {isCSP && <SliderField label="Override Commission" value={docSettings.overrideCommissionRate ?? 10} suffix="%" min={1} max={100} onChange={setNumber("overrideCommissionRate", 1, 100)} />}
      <SliderField label="Payment Window" value={docSettings.paymentDays ?? 14} suffix=" Days" min={1} max={90} onChange={setNumber("paymentDays", 1, 90)} />
      <SliderField label="Notice Period" value={Number(docSettings.noticePeriodSales) || 30} suffix=" Days" min={1} max={90} onChange={setNotice} />
      <TextInput label="Payment Currency" value={docSettings.paymentCurrency || ""} onChange={(e) => setDocSettings((p) => ({ ...p, paymentCurrency: e.target.value }))} />
      <TextInput label="Payment Terms" value={docSettings.paymentTerms || ""} onChange={(e) => setDocSettings((p) => ({ ...p, paymentTerms: e.target.value }))} />
    </div>
  );
}
