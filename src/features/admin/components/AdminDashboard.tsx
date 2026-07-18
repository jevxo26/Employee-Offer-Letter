"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  RefreshCw,
  Send,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { AgreementSummary } from "@/types";
import { buildVerifyUrl } from "@/lib/verifyUrl";

interface AdminDashboardProps {
  onBack: () => void;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "FULLY_EXECUTED") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="w-3 h-3" /> Executed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> Pending Signature
    </span>
  );
}

function DocTypeBadge({ docType, salesAgreementType }: { docType: string; salesAgreementType?: string }) {
  if (salesAgreementType === "countrySales" || docType === "Country Sales Partner Agreement & ID Card") {
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
        Country Sales Partner
      </span>
    );
  }
  if (salesAgreementType === "salesAgent" || docType === "Sales Agent Agreement & ID Card") {
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
        Sales Agent
      </span>
    );
  }
  if (docType?.includes("Intern") || docType === "Intern Offerletter & ID Card") {
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
        Internship
      </span>
    );
  }
  return (
    <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
      Partner
    </span>
  );
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [agreements, setAgreements] = useState<AgreementSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "executed">("all");

  const loadAgreements = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to load agreements.");
      const data = await res.json();
      setAgreements(data.agreements || []);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to load agreements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAgreements();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadAgreements]);

  const handleResend = async (agreementId: string) => {
    setResendingId(agreementId);
    try {
      const res = await fetch(`/api/offers/${agreementId}/resend`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resend failed.");
      alert("Signing link resent to partner successfully.");
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setResendingId(null);
    }
  };

  const filtered = agreements.filter((a) => {
    if (filter === "pending") return a.status === "PENDING_PARTNER_SIGNATURE";
    if (filter === "executed") return a.status === "FULLY_EXECUTED";
    return true;
  });

  const stats = {
    total: agreements.length,
    pending: agreements.filter((a) => a.status === "PENDING_PARTNER_SIGNATURE").length,
    executed: agreements.filter((a) => a.status === "FULLY_EXECUTED").length,
  };

  return (
    <motion.section
      key="adminDashboard"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 px-4 md:px-8 py-8 max-w-6xl mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-[#64748B] hover:text-[#2563EB] flex items-center gap-1.5 mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Doc Select
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A]">Agreement Registry</h1>
          <p className="text-sm text-[#64748B] mt-1">
            View all generated documents, track status, and resend signing links.
          </p>
        </div>
        <button
          onClick={loadAgreements}
          disabled={loading}
          className="self-start flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DBEAFE] hover:border-[#2563EB] rounded-xl text-xs font-bold text-[#2563EB] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, color: "#2563EB" },
          { label: "Pending", value: stats.pending, color: "#D97706" },
          { label: "Executed", value: stats.executed, color: "#059669" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white border border-[#DBEAFE] rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black" style={{ color }}>
              {value}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "pending", "executed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer transition ${
              filter === f
                ? "bg-[#2563EB] text-white"
                : "bg-white border border-[#DBEAFE] text-[#64748B] hover:border-[#2563EB]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#DBEAFE] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#64748B]">
            No agreements found in the registry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#DBEAFE] bg-[#F8FAFC] text-left">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Agreement
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Partner
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Created
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.agreementId} className="border-b border-[#DBEAFE]/60 hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-[#0F172A] text-xs">
                        {a.agreementId}
                      </div>
                      <div className="mt-0.5">
                        <DocTypeBadge
                          docType={a.docType}
                          salesAgreementType={a.salesAgreementType}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#0F172A]">{a.partnerName}</div>
                      <div className="text-[11px] text-[#64748B]">{a.partnerEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {a.status === "PENDING_PARTNER_SIGNATURE" && (
                          <button
                            onClick={() => handleResend(a.agreementId)}
                            disabled={resendingId === a.agreementId}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#DBEAFE] rounded-lg text-[10px] font-bold text-[#2563EB] cursor-pointer disabled:opacity-50"
                          >
                            {resendingId === a.agreementId ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                            Resend
                          </button>
                        )}
                        <a
                          href={buildVerifyUrl(a.agreementId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg text-[10px] font-bold text-[#64748B] hover:text-[#2563EB]"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          Verify
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.section>
  );
}
