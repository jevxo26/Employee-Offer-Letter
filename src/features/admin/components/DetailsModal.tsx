"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface Props {
  agreementId: string | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="grid grid-cols-5 gap-2 py-1.5 border-b border-[#F1F5F9] last:border-0">
      <span className="col-span-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
        {label}
      </span>
      <span className="col-span-3 text-xs text-[#0F172A] font-medium break-all">
        {String(value)}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] mb-2 pb-1 border-b border-[#DBEAFE]">
        {title}
      </h4>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSection(title: string, obj: Record<string, any> | undefined, skip: string[] = []) {
  if (!obj) return null;
  const entries = Object.entries(obj).filter(
    ([k, v]) =>
      !skip.includes(k) &&
      v !== undefined &&
      v !== null &&
      v !== "" &&
      typeof v !== "object",
  );
  if (!entries.length) return null;
  return (
    <Section title={title}>
      {entries.map(([k, v]) => (
        <Row key={k} label={k.replace(/([A-Z])/g, " $1").trim()} value={v} />
      ))}
    </Section>
  );
}

export default function DetailsModal({ agreementId, onClose }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!agreementId) return;
    setData(null);
    setError("");
    setLoading(true);
    fetch(`/api/offers/${encodeURIComponent(agreementId)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load agreement details.");
        return r.json();
      })
      .then(setData)
      .catch((e: unknown) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [agreementId]);

  if (!agreementId) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DBEAFE] shrink-0">
          <div>
            <h2 className="font-bold text-[#0F172A] text-base">Agreement Details</h2>
            <p className="text-[11px] text-[#64748B] font-mono mt-0.5">{agreementId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 text-sm">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {error}
            </div>
          )}

          {data && !loading && (
            <>
              <Section title="Agreement">
                <Row label="Agreement ID" value={data.agreementId} />
                <Row label="Partner ID" value={data.partnerId} />
                <Row label="Doc Type" value={data.docType} />
                <Row label="Sales Agreement Type" value={data.salesAgreementType} />
                <Row label="Status" value={data.status} />
                <Row label="Founder Signed" value={data.founderSigned ? "Yes" : "No"} />
                <Row label="Partner Signed" value={data.partnerSigned ? "Yes" : "No"} />
                <Row label="Signed At" value={data.signedAt ? new Date(data.signedAt).toLocaleString() : null} />
                <Row label="Created At" value={data.createdAt ? new Date(data.createdAt).toLocaleString() : null} />
                <Row label="Letter Sent To Both" value={data.letterSentToBoth ? "Yes" : "No"} />
                <Row label="ID Card Generated" value={data.idCardGenerated ? "Yes" : "No"} />
              </Section>

              {renderSection("First Party (Company)", data.firstParty, ["signatureImg", "photoUrl"])}
              {renderSection("Second Party (Partner / Agent)", data.secondParty, ["signatureImg", "photoUrl"])}
              {renderSection("Document Settings", data.docSettings, ["salesPartner"])}

              {data.docSettings?.salesPartner && (
                <Section title="Country Sales Partner (for Sales Agent)">
                  {Object.entries(data.docSettings.salesPartner as Record<string, unknown>)
                    .filter(([k, v]) => k !== "signatureImg" && v !== undefined && v !== null && v !== "")
                    .map(([k, v]) => (
                      <Row key={k} label={k.replace(/([A-Z])/g, " $1").trim()} value={String(v)} />
                    ))}
                </Section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
