"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  RefreshCw,
  Send,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Eye,
  FileSearch,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { AgreementSummary } from "@/types";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import { useRegistryData } from "../hooks/useRegistryData";
import RegistryToolbar from "./RegistryToolbar";
import RegistryPagination from "./RegistryPagination";
import DetailsModal from "./DetailsModal";
import PreviewModal from "./PreviewModal";

// ─── Shared badge components ──────────────────────────────────────────────────

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
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

function DocTypeBadge({
  docType,
  salesAgreementType,
}: {
  docType: string;
  salesAgreementType?: string;
}) {
  // Resolve by salesAgreementType first (most reliable), then fallback to docType string
  const isCSP =
    salesAgreementType === "countrySales" ||
    docType === "Country Sales Partner Agreement & ID Card";
  const isSA =
    salesAgreementType === "salesAgent" ||
    docType === "Sales Agent Agreement & ID Card";
  const isIntern =
    !isCSP &&
    !isSA &&
    (docType?.toLowerCase().includes("intern") ||
      docType === "Intern Offerletter & ID Card");

  if (isCSP)
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
        Country Sales Partner
      </span>
    );
  if (isSA)
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
        Sales Agent
      </span>
    );
  if (isIntern)
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
        Internship
      </span>
    );
  return (
    <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
      Partner
    </span>
  );
}

// ─── Row actions ─────────────────────────────────────────────────────────────

interface RowActionsProps {
  agreement: AgreementSummary;
  resendingId: string | null;
  deletingId: string | null;
  onResend: (id: string) => void;
  onDetails: (id: string) => void;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
}

function RowActions({
  agreement: a,
  resendingId,
  deletingId,
  onResend,
  onDetails,
  onPreview,
  onDelete,
}: RowActionsProps) {
  return (
    <div className="flex items-center justify-start gap-3 flex-wrap">
      {a.status !== "FULLY_EXECUTED" && (
        <button
          onClick={() => onResend(a.agreementId)}
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
      <button
        onClick={() => onDetails(a.agreementId)}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg text-[10px] font-bold text-[#64748B] hover:text-[#2563EB] cursor-pointer"
      >
        <Eye className="w-3 h-3" />
        Details
      </button>
      <button
        onClick={() => onPreview(a.agreementId)}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg text-[10px] font-bold text-[#64748B] hover:text-[#2563EB] cursor-pointer"
      >
        <FileSearch className="w-3 h-3" />
        Preview
      </button>
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
      <button
        onClick={() => onDelete(a.agreementId)}
        disabled={deletingId === a.agreementId}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FEE2E2] rounded-lg text-[10px] font-bold text-[#EF4444] cursor-pointer disabled:opacity-50"
      >
        {deletingId === a.agreementId ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Trash2 className="w-3 h-3" />
        )}
        Delete
      </button>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

interface AdminDashboardProps {
  onBack?: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { loading, error, filters, patchFilter, processed, stats, reload, PAGE_SIZE } =
    useRegistryData();

  const [resendingId, setResendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleResend = async (agreementId: string) => {
    setResendingId(agreementId);
    try {
      const res = await fetch(`/api/offers/${agreementId}/resend`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resend failed.");
      
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Signing link resent successfully.",
        confirmButtonColor: "#2563EB",
      });
    } catch (e: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: (e as Error).message,
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (agreementId: string) => {
    const { value: pin } = await Swal.fire({
      title: "Enter security PIN to delete",
      input: "password",
      inputPlaceholder: "Enter security PIN",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
    });

    if (pin === undefined || pin === null) return;
    if (!pin.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "PIN Required",
        text: "A valid PIN is required to perform deletion.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    setDeletingId(agreementId);
    try {
      const res = await fetch(`/api/offers/${agreementId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Document deleted successfully.",
        confirmButtonColor: "#2563EB",
      });
      reload();
    } catch (e: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: (e as Error).message,
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <motion.section
        key="adminDashboard"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex-1 px-4 md:px-8 py-8 max-w-6xl mx-auto w-full"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="text-xs font-semibold text-[#64748B] hover:text-[#2563EB] flex items-center gap-1.5 mb-3 cursor-pointer"
              >
                ← Back to Doc Select
              </button>
            )}
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Agreement Registry
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              View all generated documents, track status, and resend signing links.
            </p>
          </div>
          <button
            onClick={reload}
            disabled={loading}
            className="self-start flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DBEAFE] hover:border-[#2563EB] rounded-xl text-xs font-bold text-[#2563EB] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Agreements", value: stats.total, color: "#2563EB" },
            { label: "Pending Signature", value: stats.pending, color: "#D97706" },
            { label: "Fully Executed", value: stats.executed, color: "#059669" },
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

        {/* Toolbar */}
        <RegistryToolbar filters={filters} onChange={patchFilter} />

        {error && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-[#DBEAFE] rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
            </div>
          ) : processed.list.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#64748B]">
              No agreements match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#DBEAFE] bg-[#F8FAFC] text-center">
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
                  {processed.list.map((a) => (
                    <tr
                      key={a.agreementId}
                      className="border-b border-[#DBEAFE]/60 hover:bg-[#F8FAFC]"
                    >
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
                        <div className="font-semibold text-[#0F172A]">
                          {a.partnerName}
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {a.partnerEmail}
                        </div>
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
                      <td className="px-4 py-3 flex justify-end">
                        <RowActions
                          agreement={a}
                          resendingId={resendingId}
                          deletingId={deletingId}
                          onResend={handleResend}
                          onDetails={setDetailsId}
                          onPreview={setPreviewId}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && processed.total > 0 && (
          <RegistryPagination
            page={processed.safePage}
            totalPages={processed.totalPages}
            total={processed.total}
            pageSize={PAGE_SIZE}
            onPage={(p) => patchFilter({ page: p })}
          />
        )}
      </motion.section>

      {/* Modals — rendered outside the scrollable section */}
      <DetailsModal
        agreementId={detailsId}
        onClose={() => setDetailsId(null)}
      />
      <PreviewModal
        agreementId={previewId}
        onClose={() => setPreviewId(null)}
      />
    </>
  );
}
