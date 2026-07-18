"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, Hash } from "lucide-react";
import { SecondParty, DocSettings } from "@/types";
import { Field, IconInput, StepHeader } from "@/shared/ui/FormPrimitives";

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
      if (secondParty.partnerIdSerial && docSettings.refIdSerial) return;
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
    return () => { cancelled = true; };
  }, [buildAgreementId, buildPartnerId, docSettings.refIdSerial, secondParty.partnerIdSerial, setDocSettings, setSecondParty]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (!secondParty.partnerId) return;
      try {
        const res = await fetch(`/api/check-id?action=check&partnerId=${secondParty.partnerId}`);
        const data = await res.json();
        setPartnerWarning(data.partnerTaken ? "⚠️ This Partner ID is already taken." : "");
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

  const handlePartnerSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const serial = e.target.value.replace(/\D/g, "").slice(0, 3);
    setSecondParty((prev) => ({
      ...prev,
      partnerIdSerial: serial,
      partnerId: buildPartnerId(serial),
    }));
  };

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
      return { ...prev, partnerIdSerial: normalized, partnerId: buildPartnerId(normalized) };
    });
  };

  const normalizeRefSerial = () => {
    setDocSettings((prev) => {
      const serial = prev.refIdSerial?.trim() || "";
      const normalized = serial ? serial.padStart(3, "0") : "";
      return { ...prev, refIdSerial: normalized, refId: buildAgreementId(normalized) };
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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

        <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-blue-100/60 p-5 rounded-2xl">
          <div className="mb-4">
            <span className="text-[11px] font-extrabold text-[#2563EB] uppercase tracking-widest flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> UNIQUE IDENTIFIERS
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              Enter only the last 3 digits. Full IDs will be generated automatically.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
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
            <input type="range" min="1" max="100" value={docSettings.equityShare} onChange={numericSetter("equityShare", 1, 100)} className="flex-1 accent-[#2563EB] cursor-pointer" />
            <input type="number" min="1" max="100" value={docSettings.equityShare} onChange={numericSetter("equityShare", 1, 100)} className="w-[60px] text-center bg-white border border-[#DBEAFE] rounded-xl py-1.5 text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]" />
          </div>
          <p className="text-[10px] text-[#64748B] italic">Configures partner equity share percentages.</p>
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
            <input type="range" min="1" max="24" value={docSettings.minimumServicePeriod} onChange={numericSetter("minimumServicePeriod", 1, 24)} className="flex-1 accent-[#2563EB] cursor-pointer" />
            <input type="number" min="1" max="24" value={docSettings.minimumServicePeriod} onChange={numericSetter("minimumServicePeriod", 1, 24)} className="w-[60px] text-center bg-white border border-[#DBEAFE] rounded-xl py-1.5 text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]" />
          </div>
          <p className="text-[10px] text-[#64748B] italic">Minimum timeline before partner is equity-eligible.</p>
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
            <input type="range" min="1" max="90" value={docSettings.noticePeriod} onChange={numericSetter("noticePeriod", 1, 90)} className="flex-1 accent-[#2563EB] cursor-pointer" />
            <input type="number" min="1" max="90" value={docSettings.noticePeriod} onChange={numericSetter("noticePeriod", 1, 90)} className="w-[60px] text-center bg-white border border-[#DBEAFE] rounded-xl py-1.5 text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
